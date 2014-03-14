var app = angular.module('HCDE411', ['ui.bootstrap']);

/* In case if there are any cross-origin browser issues */
app.config(['$httpProvider', function($httpProvider) {  
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);

  app.directive('documentSwitchOff', [
    '$parse',
    '$timeout',
    function ($parse,$timeout) {
        return function (scope, element, attrs) {
            var getter = $parse(attrs.documentSwitchOff);
            var setter = getter.assign;
            var clickInsideElement = false;
            function elementClickHandler(){
                clickInsideElement = true;
            }
            function documentClickHandler(){
                if(!clickInsideElement){
                    scope.$apply(function(){
                        setter(scope,false);
                    });
                }
                clickInsideElement = false;
            }
            var bound = false;
            scope.$watch(attrs.documentSwitchOff,function(newVal){
                if(angular.isDefined(newVal)){
                    if(newVal){
                        $timeout(function(){
                            bound = true;
                            element.bind("click",elementClickHandler);
                            var doc = angular.element(document)
                                doc.bind('click',documentClickHandler);
                        },0);
                    }
                    else{
                        if(bound){
                            element.unbind("click",elementClickHandler);
                            angular.element(document).unbind('click',documentClickHandler);
                            bound = false;
                        }

                    }
                }
            });

            scope.$on("$destroy",function(){
                if(bound){
                    element.unbind("click",elementClickHandler);
                    angular.element(document).unbind('click',documentClickHandler);
                    bound = false;
                }
            });
        }
    }
]);

app.filter('myFilter', function() {
     return function(markets, range) {
      var out = [];
      // console.log(range)
      
      angular.forEach(markets, function(Mitem, Mindex){
        var flag = true;
        angular.forEach(range, function(Ritem, Rindex){
          if(!Ritem) return;
          MitemBoolVal = (Mitem[Rindex] == "Y");
          flag = ((MitemBoolVal == Ritem && flag)); 
        });
        
        if(flag){
          out.push(Mitem);
        }
      });
      
      // console.log(out);
      return out;
    }
  });