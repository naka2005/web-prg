let canvas;
let context;
const w = 600; // キャンバス、大きさ（幅＝高さ）
const camera = [0, 1, -1]; // カメラ
const ambient_light = 2; // 環境光
const lights = [8, [2, 4, 0]]; // 点高原：強さ、位置
let dist; // 考査までの距離
const labels = ["x", "y", "z", "r", "g", "b"]; // ラベル
// 球：半径、中心RGB(0～9)、鏡面指数、反射(0～9)
const spheres = [
    w,
    [0, -w, 0],
    9,
    9,
    9,
    100,
    3,
    1,
    [0, 1, 6],
    9,
    0,
    0,
    100,
    6,
    1,
    [-2, 1, 3],
    0,
    9,
    0,
    100,
    6,
    1,
    [2, 1, 3],
    0,
    0,
    9,
    100,
    6,
];
function init() {
// キャンバスの取得
    canvas = document.getElementById("tracing");
    context = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = w;
    // パラメーター入力エリアの作成
    const params = document.getElementById("params");
    for (let i = 0; i < 4; i++) {
        const title = document.createElement("span");
        let titleText = "【カメラ】";
        let num = 3;
        if (i > 0) {
            titleText = `【球${i}】`;
            num = 6;
        }
        title.innerText = titleText;
        params.appendChild(title);
        for (let j = 0; j < num; j++) {
            const label = document.createElement("span");
            label.innerText = ` ${labels[j]}:`;
            params.appendChild(label);
            var input = document.createElement("input");
            input.type = "number";
            input.id = `${labels[j]}_${i}`;
            if (j < 3) {
            // 座標の初期値をセット
                input.value = camera[j];
                if (i > 0)
                    input.value = spheres[i * 7 + 1][j];
            }
            else {
            // 色の初期値、範囲をセット
                input.value = spheres[i * 7 - 1 + j];

                0;
            }
            input.min = 0;
            input.max = 9;
        }
        params.appendChild(input);
        const br = document.createElement("br");
        params.appendChild(br);
    }
}
function startDraw() {
// 球の色、座標を取得
    for (let i = 1; i < 4; i++) {
    // 色
        spheres[i * 7 + 2] = document.getElementById(`r_${i}`).value;
        spheres[i * 7 + 3] = document.getElementById(`g_${i}`).value;
        spheres[i * 7 + 4] = document.getElementById(`b_${i}`).value;
        // 座標
        const x = document.getElementById(`x_${i}`).value;
        const y = document.getElementById(`y_${i}`).value;
        const z = document.getElementById(`z_${i}`).value;
        spheres[i * 7 + 1] = [x, y, z];
    }
    // カメラの座標を取得
    camera[0] = document.getElementById("x_0").value;
    camera[1] = document.getElementById("y_0").value;
    camera[2] = document.getElementById("z_0").value;
    // 描画開始
    context.clearRect(0, 0, w, w);
    document.getElementById("message").innerText = "描画開始……";
    setTimeout(draw, 10);
}
function draw() {
// 描画
    const imageData = context.getImageData(0, 0, w, w);
    let index = 0;
    for (let y = w / 2; y > -w / 2; y--) {
        for (let x = -w / 2; x < w / 2; x++) {
            const dir = [x / w, y / w, 1];
            imageData.data[index] = trace_ray(camera, dir, 1, w, 2, 1);
            imageData.data[index + 1] = trace_ray(camera, dir, 1, w, 2, 2);
            imageData.data[index + 2] = trace_ray(camera, dir, 1, w, 2, 3);
            imageData.data[index + 3] = 255;
            index += 4;
        }
    }
    context.putImageData(imageData, 0, 0);
    document.getElementById("message").innerText += "終了！";
}
function dot(A, B) {
// ベクトルA、Bのドット数
    return A[0] * B[0] + A[1] * B[1] + A[2] * B[2];
}
function A_minus_Bk(A, B, k) {
// ベクトルA - ヘクトルB*k
    return [A[0] - B[0] * k, A[1] - B[1] * k, A[2] - B[2] * k];
}
function closest_intersection(B, D, t_min, t_max) {
// 点BからD方向に向かう光線と交差する最も近い球を探す
    dist = w;
    const a = 2 * dot(D, D);
    let index = 0;
    for (let i = 0; i < spheres.length; i += 7) {
        const r = spheres[i];
        const dir = A_minus_Bk(B, spheres[i + 1], 1);
        const b = -2 * dot(dir, D);
        let c = Math.sqrt(b * b - 2 * a * (dot(dir, dir) - r * r));
        if (c != Number.NaN) {
            for (let j = 0; j < 2; j++) {
                c *= -1;
                const d = (b - c) / a;
                if (t_min < d && d < t_max && d < dist) {
                    index = i + 1;
                    dist = d;
                }
            }
        }
    }
    // 球の中心座標のインデックスを返す
    return index;
}
function trace_ray(B, D, t_min, t_max, depth, cIndex) {
// 点BからD方向に向かう光線のレイトレーシング
    const index = closest_intersection(B, D, t_min, t_max);
    if (index == 0)
        return 0;
    // 交点、法線の取得
    const P = A_minus_Bk(B, D, -dist);
    const N = A_minus_Bk(P, spheres[index], 1);
    const n = dot(N, N);
    // 交点から点光源へのベクトル
    const L = A_minus_Bk(lights[1], P, 1);
    const l = dot(N, L);
    // 環境光＋点光源
    let light = ambient_light;
    if (closest_intersection(P, L, 1 / w, 1) == 0) {
        const M = A_minus_Bk(L, N, (2 * l) / n);
        light
        += lights[0]
        * (l / Math.sqrt(dot(L, L) * n)
            + (dot(M, D) / Math.sqrt(dot(M, M) * dot(D, D))) ** spheres[index + 4]);
    }
    // 光の強さから色を計算
    let color = spheres[index + cIndex] * light * 2.8;
    // 反射光のトレーシング
    if (depth > 0) {
        const dir = A_minus_Bk(D, N, (2 * dot(N, D)) / n);
        const rColor = trace_ray(P, dir, 1 / w, w, depth - 1, cIndex);
        const ref = spheres[index + 5] / 9;
        color = rColor * ref + color * (1 - ref);
    }
    // 色を返す
    return color;
}
