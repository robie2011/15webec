/**
 * Map Reference: https://developers.google.com/maps/documentation/javascript/reference?hl=de#release-version
 * Place Tutorial: https://developers.google.com/maps/documentation/javascript/examples/place-search
 * Markers https://developers.google.com/maps/documentation/javascript/examples/marker-remove?hl=de
 */

class where2Eat {
    private position = { lat: 0, lng: 0};
    private googleMap;
    private whoResults: Object[] = [];
    private infowindow = new google.maps.InfoWindow();
    private markerColors = {
        openHourUnknown: '585858|FFFFFF',
        isOpen: '04B431|FFFFFF',
        isClosed: 'FF0000|FFFFFF'
    }


    private setPosition: PositionCallback = p => {
        this.position = { lat: p.coords.latitude, lng: p.coords.longitude };
        this.googleMap.setCenter(this.position);
        this.googleMap.setZoom(13);

        var radiusInMeter = 1000;        
        this.searchForPlaceNearby('', radiusInMeter);
    }

    private refreshGeoposition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.setPosition);
        }
    }

    public setGoogleMap = m => this.googleMap = m;

    public searchForPlaceNearby = (keyword: string, radius: number){        
        var placeService = new google.maps.places.PlacesService(this.googleMap);
        placeService.nearbySearch({
            location: this.position,
            radius: radius,
            type: ['restaurant'],
            keyword: keyword
        }, this.placeServiceCallback);
    }

    private placeServiceCallback = (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {     
            console.log("found total: " + results.length);
            this.whoResults = results;
            this.clearMarkers();
            
            for (var i = 0; i < results.length; i++) {
                this.createMarker(results[i], i+1);
            }
        }
    }

    private markers: Object[] = [];
    private clearMarkers = () => {
        if (this.markers.length > 0) {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
        }
    }
    private createMarker = (place, number) => {
        var placeLoc = place.geometry.location;
        console.log(place);


        var color = this.markerColors.openHourUnknown;
        if (place.opening_hours) {
            color = place.opening_hours.open_now ? this.markerColors.isOpen : this.markerColors.isClosed;
        }


        var marker = new google.maps.Marker({
            map: this.googleMap,
            position: place.geometry.location,
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=' + number + '|' + color
        });

        this.markers.push(marker);

        var vm = this;
        google.maps.event.addListener(marker, 'click', function() {
            vm.infowindow.setContent(place.name);
            vm.infowindow.open(this.map, this);
        });
    }

    public refreshPosition = () => {
        this.refreshGeoposition();
    }


    private initMap = () => {
        this.googleMap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 0, lng: 0 },
        zoom: 8,
        streetViewControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false
        });
    }

    public setFoodPreference = (what: string) => {
        var radiusInMeter = 1000;
        this.searchForPlaceNearby(what, radiusInMeter);
    }

    public getWhos = () => {
        return this.whoResults;
    }

    constructor() {
        this.refreshGeoposition();
        this.initMap();
    }    
}

var app = new where2Eat();

var hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront = (elementId: string) => {
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
}

var showWhat = () => {
    hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront('#what');
};

var initWhatCallbackHandlers = () => {
    $('#what td').click(function () {
        app.setFoodPreference($(this).context.innerText);
        hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront('#what');
    });
}

var showWhoResults = () => {
    if (hideMenuIfActiveAndActivateMapOtherwiseBrigItToTheFront('#who')){
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
}

initWhatCallbackHandlers();