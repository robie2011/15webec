/**
 * Map Reference: https://developers.google.com/maps/documentation/javascript/reference?hl=de#release-version
 * Place Tutorial: https://developers.google.com/maps/documentation/javascript/examples/place-search
 * Markers https://developers.google.com/maps/documentation/javascript/examples/marker-remove?hl=de
 */
var where2Eat = (function () {
    function where2Eat() {
        var _this = this;
        this.position = { lat: 0, lng: 0 };
        this.whoResults = [];
        this.infowindow = new google.maps.InfoWindow();
        this.markerColors = {
            openHourUnknown: '585858|FFFFFF',
            isOpen: '04B431|FFFFFF',
            isClosed: 'FF0000|FFFFFF'
        };
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
            console.log(place);
            var color = _this.markerColors.openHourUnknown;
            if (place.opening_hours) {
                color = place.opening_hours.open_now ? _this.markerColors.isOpen : _this.markerColors.isClosed;
            }
            var marker = new google.maps.Marker({
                map: _this.googleMap,
                position: place.geometry.location,
                icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + number + '|' + color
            });
            _this.markers.push(marker);
            var vm = _this;
            google.maps.event.addListener(marker, 'click', function () {
                vm.infowindow.setContent(place.name);
                vm.infowindow.open(this.map, this);
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
var hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront = function (elementId) {
    if ($(elementId).css('display') == 'block') {
        $(elementId).css('display', 'none');
        $('#map').css('z-index', '');
        return true;
    }
    $(elementId).css('display', 'block');
    $('#map').css('z-index', -1);
    var otherElementIdToHide = (elementId == '#who') ? '#what' : '#who';
    $(otherElementIdToHide).css('display', 'none');
    return false;
};
var showWhat = function () {
    hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront('#what');
};
var initWhatCallbackHandlers = function () {
    $('#what td').click(function () {
        app.setFoodPreference($(this).context.innerText);
        hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront('#what');
    });
};
var showWhoResults = function () {
    if (hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront('#who')) {
        return;
    }
    var results = app.getWhos();
    var resultList = $('#who');
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