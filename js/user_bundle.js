(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Topbar = function() {
  var elem = $('#topbar');
  return {
    show_message: function(msg) {
      elem.text(msg);
      elem.removeClass('hide');
      elem.removeClass('error');
    },

    show_error: function(msg) {
      elem.text(msg);
      elem.removeClass('hide');
      elem.addClass('error');
    },

    hide_message: function() {
      elem.text('');
      elem.addClass('hide');
    }
  };
};


module.exports = Topbar;

},{}],2:[function(require,module,exports){
'use strict'

var UserController = require('./usercontroller');
var Topbar = require('./topbar');

var ucApp = angular.module('uc', []);

ucApp.controller('UserController', UserController);
ucApp.factory('topbar', Topbar);
ucApp.config(function($httpProvider) {
  $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
});

},{"./topbar":1,"./usercontroller":3}],3:[function(require,module,exports){
'use strict'


var UserController = function($scope, $http, $window, topbar) {
  this.scope = $scope;
  this.http = $http;
  this.window = $window;
  this.topbar = topbar;

  this.name = null;
  this.avatar = null;
  this.maps = [];

  this.http.post('/_/get_user/').
    success(angular.bind(this, function(data) {
      if (data.result == 'ok') {
        this.name = data.name;
        this.avatar = data.avatar;
      }
    })).
    error(angular.bind(this, function() {
    }));

  this.http.post('/_/get_maps/').
    success(angular.bind(this, function(data) {
      if (data.result == 'ok') {
        this.maps = data.maps;
      }
    })).
    error(angular.bind(this, function() {
    }));
};

UserController.prototype.saveUser = function() {
  this.topbar.show_message('saving...');
  var params = $.param({'name': this.name, avatar: this.avatar});
  this.http.post('/_/set_user/', params).
    success(angular.bind(this, function(data) {
      this.topbar.hide_message();
    })).
    error(angular.bind(this, function() {
      this.topbar.show_error("Saving failed...");
    }));
};

UserController.prototype.changeMapName = function(key) {
  var name = this.window.prompt('New name');
  this.topbar.show_message('saving...');
  var params = $.param({'key': key, 'name': name});
  this.http.post('/_/set_map_name/', params).
    success(angular.bind(this, function(data) {
      this.topbar.hide_message();
      for (var i = 0; i < this.maps.length; i++) {
        if (this.maps[i].key == key) {
          this.maps[i].name = name;
        }
      }
    })).
    error(angular.bind(this, function() {
      this.topbar.show_error("Saving failed...");
    }));
};

UserController.prototype.createMap = function() {
  var name = this.window.prompt('New name');
  this.topbar.show_message('creating...');
  var params = $.param({'name': name});
  this.http.post('/_/create_map/', params).
    success(angular.bind(this, function(data) {
      this.topbar.hide_message();
      if (data.result == 'ok') {
        this.maps.push(data.map)
      }
    })).
    error(angular.bind(this, function() {
      this.topbar.show_error("creating failed...");
    }));
};

UserController.prototype.deleteMap = function(key) {
  var result = this.window.confirm('Are you sure you want to delete this map?');
  if (!result) {
    return;
  }
  this.topbar.show_message('deleting...');
  var params = $.param({'key': key});
  this.http.post('/_/delete_map/', params).
    success(angular.bind(this, function(data) {
      this.topbar.hide_message();
      var index = -1;
      for (var i = 0; i < this.maps.length; i++) {
        if (this.maps[i].key == key) {
          index = i;
          break;
        }
      }
      if (index != -1) {
        this.maps.splice(index, 1);
      }
    })).
    error(angular.bind(this, function() {
      this.topbar.show_error("Deleting failed...");
    }));
};


module.exports = UserController;

},{}]},{},[2])