import { NP2 } from "https://unpkg.com/np2-wasm/dist/np2-wasm.js";

const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('fileInput');

let np2;

// エミュレータを作成
async function initEmulator() {
    np2 = await NP2.create({ canvas });
}

// ディスクイメージをロードして起動
async function loadAndRunDisk(imageData, fileName) {
    const data = new Uint8Array(imageData);

    // ディスクを追加
    np2.addDiskImage(fileName, data);

    // FD0にセット
    np2.setFdd(0, fileName);

    // エミュレータを実行
    np2.run();
}

// 初期化とデフォルトディスクのロード
async function startEmulator() {
    await initEmulator();

    // デフォルトで 'image.d88' をロード
    const resp = await fetch('image.d88');
    const imageData = await resp.arrayBuffer();
    await loadAndRunDisk(imageData, 'image.d88');
}

// ファイル選択時の処理
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        if (!np2) {
            await initEmulator();
        }
        await loadAndRunDisk(e.target.result, file.name);
    };

    reader.readAsArrayBuffer(file);
});

// 初回起動
startEmulator();
