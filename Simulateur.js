function latitudeToDMS(latitude) {
  var degrees = Math.floor(latitude);
  var minutes = Math.floor((latitude - degrees) * 60);
  var seconds = ((latitude - degrees - minutes / 60) * 3600).toFixed(2);

  var direction = (latitude >= 0) ? 'N' : 'S';

  return degrees + '°' + minutes + '\'' + seconds + '"'+ direction;
}

function longitudeToDMS(longitude) {
  var absolute = Math.abs(longitude);
  var degrees = Math.floor(absolute);
  var minutes = Math.floor((absolute - degrees) * 60);
  var seconds = ((absolute - degrees - minutes / 60) * 3600).toFixed(2);

  var direction = (longitude >= 0) ? 'E' : 'W';

  return degrees + '°' + minutes + '\'' + seconds + '"' + direction;
}

function DMSToDecimal(degrees, minutes, seconds, direction) {
  var sign = (direction === 'S' || direction === 'W') ? -1 : 1;
  var decimal = sign * (parseFloat(degrees) + parseFloat(minutes) / 60 + parseFloat(seconds) / 3600);

  return decimal;
}


function calculateGravityAcceleration(latitude) {
  const g = 9.80665;
  const phi = latitude * Math.PI / 180; // radians
  const sinPhi = Math.sin(phi);
  const gPhi = g * (1 + 0.0053024 * Math.pow(sinPhi, 2) - 0.0000058 * Math.pow(Math.sin(2 * phi), 2));
  return gPhi.toFixed(5); 
}


function entre_coordonnee_DMS() {
  var coordonneInput = document.getElementById('coordinates').value;

  var parts = coordonneInput.match(/[0-9.]+|[NSEW]+/g);

  // Vérifie si les valeurs sont bonnes
  if (parts && parts.length === 8) {
    var latitude = DMSToDecimal(parts[0], parts[1], parts[2], parts[3]);
    var longitude = DMSToDecimal(parts[4], parts[5], parts[6], parts[7]);

    if (isNaN(latitude) || isNaN(longitude)) {
      alert('Veuillez entrer des coordonnées valides.');
      return;
    }
    console.log(latitude, longitude)
    var acceleration = calculateGravityAcceleration(latitude);

    document.getElementById('latitude').textContent = 'coordonnées : ' + coordonneInput;
    document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

    map.setView([latitude, longitude],7);

    updateArrow(acceleration);
  } else {
    alert('Veuillez entrer des coordonnées au format correct (par exemple, 43°43\'17"N 79°28\'25"W).');
  }

  document.getElementById('coordinates').value = "";
  var marker = L.marker([latitude,longitude]).addTo(map);
  marker.bindPopup("<b> latitude : "+ latitude +"</b><br>" + "<b> longitude : " + longitude + "</b>").openPopup();
}


function entre_coordonnee_degree() {
  var coordonneInput = document.getElementById('coordinates_degree').value;
  var coordonneArray = coordonneInput.split(',');
  var latitude = parseFloat(coordonneArray[0].trim());
  var longitude = parseFloat(coordonneArray[1].trim());

  if (isNaN(latitude) || isNaN(longitude)) {
      alert('Veuillez entrer des coordonnées valides.');
      return;
  }

  var acceleration = calculateGravityAcceleration(latitude);

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";
  updateArrow(acceleration);

  document.getElementById('coordinates_degree').value = "";
  map.setView([latitude, longitude], 7);
  var marker = L.marker([latitude,longitude]).addTo(map);
  marker.bindPopup("<b> latitude : "+ latitude +"</b><br>" + "<b> longitude : " + longitude + "</b>").openPopup();
}



var map = L.map('map').setView([51.505, -0.09], 2).setZoom(3);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

map.on('click', function(e) {
  var latitude = latitudeToDMS(e.latlng.lat);
  var longitude = longitudeToDMS(e.latlng.lng);

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitude + "  " + longitude;
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + calculateGravityAcceleration(e.latlng.lat) + "m/s²" ;
  
  var latitude = e.latlng.lat;
  var gravity = calculateGravityAcceleration(latitude);
  updateArrow(gravity);

});



var arrow = document.getElementById('arrow');
var arrow_triangle = document.getElementById("arrow-triangle")
arrow.style.visibility = 'hidden';
arrow_triangle.style.visibility = 'hidden';


function updateArrow(gravity) {
  var arrowHeight;
  if (gravity < 9.81) {

    arrow.style.backgroundColor = 'yellow';
    arrow_triangle.style.color = 'yellow';

    arrowHeight = 100 - (9.81 - gravity) * 10000;
    arrow.style.height = arrowHeight + 'px';
  } else {

    arrow.style.backgroundColor = 'green';
    arrow_triangle.style.color = 'green';
    
    arrowHeight = 100 + (gravity - 9.81) * 10000;
    arrow.style.height = arrowHeight + 'px';
  }

  var triangleTop = arrow.offsetTop + arrowHeight;
  arrow_triangle.style.top = triangleTop + 'px';

  arrow.style.visibility = 'visible';
  arrow_triangle.style.visibility = 'visible';
}



var latlngs = [
  [0, -180],
  [0, 180]
];
var equator = L.polyline(latlngs, {color: 'black'}).addTo(map);



var toronto = L.circle([43.6317, -79.3825], { 
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000,
}).addTo(map);
toronto.bindPopup('<strong>TORONTO</strong>');
function allez_toronto() {
  var latitude = 43.721388888889; 
  var longitude = -79.473611111111; 

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}



var mexico = L.circle([19.3950, -99.0845], { 
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
mexico.bindPopup('<strong>MEXICO</strong>');
function allez_mexico () {
  var latitude = 19.430555555556 ;
  var longitude = -99.145833333333 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var moscow = L.circle([55.7537, 37.5650], { 
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
moscow.bindPopup('<strong>MOSCOW</strong>');
function allez_moscow () {
  var latitude = 55.760277777778 ;
  var longitude = 37.613888888889 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var Claude_b = L.circle([48.8031, 2.3519], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
Claude_b.bindPopup('<strong>CLAUDE BERNARD</strong>');
function allez_claudeb () {
  var latitude = 48.841944444444 ;
  var longitude = 2.2552777777778 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}

var sydney = L.circle([-33.8402, 151.2217], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
sydney.bindPopup("<strong>SYDNEY</strong>");
function allez_sydney () {
  var latitude = -33.900555555556 ;
  var longitude = 151.20472222222 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var Porto_alegre = L.circle([-30.0833, -51.2304], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
Porto_alegre.bindPopup("<strong>PORTO ALEGRE</strong>");
function allez_Portoalegre () {
  var latitude = -30.0425 ;
  var longitude = -51.217777777778 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var Kampala = L.circle([0.2847, 32.5442], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
Kampala.bindPopup("<strong>KAMPALA</strong>");
function allez_kampala () {
  var latitude = 0.31305555555556 ;
  var longitude = 32.578333333333 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var berlin = L.circle([52.5122, 13.3328], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
berlin.bindPopup("<strong>BERLIN</strong>");
function allez_BERLIN () {
  var latitude = 52.522777777778 ;
  var longitude = 13.391111111111 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var Londre = L.circle([51.5012, 0], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
Londre.bindPopup("<strong>LONDRE</strong>");
function allez_londre () {
  var latitude = 51.503333333333 ;
  var longitude = -0.12027777777778 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var Istanbule = L.circle([41.0052, 28.9835], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
Istanbule.bindPopup("<strong>ISTANBUL</strong>");
function allez_istanbul () {
  var latitude = 41.014444444444 ;
  var longitude = 28.976388888889 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}


var Brasilia = L.circle([-15.7815, -47.8333], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
Brasilia.bindPopup("<strong>BRASILIA</strong>");
function allez_brasilia () {
  var latitude = -15.804166666667 ;
  var longitude = -47.8925 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}

var oslo= L.circle([59.906, 10.7612], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
oslo.bindPopup('<strong>OSLO</strong>');
function allez_oslo () {
  var latitude = 59.918333333333 ;
  var longitude = 10.771111111111 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
}

var sainte_anne = L.circle([16.1333, -61.4257], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: 50000
}).addTo(map);
sainte_anne.bindPopup('<strong>Sainte Anne (La Petite Montagne)</strong>');
function allez_sainteanne () {
  var latitude = 16.225833333333 ;
  var longitude = -61.3825 ;

  map.setView([latitude, longitude]); 
  map.setZoom(7); 

  var acceleration = calculateGravityAcceleration(latitude); 

  document.getElementById('latitude').textContent = 'coordonnées : ' + latitudeToDMS(latitude) + '  ' + longitudeToDMS(longitude);
  document.getElementById('acceleration').textContent = 'Acceleration de la gravité: ' + acceleration + " m/s²";

  updateArrow(acceleration); 
} 