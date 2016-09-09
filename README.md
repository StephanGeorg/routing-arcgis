# RountingArcGIS

A leightweight promises based node.js wrapper for the [ArcGIS Online Routing Services](https://developers.arcgis.com/features/directions/).


## Installation

Installing using npm:

    npm i routing-arcgis --save


## Usage ##

### Initialization ###
```javascript
var RoutingArcGIS = require('routing-arcgis'),
    routing = new RoutingArcGIS({
      client_id: 'YOUR CLIENT ID',         
      client_secret: 'YOUR CLIENT SECRET' 
    });
```

The constructor function also takes an optional configuration object:

* client_id: id for OAuth 
* client_secret: secret for OAuth 
* endpoint: custom ArcGIS endpoint

### Route ###
```javascript
  routing.route('13.428426,52.504102','13.437481,52.493651'],{})
  .then(function(response){
    console.log(response);
  })
  .catch(function(error){
    console.log(error);
  });
```

Optional parameters:
* you can pass all [request parameters](http://resources.arcgis.com/en/help/arcgis-rest-api/#/Route_service_with_synchronous_execution/02r300000036000000/)



### Response ###

All methods return a promise.

