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
        this.whoResults = [];
        this.setPosition = function (p) {
            _this.position = { lat: p.coords.latitude, lng: p.coords.longitude };
            _this.googleMap.setCenter(_this.position);
            _this.googleMap.setZoom(13);
            var radiusInMeter = 1000;
            _this.searchForPlaceNearby('', radiusInMeter);
        };
        this.refreshGeoposition = function () {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(_this.setPosition);
            }
        };
        this.setGoogleMap = function (m) { return _this.googleMap = m; };
        this.searchForPlaceNearby = function (keyword, radius) {
            infowindow = new google.maps.InfoWindow();
            var placeService = new google.maps.places.PlacesService(_this.googleMap);
            placeService.nearbySearch({
                location: _this.position,
                radius: radius,
                type: ['restaurant'],
                keyword: keyword
            }, _this.placeServiceCallback);
        };
        this.placeServiceCallback = function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                console.log("found total: " + results.length);
                _this.whoResults = results;
                _this.clearMarkers();
                for (var i = 0; i < results.length; i++) {
                    _this.createMarker(results[i], i + 1);
                }
            }
        };
        this.markers = [];
        this.clearMarkers = function () {
            if (_this.markers.length > 0) {
                for (var i = 0; i < _this.markers.length; i++) {
                    _this.markers[i].setMap(null);
                }
            }
        };
        this.createMarker = function (place, number) {
            var placeLoc = place.geometry.location;
            var marker = new google.maps.Marker({
                map: _this.googleMap,
                position: place.geometry.location,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + number + '|FF0000|000000'
            });
            _this.markers.push(marker);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent(place.name);
                infowindow.open(this.map, this);
            });
        };
        this.refreshPosition = function () {
            _this.refreshGeoposition();
        };
        this.initMap = function () {
            _this.googleMap = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 0, lng: 0 },
                zoom: 8,
                streetViewControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: false
            });
        };
        this.setFoodPreference = function (what) {
            var radiusInMeter = 1000;
            _this.searchForPlaceNearby(what, radiusInMeter);
        };
        this.getWhos = function () {
            return _this.whoResults;
        };
        this.refreshGeoposition();
        this.initMap();
    }
    return where2Eat;
})();
var app = new where2Eat();
var hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront = function (elementId) {
    if ($(elementId).css('display') == 'block') {
        $(elementId).css('display', 'none');
        $('#map').css('z-index', '');
        return true;
    }
    $(elementId).css('display', 'block');
    $('#map').css('z-index', -1);
    return false;
};
var showWhat = function () {
    if (hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront('#what')) {
        return;
    }
    hideWho();
};
var hideWhat = function () {
    $('#map').css('z-index', '');
    $('#what').css('display', 'none');
};
var hideWho = function () {
    $('#who').css('display', 'none');
};
var initWhatCallbackHandlers = function () {
    $('#what td').click(function () {
        app.setFoodPreference($(this).context.innerText);
        hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront('#what');
    });
};
var showWhoResults = function () {
    if (hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront('#who')) {
        return;
    }
    hideWhat();
    var results = app.getWhos();
    var resultList = $('#who>table');
    resultList.empty();
    for (var i = 0; i < results.length; i++) {
        var r = "<h3>" + (i + 1) + " " + results[i].name + " </h3>";
        r += "<p>" + results[i].vicinity + "</p>";
        r = '<tr><td>' + r + '</td></tr>';
        $(r).appendTo(resultList);
    }
};
initWhatCallbackHandlers();
//# sourceMappingURL=app.js.map