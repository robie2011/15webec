/**
 * Map Reference: https://developers.google.com/maps/documentation/javascript/reference?hl=de#release-version
 * Place Tutorial: https://developers.google.com/maps/documentation/javascript/examples/place-search
 * TODO: Markers removing https://developers.google.com/maps/documentation/javascript/examples/marker-remove?hl=de
 */

    //todo
var infowindow;

class where2Eat {
    private position = { lat: 0, lng: 0};
    private apiKey = "AIzaSyBVJCxnnxByXHof9D-Dw_brILrxQVgF9Ik";
    private googleMap;
    private whoResults: Object[] = [];


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
        infowindow = new google.maps.InfoWindow();
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
        var marker = new google.maps.Marker({
            map: this.googleMap,
            position: place.geometry.location,
            icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+ number + '|FF0000|000000'
        });

        this.markers.push(marker);

        google.maps.event.addListener(marker, 'click', function () {
            infowindow.setContent(place.name);
            infowindow.open(this.map, this);
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

var hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront = (elementId: string) => {
    if ($(elementId).css('display') == 'block') {
        $(elementId).css('display', 'none');
        $('#map').css('z-index', '');
        return true;
    }
    $(elementId).css('display', 'block');
    $('#map').css('z-index', -1);
    return false;
}

var showWhat = () => {
    if (hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront('#what')) {
        return;
    }
    hideWho();
};

var hideWhat = () => {
    $('#map').css('z-index', '');
    $('#what').css('display', 'none');
}

var hideWho = () => {
    $('#who').css('display', 'none');
}

var initWhatCallbackHandlers = () => {
    $('#what td').click(function () {
        app.setFoodPreference($(this).context.innerText);
        hideMenuIfActiveAndActiveMapOtherwiseBrigItToTheFront('#what');
    });
}

var showWhoResults = () => {
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
}


initWhatCallbackHandlers();

