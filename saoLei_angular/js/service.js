saoLei.service("saoLeiService",function(){
    this.createSaoLei = function() {
        var saoLei = {};
        saoLei.rows = [];
        for(var i=0;i<9;i++) {  //i行
            var row = {};
            row.spots = [];
            for(var j=0;j<9;j++) {  //j列
                var spot = {};
                spot.isCovered = true;      //是否翻开
                spot.content = "empty";     //格子里面的内容 empty 1~8 mine
                spot.flag = "none";     //鼠标右击时格子上的状态
                spot.x = i;
                spot.y = j;
                row.spots.push(spot);
            }
            saoLei.rows.push(row);
        }
        this.placeManyRandomSpots(saoLei);  //当前有10个雷，并且随机产生
        this.calculateAllNumbers(saoLei);   //是数字的应该显示相应的数字
        return saoLei;
    };

    //获取某一个点
    this.getSpot = function(saoLei,row,column) {
        return saoLei.rows[row].spots[column];
    };
    //随机点为地雷
    this.placeRandomMine = function(saoLei) {
        var row = Math.round(Math.random() * 8);
        var column = Math.round(Math.random() * 8);
        var spot = this.getSpot(saoLei,row,column);
        spot.content = "mine";
        return spot;
    };
    //当前有10个雷
    this.placeManyRandomSpots = function(saoLei) {
        var arr = [];
        for(var i = 0; i < 100; i++) {
            var row = Math.round(Math.random() * 8);
            var column = Math.round(Math.random() * 8);
            var obj = {};
            obj[row] = column;
            if(arr.length == 0) {
                arr.push(obj);
            }else {
                var flag = true;
                for(var j = 0;j < arr.length; j++) {
                    for(var k in arr[j]) {
                        if(k == row) {
                            if(arr[j][k] == column) {
                                flag = false;
                            }
                        }
                    }
                    if(!flag) {
                        break;
                    }
                }
                if(flag) {
                    arr.push(obj);
                }
            }
            if(arr.length >= 10) {
                for(var p = 0; p < arr.length; p++) {
                    for(var q in arr[p]) {
                        var spot = this.getSpot(saoLei,q,arr[p][q]);
                        spot.content = "mine";
                    }
                }
                break;
            }
        }
    };

    //生成方格中的数字
    //1.计算每个方格中的数字
    this.calculateNumber = function(saoLei,row,column) {
        var thisSpot = this.getSpot(saoLei,row,column);
        //如果方格中为地雷，则忽略
        if(thisSpot.content == "mine") {
            return;
        }
        //方格中应该显示的数字
        var mineCount = 0;
            //如果不是第一行   则有上边
        if(row > 0) {
            if(column > 0) {
                var spot_leftTop = this.getSpot(saoLei,row-1,column-1);
                if(spot_leftTop.content == "mine") {
                    mineCount++;
                }
            }
            var spot_top = this.getSpot(saoLei,row-1,column);
            if(spot_top.content == "mine") {
                mineCount++;
            }
            if(column < 8) {
                var spot_rightTop = this.getSpot(saoLei,row-1,column+1);
                if(spot_rightTop.content == "mine") {
                    mineCount++;
                }
            }
        }
            //左边
        if(column > 0) {
            var spot_left = this.getSpot(saoLei,row,column-1);
            if(spot_left.content == "mine") {
                mineCount++;
            }
        }
            //右边
        if(column < 8) {
            var spot_right = this.getSpot(saoLei,row,column+1);
            if(spot_right.content == "mine") {
                mineCount++;
            }
        }
            //如果不是最后一行，有下边
        if(row < 8) {
            if(column > 0) {
                var spot_leftBottom = this.getSpot(saoLei,row+1,column-1);
                if(spot_leftBottom.content == "mine") {
                    mineCount++;
                }
            }
            var spot_bottom = this.getSpot(saoLei,row+1,column);
            if(spot_bottom.content == "mine") {
                mineCount++;
            }
            if(column < 8) {
                var spot_rightBottom = this.getSpot(saoLei,row+1,column+1);
                if(spot_rightBottom.content == "mine") {
                    mineCount++;
                }
            }
        }
        if(mineCount > 0) {
            thisSpot.content = mineCount;
        }
    };
    //2.计算所有单元格中应该显示的数字
    this.calculateAllNumbers = function(saoLei) {
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                this.calculateNumber(saoLei,i,j);
            }
        }
    };
    //游戏胜利检测
    this.hasWon = function(saoLei) {
        for(var i = 0; i < 9; i++) {
            for(var j = 0; j < 9; j++) {
                var spot = this.getSpot(saoLei,i,j);
                if(spot.isCovered && spot.content != "mine") {
                    return false;
                }
            }
        }
        return true;
    };
    //自动翻开相邻方格
    this.autoOverEmptySpot = function(saoLei,spot) {
        var x = spot.x; //行
        var y = spot.y; //列
        spot.isCovered = false;
        if(spot.content == "empty") {
            if(x > 0) {
                var topSpot = this.getSpot(saoLei,x-1,y);
                if(topSpot.isCovered == true) {
                    this.autoOverEmptySpot(saoLei,topSpot);
                }
            }
            if(y > 0) {
                var leftSpot = this.getSpot(saoLei,x,y-1);
                if(leftSpot.isCovered == true) {
                    this.autoOverEmptySpot(saoLei,leftSpot);
                }
            }
            if(x < 8) {
                var bottomSpot = this.getSpot(saoLei,x+1,y);
                if(bottomSpot.isCovered == true) {
                    this.autoOverEmptySpot(saoLei,bottomSpot);
                }
            }
            if(y < 8) {
                var rightSpot = this.getSpot(saoLei,x,y+1);
                if(rightSpot.isCovered == true) {
                    this.autoOverEmptySpot(saoLei,rightSpot);
                }
            }
        }
    }
});