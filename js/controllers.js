/* Retrieving data */
function DataCtrl($scope, $http, $q, $filter) {
 $scope.$watchCollection('filtered', function(fmData) {
    $scope.statesCount = {};
    var filtered = $filter('myFilter')(fmData);
    for (var i = 0; i < filtered.length; i++) {
        if ($scope.statesCount[filtered[i].State]) {
         $scope.statesCount[filtered[i].State]++;    
        } else {
         $scope.statesCount[filtered[i].State] = 1;
        }
    }
    $scope.initialize(fmData);
  });
 
  $scope.$on('LOAD', function() {
      $scope.loading = true;
  });
  $scope.$on('DONE', function() {
      $scope.loading = false;
  });
  $scope.$emit('LOAD');
  $scope.orderByField = 'MarketName';
  $scope.reverseSort = false;
  $scope.details = undefined;
  $scope.state = undefined;
  $scope.map = undefined;
  $scope.mapOptions = undefined;
  $scope.lat = 41.5672;
  $scope.lng = -122.1269;
  $scope.zoom = 5;

  $scope.onSelect = function(state) {
    $scope.state = state;
    for (var i = 0; i < $scope.states.length; i++) {
      if ($scope.states[i].state == $scope.state) {
        $scope.lat = $scope.states[i].latitude;
        $scope.lng = $scope.states[i].longtitude;
        var myLatlng = new google.maps.LatLng($scope.lat, $scope.lng);
        $scope.zoom = 6;
        $scope.map.setZoom($scope.zoom);
        $scope.map.setCenter(myLatlng);
      }
    }        
  }

  $scope.setSelected = function() {
     if ($scope.lastSelected) {
       $scope.lastSelected.selected = '';
     }
     this.selected = 'active';
     $scope.lastSelected = this;
  }

  var deferred = $q.defer();
  $http.get('json/farmers.json').success(function(data) {
    $scope.fmData = [];
    $scope.states = [
      {"state":"Washington", "latitude":47.3917, "longtitude":-121.5708}, 
      {"state":"California", "latitude":36.1700, "longtitude":-119.7462},
      {"state":"Oregon", "latitude":44.5672, "longtitude":-122.1269}      
    ];
    for (var i = 0; i < data.length; i++){
      if (data[i].State == 'Washington' || data[i].State == 'California' || data[i].State == 'Oregon') {
        // if($scope.states.indexOf(data[i].State) == -1 && data[i].State != null){      
        //   $scope.states.push(data[i].State);
        // }
        $scope.fmData.push(data[i]);
      }
    }
    deferred.resolve(); 
  });

  deferred.promise.then(function() {
    $scope.$emit('DONE');
    google.maps.event.addDomListener(window, 'load', $scope.initialize());
  });

  $scope.getDetails = function (farmer) {
    $scope.lat = farmer.x;
    $scope.lng = farmer.y;
    $scope.details = farmer;    
    var myLatlng = new google.maps.LatLng($scope.lat,$scope.lng);
    $scope.zoom = 12;
    $scope.map.setZoom($scope.zoom);
    $scope.map.setCenter(myLatlng);
  };

  $scope.initialize = function(fmData) {
    // Create an array of styles.
    // var styles = [

    // {
    //   "featureType": "water",
    //   "stylers": [
    //     { "color": "#4155c5" }
    //   ]
    // },{
    //   "featureType": "landscape",
    //   "stylers": [
    //     { "color": "#7c9b24" }
    //   ]
    // },{
    //   "featureType": "road",
    //   "stylers": [
    //     { "color": "#ebbf42" }
    //   ]
    // },

    // {
    //   "featureType": "administrative.neighborhood",
    //   "stylers": [
    //     { "visibility": "off" }
    //   ]
    // },{
    //   "featureType": "administrative.locality",
    //   "stylers": [
    //     { "visibility": "off" }
    //   ]
    // },{
    //   "featureType": "poi",
    //   "stylers": [
    //     { "visibility": "off" }
    //   ]
    // },{
    //   "featureType": "transit.line",
    //   "stylers": [
    //     { "visibility": "off" }
    //   ]
    // },{
    //   "featureType": "road",
    //   "stylers": [
    //     { "visibility": "simplified" }
    //   ]
    // },{
    //   "elementType": "labels",
    //   "stylers": [
    //     { "visibility": "simplified" }
    //   ]
    // }];

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  // var styledMap = new google.maps.StyledMapType(styles,
  //   {name: "Farmers Markets"});

    $scope.mapOptions = {
      zoom: $scope.zoom,
      center: new google.maps.LatLng($scope.lat, $scope.lng)
      // ,mapTypeControlOptions: {
      //   mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      // }        
      // center: new google.maps.LatLng(37.09024, -95.712891)
    }
    if (fmData) {
    var image = new google.maps.MarkerImage(
      'img/marker.png',
      null, /* size is determined at runtime */
      null, /* origin is 0,0 */
      null, /* anchor is bottom center of the scaled image */
      new google.maps.Size(7, 7)
    );  
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), $scope.mapOptions);

      //Associate the styled map with the MapTypeId and set it to display.
      // $scope.map.mapTypes.set('map_style', styledMap);
      // $scope.map.setMapTypeId('map_style');

      $scope.drawChart($scope.statesCount['Washington'], $scope.statesCount['Oregon'], $scope.statesCount['California']);
      for (var i = 0; i < fmData.length; i++){
          var myLatlng = new google.maps.LatLng(fmData[i].x,fmData[i].y);
            var marker = new google.maps.Marker({
              position: myLatlng,
              map: $scope.map,
              title: fmData[i].MarketName,
              icon: image
              // ,icon: $scope.getCircle()
          });
          $scope.setMarker($scope.map, marker, fmData[i]);
      }    
      google.maps.event.addListener($scope.map, 'center_changed', function() {
        $scope.lat = $scope.map.getCenter().lat();
        $scope.lng = $scope.map.getCenter().lng();
      });
      google.maps.event.addListener($scope.map, 'zoom_changed', function() {
        $scope.zoom = $scope.map.getZoom();
      });
    }
  }
  $scope.setMarker = function (map, marker, farmer) {
    var infowindow = new google.maps.InfoWindow({
      content:  
                '<h3>' + farmer.MarketName + '</h3>' + 
                '<br>' + 
                '<b>Address:</b> ' + farmer.street + ' ' +farmer.city + ', ' + farmer.State + ' ' + farmer.zip +
                '<br>' +
                '<b>Website:</b> ' + '<a href=' + '"'+ farmer.Website + '"' + ' target="_blank">' + farmer.Website + '</a>'

    });
   google.maps.event.addListener(marker, 'click', function() {
      $scope.zoom = 12;
      map.setZoom($scope.zoom);
      map.setCenter(marker.getPosition());
      infowindow.open(marker.get('map'), marker);
     $scope.$apply(function() {
         $scope.details = farmer;
     });

    });
  }
  $scope.getCircle = function() {
    var circle = {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: '#c10d18',
      fillOpacity: .5,
      scale: 6,
      strokeColor: '#ffffff',
      strokeWeight: .5
    };
    return circle;
  }
  $scope.drawChart = function(washington, oregon, california) {
      if (washington == undefined) {
        washington = 0
      }
      if (oregon == undefined) {
        oregon = 0
      }
      if (california == undefined) {
        california = 0
      }
      var data = google.visualization.arrayToDataTable([
        ["Element", "Farmers Markets", { role: "style" } ],
        ["Washington", washington, "#418bca"],
        ["Oregon", oregon, "#014a01"],
        ["California", california, "#fed700"]
      ]);

      var view = new google.visualization.DataView(data);
      view.setColumns([0, 1,
         { calc: "stringify",
           sourceColumn: 1,
           type: "string",
           role: "annotation" },
       2]);

      var options = {
        title: "Farmers Markets by State",
        width: 600,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
      };
    var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
    chart.draw(view, options);
  }

}