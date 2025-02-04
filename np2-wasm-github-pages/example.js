import { NP2 } from "https://unpkg.com/np2-wasm/dist/np2-wasm.js";

const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('fileInput');
const resetBtn = document.getElementById('resetBtn');

let np2;

// エミュレータを作成
async function initEmulator() {
    if (!np2) {
        np2 = await NP2.create({ canvas });
    }
}

// ディスクイメージをロードして起動
async function loadAndRunDisk(fileName, fileData) {
    const data = new Uint8Array(fileData);

    if (!np2) {
        await initEmulator();
    }

    if (fileName.endsWith('.hdi') || fileName.endsWith('.hdd')) {
        // HDDとしてセット
        np2.addHardDiskImage(fileName, data);
        np2.setHdd(0, fileName);
    } else if (fileName.endsWith('.d88') || fileName.endsWith('.fdi')) {
        // フロッピーとしてセット
        np2.addDiskImage(fileName, data);
        np2.setFdd(0, fileName);
    } else {
        alert('対応していないファイル形式です');
        return;
    }

    np2.run();
}

// 初回起動（デフォルトの `image.d88` をロード）
async function startEmulator() {
    await initEmulator();

    const resp = await fetch('image.d88');
    const imageData = new Uint8Array(await resp.arrayBuffer());

    await loadAndRunDisk('image.d88', imageData);
}

// ファイル選択時の処理
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        await loadAndRunDisk(file.name, e.target.result);
    };

    reader.readAsArrayBuffer(file);
});

// リセットボタンの処理
resetBtn.addEventListener('click', () => {
    if (np2) {
        np2.reset();
    }
});

// 初回起動
startEmulator();
