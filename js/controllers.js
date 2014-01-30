/* Retrieving data */
function DataCtrl($scope) {
  $scope.data = [
    {
      name: "Glacier #1",
      lat: 37,
      lng: -122,
      rows: [['Mushrooms', 3],['Onions', 1],['Olives', 1],['Zucchini', 1], ['Pepperoni', 2]]
    },
    {
      name: "Glacier #2",
      lat: 38,
      lng: -123,
      rows: [['Mushrooms', 1],['Onions', 7],['Olives', 2],['Zucchini', 3], ['Pepperoni', 5]]
    },
    {
      name: "Glacier #3",
      lat: 39,
      lng: -124,
      rows: [['Mushrooms', 20],['Onions', 40],['Olives', 60],['Zucchini', 10], ['Pepperoni', 8]]
    },
    {
      name: "Glacier #4",
      lat: 40,
      lng: -125,
      rows: [['Mushrooms', 321],['Onions', 217],['Olives', 21],['Zucchini', 311], ['Pepperoni', 200]]
    },    
    {
      name: "Seattle",
      lat: 47.60621,
      lng: -122.332071,
      rows: [['Mushrooms', 19],['Onions', 71],['Olives', 27],['Zucchini', 32], ['Pepperoni', 56]]      
    },
    {
      name: "UW",
      lat: 47.655335,
      lng: -122.303519,
      rows: [['Mushrooms', 100],['Onions', 200],['Olives', 400],['Zucchini', 400], ['Pepperoni', 500]]
    }
  ];


  // EARTH //

  /* Call initalization function when the page is loaded*/
  google.setOnLoadCallback(init);

  var ge;

  /* Initialize Earth */
  function init() {
    google.earth.createInstance('map3d', initCB, failureCB);
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


  // CIRCLE //

  // Set a callback to run when the Google Visualization API is loaded.
  $scope.getCircle = function(lat, lng, rows) {
    // Create the data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Topping');
    data.addColumn('number', 'Slices');
    data.addRows(rows);

    // Set chart options
    var options = {'title':'How Much Pizza I Ate Last Night',
                   'width':400,
                   'height':300};

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

}