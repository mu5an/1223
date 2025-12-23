//クリスマスツリー要素を取得(電飾演出用) 
const tree = document.getElementById('tree');
// クリック演出(電飾)ボタンを取得 
const btn = document.getElementById('partyBtn');
//再生するクリスマス音源を取得
const audio = document.getElementById('xmasSound');

const snowBtn = document.getElementById('snowBtn');

let isParty = false;
let isSnowing = false;

btn.addEventListener('click', async () => {
    isParty = !isParty;
    if (isParty) {
        tree.classList.add('party');
        btn.textContent='演出停止';

        try {
            audio.currentTime = 0;

            await audio.play();

            } catch (e) {
                console.warn('Audio play was blocked:', e);
            }
    } else {

        tree.classList.remove('party');

        btn.textContent='+ クリック演出';

        audio.pause(); 
        audio.currentTime = 0;
    }
});

btn.addEventListener('click', async () => {
    isParty = !isParty;

    if (isParty) {
        tree.classList.add('party');
        btn.textContent = '演出停止';
        try {
            audio.currentTime = 0;
            await audio.play();
        } catch (e) {
            console.warn('Audio play was blocked:', e);
        }
    } else {
        tree.classList.remove('party');
        btn.textContent = '+ クリック演出';
        audio.pause();
        audio.currentTime = 0;
    }
});

// --- 雪を降らす処理 (追加) ---
snowBtn.addEventListener('click', () => {
    // 状態を反転
    isSnowing = !isSnowing;

    if (isSnowing) {
        // bodyに .snowing クラスを付与して雪を表示・動かす
        document.body.classList.add('snowing');
        snowBtn.textContent = '❄ 雪を止める';
    } else {
        // クラスを削除して雪を隠す・止める
        document.body.classList.remove('snowing');
        snowBtn.textContent = '❄ 雪を降らす';
    }
});


