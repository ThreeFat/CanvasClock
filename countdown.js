/**
 * Created by TL on 2016/8/6 0006.
 */
//常量

//画布大小
var WINDOW_WIDTH = 1200;
var WINDOW_HEIGHT = 768;

//单位圆点半径
var RADIUS = 8;

//初始位置
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;

//截止日期
const endTime = new Date(2016, 7, 9, 21, 30);

//转换时间变量
var curShowTimeSeconds = 0;
//球体数组

var balls = [];
//球体颜色值

const colors = ["#33b5e5", "#0099cc", "#aa66cc", "9933cc", "#99cc00", "#669900", "#ffbb33", "ff8800", "#ff444", "#cc0000"];

// 调用函数
window.onload = function () {
    WINDOW_WIDTH = document.body.clientWidth;
    WINDOW_HEIGHT = document.documentElement.clientHeight;
    var canvas = document.querySelector("#canvas");
    var context = canvas.getContext("2d");
    MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
    MARGIN_TOP = Math.round(WINDOW_HEIGHT / 4);
    canvas.width = WINDOW_WIDTH;
    canvas.height = WINDOW_HEIGHT;
    curShowTimeSeconds = getCurrentShowTimeSeconds();
    setInterval(
        function () {
            render(context);
            update();
        }, 50)
}

//日期对象转换数字函数
function getCurrentShowTimeSeconds() {
    var curTime = new Date();
    var ret = endTime.getTime() - curTime.getTime();
    ret = Math.round(ret / 1000);
    return ret >= 0 ? ret : 0;
}

//更新数据函数
function update() {
    var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    var nextHours = parseInt(nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
    var nextSeconds = nextShowTimeSeconds % 60;

    var curHours = parseInt(curShowTimeSeconds / 3600);
    var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
    var curSeconds = curShowTimeSeconds % 60;
    if (parseInt(nextHours / 10) != parseInt(curHours / 10)) {
        addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(curHours / 10));
    }
    if (parseInt(nextHours % 10) != parseInt(curHours % 10)) {
        addBalls(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
    }
    if (parseInt(nextMinutes / 10) != parseInt(curMinutes / 10)) {
        addBalls(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));

    }
    if (parseInt(nextMinutes % 10) != parseInt(curMinutes % 10)) {
        addBalls(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
    }
    if (parseInt(nextSeconds / 10) != parseInt(curSeconds / 10)) {
        addBalls(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
    }
    if (parseInt(nextSeconds % 10) != parseInt(curSeconds % 10)) {
        addBalls(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds % 10));
    }

    if (nextSeconds != curSeconds) {
        curShowTimeSeconds = nextShowTimeSeconds;
    }
    updateBalls();
}


//球体渲染函数

function addBalls(x, y, num) {
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                var aBall = {
                    x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
                    y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
                    g: 1.5 + Math.random(),
                    vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
                    vy: -10,
                    color: colors[Math.floor(Math.random() * colors.length)]
                }
                balls.push(aBall);
            }
        }
    }
}

//球体运动函数

function updateBalls() {
    for (var i = 0; i < balls.length; i++) {
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
            balls[i].y = WINDOW_HEIGHT - RADIUS;
            balls[i].vy = -balls[i].vy * 0.7;
        }
    }

//从数组中移除离开屏幕的小球

    var cnt = 0;
    for (var i = 0; i < balls.length; i++)
        if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH)
            balls[cnt++] = balls[i];

    while (balls.length > cnt) {
        balls.pop();
    }
}

//渲染函数
function render(cxt) {
    cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
    var hours = parseInt(curShowTimeSeconds / 3600);
    var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60);
    var seconds = curShowTimeSeconds % 60;
    renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), cxt);
    renderDigit(MARGIN_LEFT + 15 * (RADIUS + 1), MARGIN_TOP, parseInt(hours % 10), cxt);
    renderDigit(MARGIN_LEFT + 30 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 39 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
    renderDigit(MARGIN_LEFT + 54 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
    renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
    renderDigit(MARGIN_LEFT + 78 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
    renderDigit(MARGIN_LEFT + 93 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);


    for (var i = 0; i < balls.length; i++) {
        cxt.fillStyle = balls[i].color;
        cxt.beginPath();
        cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
        cxt.closePath();
        cxt.fill();
    }
}


//三阶数组点阵套用函数
function renderDigit(x, y, num, cxt) {
    cxt.fillStyle = "#f92672";
    for (var i = 0; i < digit[num].length; i++) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
                cxt.closePath();
                cxt.fill();
            }
        }
    }
}