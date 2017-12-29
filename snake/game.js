var reLoadBtn = document.getElementById("re-load"),
    gameOver = document.getElementById("game-over"),
    growUp = document.getElementById("food-num").firstChild,
    difSpeed = document.getElementById("dif-speed").firstChild,
    snakeGrade = document.getElementById("snake-grade").firstChild,
    tree = document.getElementById("tree"),
    tree2 = document.getElementById("tree2"),
    gameInterface = document.getElementById("game-interface");

reLoadBtn.onclick = function () {
    location.reload();
}
gameOver.style.display = "none";

/*******游戏晋级中的两棵树 *************/
tree.style.display = "none";
tree2.style.display = "none";

/**************** 画表格 ***************/
var cell = [];
function makeCell() {
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
/************** 确定蛇移动方向 **********/
var direction = "right",
    preDirection = "right";
window.onkeydown = function (event) {   //电脑的触发方式
    preDirection = direction;
    var keyCode = event.keyCode ? event.keyCode : window.event.keyCode;
    switch (keyCode) {
        case 37:
        case 65:
            direction = "left";
            break;
        case 38:
        case 87:
            direction = "up";
            break;
        case 39:
        case 68:
            direction = "right";
            break;
        case 40:
        case 83:
            direction = "down";
            break;
    }
    clearTimeout(move);
    snakeMove();
};
var startX = 0,      //触摸设备的触发方式
    startY = 0,
    endX = 0,
    endY = 0;
gameInterface.addEventListener("touchstart", function () {
    startX = event.changedTouches[0].pageX;
    startY = event.changedTouches[0].pageY;
}, false)
gameInterface.addEventListener("touchmove", function () {
    event.preventDefault();
    endX = event.changedTouches[0].pageX;
    endY = event.changedTouches[0].pageY;
    var diffX = startX - endX,
        diffY = startY - endY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
            direction = "left";
        } else {
            direction = "right";
        }
    } else if (Math.abs(diffX) < Math.abs(diffY)) {
        if (diffY > 0) {
            direction = "up";
        } else {
            direction = "down";
        }
    } else {
        return;
    }
}, false)
/***************************************** 蛇的原型 **********************************/
function Snake(){
    this.snakeBody = [];
    this.snakeUrl = "url(img/small-snake-11.png)";
    this.speed = 100;
    this.rotate = 0;
    this.x = 4;
    this.y = 0;
    this.go = 0;
}
Snake.prototype = {
    constructor : Snake,
    chooseSnake: function () {            //匹配小蛇链接及速度
        var firstNum = location.search.slice(-7, -6),
            secondNum = location.search.slice(-5, -4);
        this.snakeUrl = "url(img/small-snake-" + firstNum + secondNum + ".png)";
        switch (firstNum) {       
            case "1":
                difSpeed.data = "速度：" + secondNum + "5 m/s";
                this.speed = (300 + (4 - secondNum) * 50);
                break;
            case "2":
                difSpeed.data = "速度：" + (+secondNum + 4) + "0 m/s";
                this.speed = (100 + (4 - secondNum) * 50);
                break;
            case "3":
                difSpeed.data = "速度：" + (+secondNum + 7) + "5 m/s";
                this.speed = (50 + (3 - secondNum) * 30);
                break;
        }
    },
    makeSnakeBody : function() {         //蛇身体各部位图片
        var body = this.snakeBody,
            len = body.length;
        for(var i = 2; i<len-2; i++){
            body[i].style.background = this.snakeUrl + " no-repeat top left 33%";
            body[i].style.backgroundSize = "80px";
        }
        body[0].style.background = this.snakeUrl + " no-repeat top left 99%";
        body[0].style.backgroundSize = "80px";
        body[1].style.background = this.snakeUrl + " no-repeat top left 66%";
        body[1].style.backgroundSize = "80px";
        body[len - 2].style.background = this.snakeUrl + " no-repeat top left";
        body[len - 2].style.backgroundSize = "80px";
        body[len - 1].style.background = "transparent";
    },
    snakeGo : function(dir, preDir){               //蛇的移动
        if (preDir == "right" && dir == "left" || preDir == "left" && dir == "right" 
            || preDir == "up" && dir == "down" || preDir == "down" && dir == "up"){
                dir = preDir;
        }
        switch (dir) {
            case "right":
                this.x += 1;
                this.rotate = 0;
                break;
            case "left":
                this.x -= 1;
                this.rotate = 180;
                break;
            case "up":
                this.y -= 1;
                this.rotate = -90;
                break;
            case "down":
                this.y += 1;
                this.rotate = 90;
                break;
        }if(this.x >= 0 && this.x <= 31 && this.y >= 0 && this.y <= 21){
            this.snakeBody.unshift(cell[this.y][this.x]);
            this.snakeBody.pop();
        }

    },
    snakeRotate: function (num, rotate) {         //蛇图片旋转方向
        var body = this.snakeBody;
        body[num].style.MozTransform = "rotate(" + rotate + "deg)";
        body[num].style.MsTransform = "rotate(" + rotate + "deg)";
        body[num].style.OTransform = "rotate(" + rotate + "deg)";
        body[num].style.WibkitTransform = "rotate(" + rotate + "deg)";
        body[num].style.transform = "rotate(" + rotate + "deg)";
    },
    eatFood : function(){
        if (this.snakeBody[0] == foodPosition) {
            this.snakeBody.push(foodPosition);
            growUp.data = food;
            changePlace(food);
            makeFood();
            if (this.speed > 70){
                this.speed -= 1;
            }
        }
    },
    die : function(){
        var body = this.snakeBody;
        var biteOrHit = function () {
            var maxNum = Math.max(body.length - 2, stopGroup.length);
            for (var i = 0; i < maxNum; i++) {
                if (body[0] == body[i + 1] || body[0] == stopGroup[i]) {
                    return true;
                }
            }
            return false;
        };
        if (this.x < 0 || this.x > 31 || this.y < 0 || this.y > 21 || biteOrHit()) {
            gameOver.style.display = "block";
            reLoadBtn.focus();
            this.go = 1;
        }
    }
};

/************************************新蛇 *************************/
var snake = new Snake();
snake.snakeBody = [cell[0][4], cell[0][3], cell[0][2], cell[0][1], cell[0][0]];
snake.chooseSnake();
snake.makeSnakeBody();

var stopGroup = [], //阻碍蛇前进的树、石头等
    food = 0;
makeFood();

function snakeMove(){  //蛇前进时的各种动作
    snake.snakeGo(direction, preDirection);
    snake.snakeRotate(0, snake.rotate);
    snake.snakeRotate(snake.snakeBody.length - 1, 0);
    snake.makeSnakeBody();
    snake.die();
    snake.eatFood();
    if(snake.go == 0){
        move = setTimeout(snakeMove, snake.speed);
    }else{
        snakeMove = null;
        window.onkeydown = null;
        Snake = null;
    }
    if(snake.snakeBody.length>600){ //蛇身长度超过600结束游戏
        alert("YOU WIN");
        window.onkeydown = null;
    }
}
document.body.onkeypress = function(){ //首次触发蛇的前进（电脑）
    setTimeout(snakeMove, snake.speed);
    document.body.onkeypress = null;
};
gameInterface.ontouchstart = function () {//首次触发蛇的前进（手机）
    setTimeout(snakeMove, snake.speed);
    gameInterface.ontouchstart = null;
};
/**************************场景变化：包括晋级时名字的改变、阻碍物的生成 ********************/
function changePlace(num) {
    var result = num / 6,
        snakeName = ["妖兵一级", "妖兵二级", "妖兵三级", "妖将一级", "妖将二级", "妖将三级", "妖王一级", "妖王二级", "妖王三级", "一方霸主"];
    if(result<10){
        snakeGrade.data = snakeName[Math.floor(result)];    //修改蛇晋级的名字
        if (result % 1 == 0) {
            for (var i = 0; i < Math.random() * 2; i++) {
                showTrees(Math.round(Math.random() * 4 + 1));
            }
        }
        switch (result) {
            case 3:
                tree2.style.display = "block";
                stopGroup.push(cell[12][8]);
                break;
            case 9:
                tree2.style.display = "block";
                stopGroup.push(cell[5][4]);
                break;
            default:
                return;
        }
    }else{
        snakeGrade.data = "一方霸主";
    }
}


/********************随机出现不同阻碍物 ****************/
function plantTrees(position1, position2, position3, position4, arg3, arg4, arg34){
    var num1 = Math.floor(Math.random() * 19 + 1),
        num2 = Math.floor(Math.random() * 29 + 1),
        num3 = num1 - 1,
        num4 = num2 - 1,
        body = snake.snakeBody;
    for(var i=0; i<body.length-1; i++){  //阻碍物不与蛇身重叠
        if(cell[1][2] == body[i] || cell[1][4] == body[i] || cell[3][2] == body[i] || cell[3][4] == body[i]){
            num1 = Math.floor(Math.random() * 19 + 1);
            num2 = Math.floor(Math.random() * 29 + 1);
            num3 = num1 - 1;
            num4 = num2 - 1;
        }
    }

    cell[num1][num2].style.background = "url(img/background-icon.png) " + position1 +" no-repeat";
    cell[num1][num2].style.backgroundSize = "240px";
    stopGroup.push(cell[num1][num2]);

    if(arg3 == 1){
        cell[num3][num2].style.background = "url(img/background-icon.png) " + position3 + " no-repeat";
        cell[num3][num2].style.backgroundSize = "240px";
        stopGroup.push(cell[num3][num2]);
    }
    if(arg4 == 1){
        cell[num1][num4].style.background = "url(img/background-icon.png) " + position2 + " no-repeat";
        cell[num1][num4].style.backgroundSize = "240px";
        stopGroup.push(cell[num1][num4]);
    }
    if(arg34 == 1){
        cell[num3][num4].style.background = "url(img/background-icon.png) " + position4 + " no-repeat";
        cell[num3][num4].style.backgroundSize = "240px";
        stopGroup.push(cell[num3][num4]);
    }
}

function showTrees() {
    switch (arguments[0]) {
        case 1:                                                             //出现小草1
            plantTrees("top left");
            break;
        case 2:                                                             //出现小草2
            plantTrees("top 30% left");
            break;
        case 3:                                                             //出现木桩1
            plantTrees("top 1% left 70%", "top 1% left 60%", "",  "", 0, 1, 0);
            break;
        case 4:                                                               //出现石头1
            plantTrees("top 32% right", "top 32% right 9%", "top 22% right", "top 22% right 9%", 1, 1, 1);
            break;
        case 5:                                                                //出现木桩2
            plantTrees("top 12% right", "top 12% right 9%", "top right", "", 1, 1, 0);
            break;
    }
}

function makeFood() {       //造食物：食物不与蛇身及阻碍物重叠
    foodPosition = cell[Math.floor(Math.random() * 21)][Math.floor(Math.random() * 31)];
    for (var i = 0; i < snake.snakeBody.length; i++) {
        if (foodPosition == snake.snakeBody[i]) {
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
