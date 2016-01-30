var BreweryModel = function(brewery, map){
    var self = this;
    self.latitude = brewery.latitude;
    self.longitude = brewery.longitude;
    self.name = brewery.brewery.name;
    self.icon = _.pick(brewery.brewery.images, 'icon');
    self.description = brewery.brewery.description || '';
    self.website = brewery.brewery.website || '';
    self.streetAddress =  brewery.streetAddress || '';
    self.city = brewery.locality || '';
    self.state = brewery.region || '';
    self.postalCode = brewery.postalCode || '';

    self.breweries = ko.observableArray([]);

    self.breweryLocation = ko.computed(function(){
        return new google.maps.LatLng(self.latitude, self.longitude);
    });

    self.mapMarker = (function(beer){
        return new google.maps.Marker({
            position:beer.breweryLocation(),
            map:map
        });
    })(self);

    self.displayBrewery = function() {
        var displayBreweryInfo = '<div class="info-window-content">' +
            '<span class="info-window-header">'+ '<img src="'+ self.icon.icon + '" > ' + self.name + '</span>' +
            '<div><br></div>' +
            '<p>'+ self.streetAddress +'</p>' +
            '<p>'+ self.city + ' ' + self.state+ ' ' + self.postalCode + '</p>' +
            '<p><a href=' + self.website +' target=_blank> ' + self.website + '</a></p>' +
            '<p>' + self.description + '</p>' +
            '</div>';
        return displayBreweryInfo;
    };
};