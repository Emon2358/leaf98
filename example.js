import { NP2, NP21 } from "../dist/np2-wasm.js";

const canvas = document.getElementById('canvas');
const droparea = document.getElementById('droparea');
const fddSelects = ['fdd1', 'fdd2'].map((id) => document.getElementById(id));

let np2;
let currentInputMode = 'english'; // 初期入力モードを英語に設定

async function create_np2() {
    if (np2) return;
    np2 = await NP21.create({
        canvas: document.getElementById('canvas'),
        clk_mult: 8,
        Latencys: 120,
        onDiskChange: (name) => console.log(name + ' changed'),
        onExit: () => { np2.reset(); }
    });
}

function drawInitialContent() {
    canvas.width = 640;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.font = '20px Arial';

    const text = 'Drag & drop HDD disk images here!';
    const textWidth = ctx.measureText(text).width;

    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2;

    ctx.fillStyle = 'black';
    ctx.fillText(text, x, y);
}

async function addImage(file) {
    np2.addDiskImage(file.name, new Uint8Array(await file.arrayBuffer()));
    np2.setHdd(0, file.name);
}

droparea.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
});

droparea.addEventListener('drop', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const files = e.dataTransfer.files;
    let readyToRun = false;
    for (const file of files) {
        if (file.name.match(/\.(hdi)$/i)) {
            await create_np2();
            await addImage(file);
            readyToRun = true;
        } else {
            console.log(`unrecognized image type: ${file.name}`);
        }
    }
    if (np2.state === 'ready' && readyToRun) {
        np2.run();
    }
});

for (let i = 0; i < fddSelects.length; i++) {
    const select = fddSelects[i];
    select.addEventListener('change', (async (ev) => {
        np2.setFdd(i, ev.target.value === '' ? null : ev.target.value);
    }));
}

document.addEventListener('keydown', (event) => {
    if (event.key === '無変換') { // かなキー
        currentInputMode = 'japanese'; // 日本語入力モードに切り替え
        console.log('かなキーが押され、日本語入力モードに切り替えました');
        // 日本語入力を有効にする処理を追加
    } else if (event.key === '変換') { // 英数キー
        currentInputMode = 'english'; // 英語入力モードに切り替え
        console.log('英数キーが押され、英語入力モードに切り替えました');
        // 英語入力を有効にする処理を追加
    }
});

drawInitialContent();
