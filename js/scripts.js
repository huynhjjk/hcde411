/* Load Earth */
var ge;
google.load("earth", "1", {"other_params":"sensor=true_or_false"});

/* Initialize Earth */
function init() {
  google.earth.createInstance('map3d', initCB, failureCB);
  createPlacemark();
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

  // create the placemark
  createPlacemark(37, -122);

  // look at the placemark we created
  var la = ge.createLookAt('');
  la.set(37, -122,
    0, // altitude
    ge.ALTITUDE_RELATIVE_TO_GROUND,
    0, // heading
    0, // straight-down tilt
    5000 // range (inverse of zoom)
    );
  ge.getView().setAbstractView(la);

  document.getElementById('installed-plugin-version').innerHTML =
    ge.getPluginVersion().toString();

}

/* Failure callback */
function failureCB(errorCode) {
}

/* Call initalization function when the page is loaded*/
google.setOnLoadCallback(init);


function createPlacemark(lat, lng) { 
  // Create point
  var la = ge.getView().copyAsLookAt(ge.ALTITUDE_RELATIVE_TO_GROUND);
  var point = ge.createPoint('');
  point.setLatitude(lat);
  point.setLongitude(lng);

  var placemark = ge.createPlacemark('');
  placemark.setName("Glacier #1");
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
