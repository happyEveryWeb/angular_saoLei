//雷区的布置
saoLei.directive("mineGrid",function(){
    return {
        restrict: "E",
        replace: false,
        templateUrl: 'templates/mineGrid.html'
    }
});
//响应鼠标右击事件，每个格子都响应
saoLei.directive("ngRightClick",function($parse){
    return {
        restrict: "A",
        link: function(scope,elem,attr) {
            var fn = $parse(attr.ngRightClick);
            elem.bind("contextmenu",function(event) {
                scope.$apply(function() {
                    event.preventDefault();
                    fn(scope,{$event:event});
                });
            });
        }
    }
});