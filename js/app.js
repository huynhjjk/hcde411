var app = angular.module('Glaciers', []);

/* In case if there are any cross-origin browser issues */
app.config(['$httpProvider', function($httpProvider) {  
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
}]);