var request = require('request'),
    _ = require('lodash'),
    ArcGISAuth = require('./auth');

/**
 * Promises based node.js wrapper for the ESRI ArcGIS geocoder
 *
 * @param options Add client_id, client_secret to get token from ArcGIS auth
 * @return Instance of {@link RoutingArcGIS}
 */
function RoutingArcGIS (options) {

  this.options  = options || {};
  this.endpoint = this.options.endpoint || 'https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World/solve';
  this.cache = {};

  if(!this.options.client_id || !this.options.client_secret) {
    throw new Error('Please specify client_id and client_secret!');
  } else {
    this.arcgisauth = new ArcGISAuth({
      client_id: this.options.client_id,
      client_secret: this.options.client_secret
    });
  }

}

module.exports = RoutingArcGIS;







/**
 *  Geocode a string
 *
 *  @param  data        string to be geocoded
 *  @params {params}    optional parameters
 *  @return Promise
 */
RoutingArcGIS.prototype.route = function (data, params) {
  params = params || {};

  return this._runAuth('route',data,params);


};



/**
 *  Generate the query for specific method
 */
RoutingArcGIS.prototype._getQuery = function (method, data, params) {
  var query = {};

  switch(method) {
    case 'route': query = this._getQueryRoute(data,params); break;

  }

  query.f = params.f || 'json';
  query = _.extend(params, query);

  return query;

};

/**
 *  Prepare the query for route
 */
RoutingArcGIS.prototype._getQueryRoute = function (data, params) {

  return  {
    stops: data.join(';')
  };

};



/**
 *  Call the API w/out authentication
 *
 *  @param  method    service method
 *  @param  data      data
 *  @params params    optional parameters
 *  @return promise
 */
RoutingArcGIS.prototype._run = function (method, data, params) {

  return new Promise(_.bind(function(resolve,reject){
    var query = this._getQuery(method,data,params);
    if(query.error) {
      reject(query.error);
    }

    this._execute(this.endpoint,method,query)
      .then(function(response){
        resolve(response);
      })
      .catch(function(error){
        reject(error);
    });
  },this));
};

/**
 *  Call the API w/ authentication
 *
 *  @param  method    service method
 *  @param  data      data
 *  @params params    optional parameters
 *  @return promise
 */
RoutingArcGIS.prototype._runAuth = function (method, data, params) {

  if(!this.arcgisauth) {
    throw new Error('Please specify client_id and client_secret!');
  }

  return new Promise(_.bind(function(resolve, reject){
    this.arcgisauth.auth()
      .then(_.bind(function(token){

        var query = this._getQuery(method,data,params);
        query.token = token;

        if(query.error) {
          reject(query.error);
        }
        this._execute(this.endpoint,method,query)
          .then(function(response){
            resolve(response);
          })
          .catch(function(error){
            reject(error);
          });

      },this))
      .catch(function(error){
        reject(error);
    });

  },this));
};

/**
 * Sends a given request as a JSON object to the ArcGIS API and returns
 * a promise which if resolved will contain the resulting JSON object.
 *
 * @param  {[type]}   endpoint    ArcGIS API endpoint to call
 * @param  {[type]}   params      Object containg parameters to call the API with
 * @param  {Function} Promise
 */
RoutingArcGIS.prototype._execute = function (endpoint, method, query) {
  return new Promise(_.bind(function (resolve, reject) {

    options = {
      url: endpoint,
      qs: query
    };

    console.log(options);

    request.get(options, function (error, response, body) {
      if(error) {
        reject({code: 404, msg: error});
      } else {
        if(response.statusCode !== 200) {
          reject({code: response.statusCode, msg: 'Unable to connect to the API endpoint ' + options.url});
        } else if (response.body.error) {
          reject(response.body);
        }
        if(body){

          try {
            resolve(JSON.parse(response.body));
          } catch (err) {
            reject({code: 500, msg: err});
          }

        } else {
          reject({code: response.statusCode, msg: 'Empty body'});
        }
      }
    });

  }, this));
};

/**
 *  Validations
 */
RoutingArcGIS.prototype.validateLngLat = function (lnglat) {
  var coordinates = lnglat.split(',');
  if(coordinates.length === 2) {
    var lat = Number(coordinates[1]),
        lng = Number(coordinates[0]);
    if((lng > -180 && lng < 180) && (lat > -90 && lat < 90)) {
      return true;
    }
  }
  return;
};
