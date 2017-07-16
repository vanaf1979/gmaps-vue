
export default {
  name: 'GMap',
  data () {
    return {
      apiKey: '',
      mapOptions: {
        center: null,
        zoom: 17,
        mapTypeId: null,
        zoomControl: true,
        scaleControl: true,
        scrollwheel: false,
        disableDoubleClickZoom: false
      },
      markers: [
        {
          title: 'the White House',
          lat: '38.8976763',
          long: '-77.0365298',
          icon: null,
          bubble: '<h3>the White House</h3>'
        },
        {
          title: 'Washington Monument',
          lat: '38.8894838',
          long: '-77.0352791',
          icon: null,
          bubble: '<h3>Washington Monument</h3>'
        },
        {
          title: 'National Museum of American History',
          lat: '38.8913131',
          long: '-77.0299992',
          icon: null,
          bubble: '<h3>National Museum of American History</h3>'
        }
      ],
    }
  },
  methods: {
    renderMap: function ()
    {
      // Init
      var mapEllement = this.$el;
      var markerBounds = new google.maps.LatLngBounds();
      this.mapOptions.center = new google.maps.LatLng( this.markers[0].lat , this.markers[0].long );
      this.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
      var gmap = new google.maps.Map( mapEllement , this.mapOptions );

      // Loop through the market list.
      for ( var i = 0 ; i < this.markers.length ; i++ )
      {
        // Create a new marker.
        var markerPoint = new google.maps.LatLng( this.markers[i].lat , this.markers[i].long );
        markerBounds.extend( markerPoint );
        var setMarker = new google.maps.Marker({
          position: markerPoint,
          map: gmap,
          title: this.markers[i].title,
          icon: this.markers[i].icon || 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });

        // Create the infowindow
        var infoWindow = new google.maps.InfoWindow({
          content: '<div class="gmap-infowindow">' + this.markers[i].bubble + '</div>'
        });

        // Listen for clicks to open the infowindow
        (function ( map, marker, infoWindow ) {
          google.maps.event.addListener(marker, "click", function (e) {
            infoWindow.open( map , marker );
          });
        })( gmap , setMarker , infoWindow );
      }

      // Center the map around all markers.
      gmap.fitBounds( markerBounds );

    }
  },
  created: function ( )
  {
    // If the google maps api is already loaded.
    if( typeof google === 'object' && typeof google.maps === 'object' )
    {
      this.renderMap();
    }
    else
    {
      // Load the google maps api.
      // Note: Adding it as a script cuz i cant find a good node package.
      var url = 'http://maps.googleapis.com/maps/api/js?key='+this.apiKey+'';
      var script = document.createElement( 'script' );
      script.async = true;
      script.onload = () =>
      {
        script.onload = null;
        this.renderMap();
      }
      script.src = url;
      ( document.getElementsByTagName( "head" )[ 0 ] ).appendChild( script );
    }
  }
}
