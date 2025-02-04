import { NP2, NP21 } from "https://unpkg.com/np2-wasm/dist/np2-wasm.js";

const canvas = document.getElementById('canvas');
const fileInput = document.getElementById('fileInput');
const resetBtn = document.getElementById('resetBtn');

let np2;

// エミュレータの初期化
async function initEmulator() {
    if (!np2) {
        np2 = await NP2.create({ canvas });
    }
}

// ファイルが選択された時にエミュレータを起動
fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const fileName = file.name;

        if (!np2) {
            await initEmulator();
        }

        // HDIまたはFDIの場合はHDD、D88の場合はFDDにセット
        if (fileName.endsWith('.hdi') || fileName.endsWith('.hdd')) {
            np2.addHardDiskImage(fileName, data);
            np2.setHdd(0, fileName);
        } else if (fileName.endsWith('.d88') || fileName.endsWith('.fdi')) {
            np2.addDiskImage(fileName, data);
            np2.setFdd(0, fileName);
        } else {
            alert('対応していないファイル形式です');
            return;
        }

        np2.run();
    };

    reader.readAsArrayBuffer(file);
});

// リセットボタンでエミュレータを再起動
resetBtn.addEventListener('click', () => {
    if (np2) {
        np2.reset();
    }
});

// 初回ロード時にエミュレータを初期化
initEmulator();
