/* Retrieving data */
function DataCtrl($scope) {
  $scope.data = [
    {
      name: "Glacier #1",
      lat: 37,
      lng: -122
    },
    {
      name: "Glacier #2",
      lat: 38,
      lng: -123
    },
    {
      name: "Glacier #3",
      lat: 39,
      lng: -124
    },
    {
      name: "Glacier #4",
      lat: 40,
      lng: -125
    },    
    {
      name: "Seattle",
      lat: 47.60621,
      lng: -122.332071
    },
    {
      name: "UW",
      lat: 47.655335,
      lng: -122.303519
    }
  ];


  $scope.$on('LOAD', function() {
      $scope.loading = true;
  });
  $scope.$on('DONE', function() {
      $scope.loading = false;
  });

  /* Call initalization function when the page is loaded*/
  google.setOnLoadCallback(init);

  var ge;

  /* Initialize Earth */
  function init() {
    $scope.$emit('LOAD');
    google.earth.createInstance('map3d', initCB, failureCB);
    $scope.$emit('DONE');
  }

  /* Success callback */
  function initCB(instance) {
    ge = instance;
    ge.getWindow().setVisibility(true);

    // add a navigation control
    ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);

    // add some layers
    // ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS, true);
    // ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS, true);

    for (var i = 0; i < $scope.data.length; i++){
      createPlacemark($scope.data[i].name, $scope.data[i].lat, $scope.data[i].lng);
    }

    document.getElementById('installed-plugin-version').innerHTML = ge.getPluginVersion().toString();
  }

  /* Failure callback */
  function failureCB(errorCode) {
  }

  function createPlacemark(name, lat, lng) { 
    // Create point
    var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
    var point = ge.createPoint('');
    point.setLatitude(lat);
    point.setLongitude(lng);

    var placemark = ge.createPlacemark('');
    placemark.setName(name);
    placemark.setDescription('<a href="https://catalyst.uw.edu/workspace/omni/42527/302765"></a>' + '<br>' + 'The latitude is: ' + lat + '<br>' + 'The longtitude is: ' + lng);
    ge.getFeatures().appendChild(placemark);

    // Create style map for placemark
    var icon = ge.createIcon('');
    icon.setHref('http://maps.google.com/mapfiles/kml/paddle/red-circle.png');
    var style = ge.createStyle('');
    style.getIconStyle().setIcon(icon);
    style.getIconStyle().setScale(5.0);  
    placemark.setStyleSelector(style);

    placemark.setGeometry(point);
  }

  $scope.getView = function(lat, lng) { 
    // look at the placemark we created
    var la = ge.createLookAt('');
    la.set(lat, lng,
      0, // altitude
      ge.ALTITUDE_RELATIVE_TO_GROUND,
      0, // heading
      0, // straight-down tilt
      50000 // range (inverse of zoom)
      );
    ge.getView().setAbstractView(la);    
  }
}