
var should          = require('should'),
    RoutingArcGIS  = require('../lib/routing-arcgis'),
    CLIENT_ID       = process.env.CLIENT_ID || null,
    CLIENT_SECRET   = process.env.CLIENT_SECRET || null,
    TIMEOUT         = process.env.TEST_TIMEOUT || 10000;


describe('RoutingArcGIS API Wrapper', function(){
  var geocoder;

  describe('Initializating', function() {

    it('with additional arguments', function() {
      routing = new RoutingArcGIS({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });
    });

  });

  describe('API responses with OAuth (cached)', function() {

    before(function(done){
      routing = new RoutingArcGIS({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      });
      done();
    });


    it('should be able to get route with OAuth', function(done) {
      this.timeout(TIMEOUT);
      routing.route(['13.428426,52.504102','13.437481,52.493651'],{
        returnDirections: false,
        returnStops: false
      }).then(function(res) {
        res.should.be.json;
        done();
      });
    });



  });


  describe('Validations',function(){



  });

});
