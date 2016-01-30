var MapModel = function(center, element) {
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
    map = new google.maps.Map(element, mapOptions);
    var styledMapOptions = {};
    var roadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
    map.mapTypes.set('BreweryLocator', roadMapType);
    map.setMapTypeId('BreweryLocator');
    return map;
};