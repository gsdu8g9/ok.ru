// Generated by CoffeeScript 1.3.3
(function() {
  var OkApi, crypto, requestOptions, rest, sys, _;

  sys = require('util');

  rest = require('restler');

  _ = require('underscore');

  crypto = require('crypto');

  requestOptions = {
    applicationSecretKey: null,
    applicationKey: null,
    applicationId: null,
    accessToken: null,
    refreshToken: null,
    defaultVerb: 'post'
  };

  exports.version = '0.0.1';

  OkApi = (function() {
    var makeRequest, okSignature, parametrize;

    OkApi.REST_BASE = 'http://api.odnoklassniki.ru/fb.do';

    OkApi.REFRESH_BASE = 'http://api.odnoklassniki.ru/oauth/token.do';

    function OkApi(method, postData, callback) {
      if (typeof method === 'object') {
        postData = method;
        method = requestOptions['defaultVerb'];
      }
      if (typeof postData === 'function') {
        callback = postData;
      }
      makeRequest(method, postData, callback);
    }

    makeRequest = function(method, postData, callback) {
      var getUrl, requestedData;
      requestedData = {
        access_token: requestOptions['accessToken'],
        application_key: requestOptions['applicationKey'],
        sig: okSignature(postData)
      };
      _.extend(requestedData, postData);
      switch (method.toUpperCase()) {
        case 'POST':
          return rest.post(OkApi.REST_BASE, {
            data: requestedData
          }).on('complete', function(data) {
            return callback(data);
          });
        case 'GET':
          getUrl = ("" + OkApi.REST_BASE + "?") + parametrize(requestedData, '&');
          return rest.get(getUrl).on('complete', function(data) {
            return callback(data);
          });
        default:
          return 'HTTP verb not supported';
      }
    };

    okSignature = function(postData) {
      var hashStr, secret, sortedParams;
      postData['application_key'] = requestOptions['applicationKey'];
      sortedParams = parametrize(postData);
      hashStr = "" + requestOptions['accessToken'] + requestOptions['applicationSecretKey'];
      secret = crypto.createHash('md5').update(hashStr).digest("hex");
      return crypto.createHash('md5').update("" + sortedParams + secret).digest("hex");
    };

    parametrize = function(obj, join) {
      var arrayOfArrays, sortedParams, symbol;
      if (join == null) {
        join = false;
      }
      arrayOfArrays = _.pairs(obj).sort();
      symbol = join ? '&' : '';
      sortedParams = '';
      _.each(arrayOfArrays, function(value) {
        return sortedParams += ("" + (_.first(value)) + "=" + (_.last(value))) + symbol;
      });
      return sortedParams.replace(/\s+/g, '');
    };

    return OkApi;

  })();

  exports.api = OkApi;

  exports.refresh = function(refreshToken, callback) {
    var refresh_params;
    if (refreshToken == null) {
      refreshToken = '';
    }
    if (refreshToken != null) {
      requestOptions['refreshToken'] = refreshToken;
    }
    if (requestOptions['refreshToken'] == null) {
      console.log('RefreshToken not valid for Refresh action');
      return false;
    }
    refresh_params = {
      refresh_token: requestOptions['refreshToken'],
      grant_type: 'refresh_token',
      client_id: requestOptions['applicationId'],
      client_secret: requestOptions['applicationSecretKey']
    };
    return rest.post(OkApi.REFRESH_BASE, {
      data: refresh_params
    }).on('complete', function(data) {
      return callback(data);
    });
  };

  exports.post = function(params, callback) {
    return new OkApi('POST', params, callback);
  };

  exports.get = function(params, callback) {
    return new OkApi('GET', params, callback);
  };

  exports.setAccessToken = function(token) {
    return _.extend(requestOptions, {
      accessToken: token
    });
  };

  exports.getAccessToken = function() {
    return requestOptions['accessToken'];
  };

  exports.setOptions = function(options) {
    if (typeof options === 'object') {
      return _.extend(requestOptions, options);
    }
  };

}).call(this);