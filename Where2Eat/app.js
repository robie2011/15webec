/**
 * Map Reference: https://developers.google.com/maps/documentation/javascript/reference?hl=de#release-version
 * Place Tutorial: https://developers.google.com/maps/documentation/javascript/examples/place-search
 * TODO: Markers removing https://developers.google.com/maps/documentation/javascript/examples/marker-remove?hl=de
 */
//todo
var infowindow;
var where2Eat = (function () {
    function where2Eat() {
        var _this = this;
        this.position = { lat: 0, lng: 0 };
        this.apiKey = "AIzaSyBVJCxnnxByXHof9D-Dw_brILrxQVgF9Ik";
        this.googleMap = null;
        this.setPosition = function (p) {
            _this.position = { lat: p.coords.latitude, lng: p.coords.longitude };
            console.log("Position set: lat/long");
            console.log(_this.position);
            _this.googleMap.setCenter(_this.position);
            _this.googleMap.setZoom(13);
        };
        this.refreshGeoposition = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_this.setPosition);
            }
        };
        this.setGoogleMap = function (m) { return _this.googleMap = m; };
        this.searchForPlaceNearby = function (places, radius) {
            infowindow = new google.maps.InfoWindow();
            var placeService = new google.maps.places.PlacesService(_this.googleMap);
            placeService.nearbySearch({
                location: _this.position,
                radius: radius,
                type: places
            }, _this.placeServiceCallback);
        };
        this.placeServiceCallback = function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log("found total: " + results.length);
                console.log(results);
                for (var i = 0; i < results.length; i++) {
                    _this.createMarker(results[i]);
                }
            }
        };
        this.createMarker = function (place) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: map,
                position: place.geometry.location
            });
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(map, this);
            });
        };
        this.refreshGeoposition();
    }
    return where2Eat;
})();
var app = new where2Eat();
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 8
    });
    app.setGoogleMap(map);
}
initMap();
//# sourceMappingURL=app.js.map 
//# sourceMappingURL=app.js.map