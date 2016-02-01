/**
 * Google Map data model
 * @param center passed in from the view model
 * @param element passed in from the view model
 * @returns {boolean|*}
 * @constructor
 * http://stackoverflow.com/questions/25147716/how-to-add-a-google-map-marker
 */
var MapModel = function(center, element) {
    /**
     * Parameter to hold map styling options.
     * @type {*[]}
     * http://stackoverflow.com/questions/25147716/how-to-add-a-google-map-marker
     */
    var roadAtlasStyles = [
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                { "saturation": -100 },
                { "lightness": -8 },
                { "gamma": 1.18 }
            ]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                { "saturation": -100 },
                { "gamma": 1 },
                { "lightness": -24 }
            ]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "administrative",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "transit",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "road",
            "stylers": [
                { "color": '#FBB117' },
            ]
        }, {
            "featureType": "administrative",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "landscape",
            "stylers": [
                { "saturation": -100 }
            ]
        }, {
            "featureType": "poi",
            "stylers": [
                { "saturation": -100 }
            ]
        }
    ];

    /**
     * Setting the initial Google map options.
     * @type {{zoom: number, center: *, mapTypeControlOptions: {mapTypeIds: string[]}, mapTypeControl: boolean, panControl: boolean, streetViewControl: boolean, zoomControl: boolean}}
     */
    var mapOptions = {
        zoom: 14,
        center: center,
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'BreweryLocator']
        },
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControl: false
    };

    /**
     * Google map instance.
     * @type {boolean}
     */
    var map = new google.maps.Map(element, mapOptions);

    /**
     * Parameter to hold the customize of the Google base map
     * @type {google.maps.StyledMapType}
     * https://developers.google.com/maps/documentation/javascript/styling?hl=en
     */
    var roadMapType = new google.maps.StyledMapType(roadAtlasStyles, {});

    /**
     * MapType object to hold information about the map
     * https://developers.google.com/maps/documentation/javascript/maptypes?hl=en
     */
    map.mapTypes.set('BreweryLocator', roadMapType);

    /**
     *Changes the kind of map to display
     */
    map.setMapTypeId('BreweryLocator');

    /**
     * Returns the configure Google Map instance.
     */
    return map;
};