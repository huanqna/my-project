var reLoadBtn = document.getElementById("re-load");
var gameOver = document.getElementById("game-over");
var growUp = document.getElementById("food-num").firstChild;
var difSpeed = document.getElementById("dif-speed").firstChild;
var snakeGrade = document.getElementById("snake-grade").firstChild;
var tree = document.getElementById("tree");
tree.style.display = "none";
var tree2 = document.getElementById("tree2");
tree2.style.display = "none";

var speed = 100;
reLoadBtn.onclick = function(){
    location.reload();
}
gameOver.style.display = "none";
/****************画表格 */
var cell = [];
function makeCell() {
    var gameInterface = document.getElementById("game-interface");
    for (var i = 0; i < 22; i++) {
        var trCell = [];
        var tr = gameInterface.appendChild(document.createElement("tr"));
        for (var j = 0; j < 32; j++) {
            var td = gameInterface.appendChild(document.createElement("td"));
            trCell[j] = td;
        }
        cell[i] = trCell;
    }
}
makeCell();
/***********匹配七条小蛇********** */
function chooseSnake(){
    var whichSnake = location.search.slice(-17).toString();
    var src = "img/snake-1-1.png";
    switch (whichSnake){
        case "img/snake-1-1.png":
            src = "url(img/small-snake-11.png)";
            difSpeed.data ="速度：15 m/s";
            speed = 450;
            break;
        case "img/snake-1-2.png":
            src = "url(img/small-snake-12.png)";
            difSpeed.data = "速度：25 m/s";
            speed = 400;
            break;
        case "img/snake-1-3.png":
            src = "url(img/small-snake-13.png)";
            difSpeed.data = "速度：35 m/s";
            speed = 300;
            break;
        case "img/snake-2-1.png":
            src = "url(img/small-snake-21.png)";
            difSpeed.data = "速度：50 m/s";
            speed = 250;
            break;
        case "img/snake-2-2.png":
            src = "url(img/small-snake-22.png)";
            difSpeed.data = "速度：60 m/s";
            speed = 200;
            break; 
        case "img/snake-2-3.png":
            src = "url(img/small-snake-23.png)";
            difSpeed.data = "速度：70 m/s";
            speed = 150;
            break;
        case "img/snake-3-1.png":
            src = "url(img/small-snake-31.png)";
            difSpeed.data = "速度：85 m/s";
            speed = 100;
            break;
        case "img/snake-3-2.png":
            src = "url(img/small-snake-32.png)";
            difSpeed.data = "速度：95 m/s";
            speed = 80;
            break;
        case "img/snake-3-3.png":
            src = "url(img/small-snake-33.png)";
            difSpeed.data = "速度：105 m/s";
            speed = 50;
            break;
    }
    return src;
}

/*****************************************蛇的原型 */
var x = 4;
var y = 0;
var timer = null;
var foodPosition;
var preDirection;
var food = 0;
var stopGroup = [];



var snakeBody = [];
    snakeBody[0] = cell[0][4];
    snakeBody[1] = cell[0][3];
    snakeBody[2] = cell[0][2];
    snakeBody[3] = cell[0][1];
    snakeBody[4] = cell[0][0];
makeSnakeBody(chooseSnake());
makeFood();



/********************************************大循环************************** */
function move(){        
    var direction = arguments[0];
    var num = 0;

        // 限制回退操作
        if((preDirection=="left"&&direction=="right")||(preDirection=="right"&&direction=="left")){
            return;
        }else if((preDirection=="up"&&direction=="down")||(preDirection=="down"&&direction=="up")){
            return;
        }
        clearInterval(timer);
        preDirection = direction;


    switch (direction) {                                       //蛇的移动
        case "right":
            x += 1;
            break;
        case "left":
            x -= 1;
            break;
        case "up":
            y -= 1;
            break;
        case "down":
            y += 1;
            break;
    }


    if (x < 0 || x > 31 || y < 0 || y > 21 || bitItself() || hitTouchStop()) {                        //死法
        clearInterval(timer);
        gameOver.style.display = "block";
        reLoadBtn.focus();
        move()=null;
    } else if(snakeBody[0] == foodPosition) {                                 //撞到食物
        snakeBody.length += 1;
        growUp.data =food;
        changePlace(food);
        makeFood();
    }

    snakeBody.unshift(cell[y][x]);
    snakeBody.pop();
    makeSnakeBody(chooseSnake());
    changeDir(direction);
    if (snakeBody.length >= (food + 5)) {                                      //生成食物
        makeFood();
    }

    timer = setInterval(function () { move(direction) }, speed);
}

/*********************************************************************大循环结束*************8 */
function makeSnakeBody(snakeUrl) {                                                  //蛇的身体
    var len = snakeBody.length;
    snakeBody.forEach(function (item, index, array) {
        item.style.background = snakeUrl + " no-repeat top left 33%";
        item.style.backgroundSize = "80px";
    })
    snakeBody[0].style.background = snakeUrl + " no-repeat top left 99%";
    snakeBody[0].style.backgroundSize = "80px";
    snakeBody[1].style.background = snakeUrl + " no-repeat top left 66%";
    snakeBody[1].style.backgroundSize = "80px";
    snakeBody[len - 2].style.background = snakeUrl + " no-repeat top left";
    snakeBody[len - 2].style.backgroundSize = "80px";
    snakeBody[len - 1].style.background = "transparent";
    snakeBody[len - 1].style.MozTransform = "rotate(0deg)";
}

window.addEventListener("keydown", function (event) {                             //触发移动
    var keyCode = event.keyCode ? event.keyCode : window.event.keyCode
    switch (keyCode) {
        case 37:
        case 65:
            move("left");
            break;
        case 38:
        case 87:
            move("up");
            break;
        case 39:
        case 68:
            move("right");
            break;
        case 40:
        case 83:
            move("down");
            break;
    }
});


/**************************场景变化 */
function changePlace(num){                                                      //不断升级（等级变化与场景变化）
    var result = num/5;
    switch (result) {
        case 0:
            snakeGrade.data = "妖兵一级";
        case 1:
            snakeGrade.data = "妖兵二级";
            for (var i = 0; i < 1; i++) {
                showStop(1);
            };
            break;
        case 2:
            snakeGrade.data = "妖兵三级";
            for (var i = 0; i < 2; i++) {
                showStop(2);
            };
            break;
        case 3:
            snakeGrade.data = "妖将一级";
            for (var i = 0; i < 2; i++) {
                showStop(3);
            };
            tree2.style.display = "block";
            stopGroup.push(cell[12][8]);
            break;
        case 4:
            snakeGrade.data = "妖将二级";
            for (var i = 0; i < 1; i++) {
                showStop(4);
            };
            break;
        case 5:
            snakeGrade.data = "妖将三级";
            for (var i = 0; i < 2; i++) {
                showStop(5);
            };
            break;
        case 6:
            snakeGrade.data = "妖王一级";
            for (var i = 0; i < 2; i++) {
                showStop(3);
            };
            break;
        case 7:
            snakeGrade.data = "妖王二级";
            for (var i = 0; i < 2; i++) {
                showStop(1);
            };
            break;
        case 8:
            snakeGrade.data = "妖王三级";
            for (var i = 0; i < 2; i++) {
                showStop(5);
            };
            break;
        case 9:
            snakeGrade.data = "一方霸主";
            tree2.style.display = "block";
            stopGroup.push(cell[5][4]);
            break;
    }
    return stopGroup;
}
function changeDir(dir) {                                                //蛇图片转方向
    var num = 0;
    switch (dir) { 
        case "right":
            snakeBody[num].style.MozTransform = "rotate(0deg)";
            break;
        case "left":
            snakeBody[num].style.MozTransform = "rotate(180deg)";
            num++;
            break;
        case "up":
            snakeBody[num].style.MozTransform = "rotate(-90deg)";
            num++;
            break;
        case "down":
            snakeBody[num].style.MozTransform = "rotate(90deg)";
            num++;
            break;
    }
}
/**********************************撞自己死、撞阻碍物死 */
function bitItself() {
    for (var i = 1; i < snakeBody.length - 1; i++) {
        if (snakeBody[0] == snakeBody[i]) {
            return true;
        }
    }
    return false;
}
function hitTouchStop() {
    for (var i = 0; i < stopGroup.length; i++) {
        if (snakeBody[0] == stopGroup[i]) {
            return true;
        }
    }
    return false;
}

/******出现不同阻碍物 */
function showStop(){
    switch(arguments[0]){
        case 1:                                                             //出现小草1
            var num1 = Math.floor(Math.random() * 21),
                num2 = Math.floor(Math.random() * 31);
            cell[num1][num2].style.background = "url(img/background-icon.png) top left no-repeat";
            cell[num1][num2].style.backgroundSize = "240px";
            stopGroup.push(cell[num1][num2]);
            break;
        case 2:
            var num1 = Math.floor(Math.random() * 21),                      //出现小草2
                num2 = Math.floor(Math.random() * 31);
            num3 = num1 - 1;
            num4 = num1 - 2;
            cell[num1][num2].style.background = "url(img/background-icon.png) top 30% left no-repeat";
            cell[num1][num2].style.backgroundSize = "240px";
            cell[num3][num2].style.background = "url(img/background-icon.png) top 20% left no-repeat";
            cell[num3][num2].style.backgroundSize = "240px";
            cell[num4][num2].style.background = "url(img/background-icon.png) top 10% left no-repeat";
            cell[num4][num2].style.backgroundSize = "240px";
            stopGroup.push(cell[num1][num2]);
            break;
        case 3:                                                             //出现木桩1
            var num1 = Math.floor(Math.random() * 21),
                num2 = Math.floor(Math.random() * 31);
            num3 = num2 + 1;
            cell[num1][num2].style.background = "url(img/background-icon.png) top 1% left 60% no-repeat";
            cell[num1][num2].style.backgroundSize = "240px";
            cell[num1][num3].style.background = "url(img/background-icon.png) top 1% left 70% no-repeat";
            cell[num1][num3].style.backgroundSize = "240px";
            stopGroup.push(cell[num1][num2]);
            stopGroup.push(cell[num1][num3]);
            break;
        case 4:                                                               //出现石头1
            var num1 = Math.floor(Math.random() * 21),
                num2 = Math.floor(Math.random() * 31);
            num3 = num2 + 1;
            num4 = num1 - 1;
            cell[num1][num2].style.background = "url(img/background-icon.png) top 32% right 9% no-repeat";
            cell[num1][num2].style.backgroundSize = "240px";
            cell[num1][num3].style.background = "url(img/background-icon.png) top 32% right no-repeat";
            cell[num1][num3].style.backgroundSize = "240px";
            cell[num4][num2].style.background = "url(img/background-icon.png) top 22% right 9% no-repeat";
            cell[num4][num2].style.backgroundSize = "240px";
            cell[num4][num3].style.background = "url(img/background-icon.png) top 22% right no-repeat";
            cell[num4][num3].style.backgroundSize = "240px";
            stopGroup.push(cell[num1][num2]);
            stopGroup.push(cell[num1][num3]);
            stopGroup.push(cell[num4][num2]);
            stopGroup.push(cell[num4][num3]);
            break;
        case 5:                                                                //出现木桩2
            var num1 = Math.floor(Math.random() * 21),
                num2 = Math.floor(Math.random() * 31);
            num3 = num2 + 1;
            num4 = num1 - 1;
            cell[num1][num2].style.background = "url(img/background-icon.png) top 12% right 9% no-repeat";
            cell[num1][num2].style.backgroundSize = "240px";
            cell[num1][num3].style.background = "url(img/background-icon.png) top 12% right no-repeat";
            cell[num1][num3].style.backgroundSize = "240px";
            cell[num4][num3].style.background = "url(img/background-icon.png) top 0 right no-repeat";
            cell[num4][num3].style.backgroundSize = "240px";
            stopGroup.push(cell[num1][num3]);
            break;
    }
}

function makeFood() {                                                                //造食物
    foodPosition = cell[Math.floor(Math.random() * 21)][Math.floor(Math.random() * 31)];
    for (var i = 0; i < snakeBody.length; i++) {
        if (foodPosition == snakeBody[i]) {
            arguments.callee();
        } else {
            for (var j = 0; j < stopGroup.length; j++) {
                if (foodPosition == stopGroup[j]) {
                    arguments.callee();
                } 
            }
        }
    }
    foodPosition.style.background = "url(img/food.png)";
    foodPosition.style.backgroundSize = "20px";
    food++;
}