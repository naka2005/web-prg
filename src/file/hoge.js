let canvas, context; // キャンバス
const [goal, view] = [500, 50]; // ゴール位置、視界の長さ
let [px, pz, speed] = [0, 0, 0]; // プレイヤーの位置、速度
let startTime = 0;
let timer; // 開始時間、タイマー
let status = "ready"; // ステータス（ready/start）
// コースデータ（0：直進、+：右カーブ、-：左カーブ）
const course = [];
const courseData = [0, 0.3, 0, -0.3, 0, 0.5, -0.5, 0.5, 0, 0];

function init() {
    // キャンバスの取得
    canvas = document.getElementById("course");
    context = canvas.getContext("2d");
    // キーイベントの登録
    document.addEventListener("keydown", move);
    // レコードタイムの読み込み
    const record = localStorage.getItem("race");
    if (record != null)
        document.getElementById("record").innerText = record;
    // コースの作成
    for (let i = 0; i < goal + view; i++) {
        const index = Math.floor((i / goal) * courseData.length);
        const p = Math.floor(Math.random() * 50);
        course[i] = [0, 0];
        if (i < goal)
            course[i] = [courseData[index], p];
    }
    // 初期描画
    update();
}

function startGame() {
    // 初期化
    [px, pz, speed] = [0, 0, 0];
    document.getElementById("start").disabled = true;
    document.getElementById("time").innerText = "--.--";
    document.getElementById("record").classList.remove("red");
    document.getElementById("message").innerText = "";
    update();
    // カウントダウン開始
    startTime = Date.now();
    timer = setInterval(countdown, 20);
}

function countdown() {
    // カウントダウン
    const time = 3 - Math.floor((Date.now() - startTime) / 1000);
    if (time == 0) {
        // スタート
        status = "start";
        startTime = Date.now();
        clearInterval(timer);
        timer = setInterval(update, 20);
    }
    // カウントダウンの描画
    update();
    drawText(time);
    // スピードの表示
    document.getElementById("speed").value = speed;
}

function update() {
    // 更新
    if (speed > 1)
        speed = 1;
    if (status == "start")
        pz += speed;
    // コースの描画
    const [cw, ch] = [canvas.width, canvas.height];
    context.fillStyle = "#333399";
    context.fillRect(0, 0, cw, ch);
    const cz = Math.floor(pz);
    let [r1, r2, ox, oy, ow] = [0, 0, 0, 0, 0];
    for (let i = cz; i < cz + view; i++) {
        // カーブ
        r1 += course[i][0] / 10;
        r2 += r1;
        px -= (speed * r1) / 1000;
        // 疑似3Dコースの中心座標、道幅
        const scale = 1 / (i - cz);
        const x = cw / 2 - Math.floor(((px - r2) * scale * cw) / 2);
        const y = ch / 2 + Math.floor((scale * ch) / 2);
        const w = Math.floor(cw * scale * 1.5);

        // 描画
        if (i != cz) {
            let [c1, c2] = ["#009900", "#CCCCCC"];
            if (i % 2 == 1)
                [c1, c2] = ["#339900", "#CC0000"];
            let [c3, c4, c5] = ["#333333", "#333333", "#3366CC"];
            if (i % 3 == 0)
                c4 = "#CCCCCC";
            if (i > goal - 1 && i < goal + 3) {
                [c3, c4] = ["#CCCC00", "#CCCC00"];
            }
            drawTrapezoid(cw / 2, oy, cw, cw / 2, y, cw, c1);
            drawTrapezoid(ox, oy, ow * 1.2, x, y, w * 1.2, c2);
            drawTrapezoid(ox, oy, ow, x, y, w, c3);
            drawTrapezoid(ox, oy, ow * 0.05, x, y, w * 0.05, c4);
        }
        [ox, oy, ow] = [x, y, w];
    }

    // ゴール判定
    if (pz > goal) {
        status = "ready";
        drawText("GOAL!");
        clearInterval(timer);
        document.getElementById("start").disabled = false;
    }
}

function drawTrapezoid(x1, y1, w1, x2, y2, w2, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x1 - w1 / 2, y1);
    context.lineTo(x1 + w1 / 2, y1);
    context.lineTo(x2 + w2 / 2, y2);
    context.lineTo(x2 - w2 / 2, y2);
    context.fill();
}

function drawText(text) {
    context.font = "bold 100px sans-serif";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillStyle = "#FF0000";
    context.fillText(text, canvas.width / 2, canvas.height / 4);
}

function move(event) {
    if (event.key == "ArrowUp")
        speed += 0.01;
    if (status == "start" && event.key == "ArrowLeft")
        px -= 0.5;
    if (status == "start" && event.key == "ArrowRight")
        px += 0.5;
}
