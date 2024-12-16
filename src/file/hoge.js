let targetTime, th, tm, ts; // セットした時間、時、分、秒
let startTime, timer; // 開始時間、タイマー
let oText = ""; // 直前に発生したテキスト

function init() {
    // ストップボタンの無効化
    document.getElementById("stop").disabled = true;
}
function startTimer() {
    // セットした時間の取得、読み上げ
    targetTime = document.getElementById("time").value;
    th = Number(targetTime.split(":")[0]);
    tm = Number(targetTime.split(":")[1]);
    ts = Number(targetTime.split(":")[2]);
    if (isNaN(ts))
        ts = 0;
    let text = "スタート、残り、";
    if (th > 0)
        text += `${th}時間`;
    if (tm > 0)
        text += `${tm}分`;
    if (ts > 0)
        text += `${ts}秒`;
    text += "です。";
    oText = "";
    speech(text);
    // タイマースタート
    startTime = Date.now();
    timer = setInterval(update, 100);
    // セット時間、スタートボタンの無効化、ストップボタンの有効化
    document.getElementById("time").disabled = true;
    document.getElementById("start").disabled = true;
    document.getElementById("stop").disabled = false;
}
function stopTimer() {
    // タイマーストップ
    clearInterval(timer);
    // セット時間、スタートボタンの有効化、ストップボタンの無効化
    document.getElementById("time").disabled = false;
    document.getElementById("start").disabled = false;
    document.getElementById("stop").disabled = true;
}
function update() {
    // 経過時間の取得
    const eTime = Math.floor((Date.now() - startTime) / 1000);
    const eText = getTimeText(eTime);
    // 残り時間の取得
    const rTime = th * 3600 + tm * 60 + ts - eTime;
    const rText = getTimeText(rTime);
    // 経過時間、残り時間の表示
    if (rTime < 0) {
        // 終了
        speech("時間です。");
        stopTimer();
        document.getElementById("eTime").innerText = targetTime;
        document.getElementById("rTime").innerText = "00:00:00";
    }
    else {
        document.getElementById("eTime").innerText = eText.HMS;
        document.getElementById("rTime").innerText = rText.HMS;
        // 読み上げ
        let text = "";
        const interval = document.getElementById("interval").value;
        if (eTime > 0 && rTime > 10) {
            // 経過
            if (document.getElementById("elapsed").checked) {
                if (eTime % (interval * 60) == 0) {
                    text = `${eText.jHM}経過。`;
                }
            }
            // 残り
            if (document.getElementById("remaining").checked) {
                if (rTime % (interval * 60) == 0) {
                    text += `残り、${rText.jHM}`;
                }
            }
            if (text != "")
                speech(text);
        }
        // カウントダウン
        if (document.getElementById("countdown").checked) {
            if (rTime < 11) {
                if (rTime > 0)
                    speech(rTime);
                if (rTime == 0)
                    speech("ゼロ");
            }
        }
    }
}
function getTimeText(time) {
    // 時間、分、秒の取得
    const h = Math.floor(time / 3600);
    const m = Math.floor((time - h * 3600) / 60);
    const s = Math.floor(time - h * 3600 - m * 60);
    // 「hh:mm:ss」に変換
    const hh = (`00${h}`).slice(-2);
    const mm = (`00${m}`).slice(-2);
    const ss = (`00${s}`).slice(-2);
    const hms = `${hh}:${mm}:${ss}`;
    // 「h時間m分」に変換
    let hm = "";
    if (h > 0)
        hm += `${h}時間`;
    if (m > 0)
        hm += `${m}分`;
    return { HMS: hms, jHM: hm };
}
function speech(text) {
    // 発声
    if (oText != text) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        utterance.lang = "ja-JP";
        window.speechSynthesis.speak(utterance);
        oText = text;
    }
}
