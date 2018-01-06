function initialized () {
  var bounds = window.PINS.reduce(function (bounds, pin) {
    bounds.extend(pin.position)
    return bounds
  }, new google.maps.LatLngBounds())

  // 取得所有點的中心位置
  var center = bounds.getCenter();

  // 取得放大比率
  var zoom = getBoundsZoomLevel(bounds);

  createMap(center, zoom);
}

// https://stackoverflow.com/questions/6048975/google-maps-v3-how-to-calculate-the-zoom-level-for-a-given-bounds
function getBoundsZoomLevel (bounds) {
  var WORLD_DIM = { height: 256, width: 256 };
  var ZOOM_MAX = 21;

  function latRad (lat) {
      var sin = Math.sin(lat * Math.PI / 180);
      var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
      return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
  }

  function zoom (mapPx, worldPx, fraction) {
      return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
  }

  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();

  var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

  var lngDiff = ne.lng() - sw.lng();
  var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

  var latZoom = zoom(window.innerHeight, WORLD_DIM.height, latFraction);
  var lngZoom = zoom(window.innerWidth, WORLD_DIM.width, lngFraction);

  return Math.min(latZoom, lngZoom, ZOOM_MAX);
}

function createMap (center, zoom) {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: center,
    zoom: zoom
  });

  var infoWindow = new google.maps.InfoWindow();
  var $infoRoot = document.createElement('div');
  $infoRoot.className = 'info-content'
  infoWindow.setContent($infoRoot);

  var $name = document.createElement('h6');
  $name.className = 'info-name';
  $infoRoot.appendChild($name);

  var $otherInfo = document.createElement('ul');
  $otherInfo.className = 'info-list';
  $infoRoot.appendChild($otherInfo);

  var $job = document.createElement('li');
  $job.className = 'info-item job';
  $otherInfo.appendChild($job);

  var $phone = document.createElement('li');
  $phone.className = 'info-item phone';
  $otherInfo.appendChild($phone);

  var $address = document.createElement('li');
  $address.className = 'info-item address';
  $otherInfo.appendChild($address);

  window.PINS.forEach(function (pin) {
    var marker = new google.maps.Marker({
      map: map,
      label: pin.name,
      position: pin.position
    })

    marker.addListener('click', function (e) {
      $name.textContent = pin.name;
      insertInfo($job, [pin.companyName, pin.jobTitle])
      insertInfo($phone, pin.phoneNumbers.join('，'))
      insertInfo($address, pin.postalAddress)

      infoWindow.open(map, marker);
    });
  })

  return map
}

function insertInfo ($node, value, seperator) {
  seperator = seperator || ''
  if (Array.isArray(value)) {
    value = value.join(seperator)
  }

  if (value) {
    $node.textContent = value;
    $node.style.display = 'inherit';
  } else {
    $node.textContent = '';
    $node.style.display = 'none';
  }
}