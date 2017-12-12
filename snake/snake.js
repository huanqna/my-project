/**************点击按钮切换图片************ */
var rightBtn = document.getElementById("right-btn");
var leftBtn = document.getElementById("left-btn");
var showSnake = document.getElementById("snake");
var img = document.getElementsByClassName("small-snake");
var snakesSpeed = document.getElementById("snakes-speed").firstChild;
var num = 0;

function changeList(){
    var tt = document.getElementById("snake-list-tt").firstChild;
    var snakeInfo = document.getElementById("snake-info");
    if (num % 3 == 0) {
        img[0].src = "img/snake-1-1.png";
        img[1].src = "img/snake-1-2.png";
        img[2].src = "img/snake-1-3.png";
        tt.data = "普通妖兵";
        snakeInfo.innerHTML = "<h3>妖兵资料</h3><li>等级：妖兵一级</li>";
    } else if (num % 3 == 1) {
        img[0].src = "img/snake-2-1.png";
        img[1].src = "img/snake-2-2.png";
        img[2].src = "img/snake-2-3.png";
        tt.data = "中等妖兵";
        snakeInfo.innerHTML = "<h3>妖兵资料</h3><li>等级：妖兵一级</li>";
    } else if (num % 3 == 2) {
        img[0].src = "img/snake-3-1.png";
        img[1].src = "img/snake-3-2.png";
        img[2].src = "img/snake-3-3.png";
        tt.data = "高级妖兵";
        snakeInfo.innerHTML = "<h3>妖兵资料</h3><li>等级：妖兵一级</li>";
    }
    showSnake.src = img[0].src;
}
rightBtn.onclick = function(){
    if(num < 14){
        num += 7;
    }
    changeList();
};
leftBtn.onclick = function () {
    if (num > 0) {
        num -= 7;
    }
    changeList();
};

/*************点击图片显式图片********** */
function changeImg(){
    img[0].onclick = function () {
        showSnake.src = img[0].src;
        snakesSpeed.data = "速度：" + ((num + 3) * 5) + " m/s";
    };
    img[1].onclick = function () {
        showSnake.src = img[1].src;
        snakesSpeed.data = "速度：" + ((num + 5) * 5) + " m/s";
    };
    img[2].onclick = function () {
        showSnake.src = img[2].src;
        snakesSpeed.data = "速度：" + ((num + 7) * 5) + " m/s";
    };
}
changeImg();

/***********打开新窗口 */
var startBtn = document.getElementById("startGame");

startBtn.addEventListener("click", function(){
    var a = showSnake.src;
    var url = "game.html?src="+a;
    window.open(url, "_top");
})
