saoLei.controller("saoLeiController",['$scope','saoLeiService',function($scope,saoLeiService){
    $scope.saoLeiBox = saoLeiService.createSaoLei();
    $scope.isWin = false;
    $scope.isLost = false;
    //点击翻开spot
    $scope.uncoverSpot = function(spot) {
        if($scope.isWin || $scope.isLost) {
            return;
        }
        spot.isCovered = false;
        saoLeiService.autoOverEmptySpot($scope.saoLeiBox,spot);
        if(spot.content == "mine") {
            $scope.isLost = true;
        }else {
            if(saoLeiService.hasWon($scope.saoLeiBox)) {
                $scope.isWin = true;
            }
        }
    }
    //响应鼠标右击事件,设置旗子跟问号
    $scope.setFlag = function(spot) {
        if(spot.flag == "none") {
            spot.flag = "mine";
        }else if(spot.flag == "mine") {
            spot.flag = "suspect";   //不确定
        }else {
            spot.flag = "none";
        }
    }
    //重新开始
    $scope.restart = function() {
        $scope.saoLeiBox = saoLeiService.createSaoLei();
        $scope.isWin = false;
        $scope.isLost = false;
    }
}]);