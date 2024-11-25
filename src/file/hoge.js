const current = Array.from({ length: 25 });
const question = Array.from({ length: 25 });
const answer = Array.from({ length: 25 });
const select = Array.from({ length: 25 }); // 現在のライト（点灯：1，消灯：-1）
// 問題（点灯：1，消灯：-1）
// 解答（未選択：1，選択：-1）
// 選択状況（未選択：1，選択：-1）
function init() {
    // マスの作成
    document.getElementById("game").innerHTML = "";
    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < 5; y++) {
            const masu = document.createElement("div");
            masu.id = `masu_${x + y * 5}`;
            masu.style.top = `${y * 104}px`;
            masu.style.left = `${x * 104}px`;
            masu.onclick = selectMasu;
            masu.innerHTML = "&#x1f4a1;";
            masu.className = "on";
            document.getElementById("game").appendChild(masu);
        }
    }
    // 現在のライト，選択状況の初期化
    for (let i = 0; i < 25; i++) {
        current[i] = 1;
        select[i] = 1;
    }
    // 解答の作成
    for (let j = 0; j < 25; j++) {
        answer[j] = Math.floor(Math.random() * 2) * 2 - 1;
        if (answer[j] == -1) {
            // ライトを反転
            changeLights(j % 5, Math.floor(j / 5));
        }
    }
    // 問題を格納
    for (let k = 0; k < 25; k++) {
        question[k] = current[k];
    }
    // メッセージのクリア
    document.getElementById("message").innerText = "";
}
function resetQuestion() {
    // 問題のリセット
    for (let i = 0; i < 25; i++) {
        current[i] = question[i];
        select[i] = 1;
        const masu = document.getElementById(`manu_${i}`);
        masu.classList.remove("hint");
        if (question[i] == 1) {
            // 点灯
            masu.classList.remove("off");
            masu.classList.add("on");
            masu.innerHTML = "&#x1f4a1;";
        }
        else {
            // 消灯
            masu.classList.remove("on");
            masu.classList.add("off");
            masu.innerHTML = "";
        }
    }
    // メッセージのクリア
    document.getElementById("message").innerText = "";
}
function selectMasu(event) {
    // マスのインデックスを取得
    const index = Number(event.target.id.split("_")[1]);
    // 選択処理
    select[index] *= -1;
    event.target.classList.remove("hint");
    // ライトの反転
    changeLights(index % 5, Math.floor(index / 5));
    // クリア判定
    if (!current.includes(-1)) {
        document.getElementById("message").innerText = "CLEAR!";
    }
    else {
        document.getElementById("message").innerText = "";
    }
}
function changeLights(x, y) {
    // 自身のライトを反転
    switchLights(x, y);
    // 上下左右のライトを反転
    if (x > 0)
        switchLights(x - 1, y);
    if (x < 4)
        switchLights(x + 1, y);
    if (y > 0)
        switchLights(x, y - 1);
    if (y < 4)
        switchLights(x, y + 1);
}
function switchLights(x, y) {
    // ライトを反転
    const index = x + y * 5;
    current[index] *= -1;
    const masu = document.getElementById(`masu_${index}`);
    if (current[index] == 1) {
        // 点灯
        masu.classList.remove("off");
        masu.classList.add("on");
        masu.innerHTML = "&#x1f4a1;";
    }
    else {
        // 消灯
        masu.classList.remove("on");
        masu.classList.add("off");
        masu.innerHTML = "";
    }
}
function showAnswer() {
    // 解答の表示
    for (let i = 0; i < 25; i++) {
        const masu = document.getElementById(`masu_${i}`);
        if ((answer[i] == -1 && select[i] == 1) || (answer[i] == 1 && select[i] == -1)) {
            masu.classList.add("hint");
        }
    }
}
