(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){"use strict";var Topbar=function(){var elem=$("#topbar");return{show_message:function(msg){elem.text(msg);elem.removeClass("hide");elem.removeClass("error")},show_error:function(msg){elem.text(msg);elem.removeClass("hide");elem.addClass("error")},hide_message:function(){elem.text("");elem.addClass("hide")}}};module.exports=Topbar},{}],2:[function(require,module,exports){"use strict";var UserController=require("./usercontroller");var Topbar=require("./topbar");var ucApp=angular.module("uc",[]);ucApp.controller("UserController",UserController);ucApp.factory("topbar",Topbar);ucApp.config(function($httpProvider){$httpProvider.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded"})},{"./topbar":1,"./usercontroller":3}],3:[function(require,module,exports){"use strict";var UserController=function($scope,$http,$window,topbar){this.scope=$scope;this.http=$http;this.window=$window;this.topbar=topbar;this.name=null;this.avatar=null;this.http.post("/_/get_user/").success(angular.bind(this,function(data){if(data.result=="ok"){this.name=data.name;this.avatar=data.avatar}})).error(angular.bind(this,function(){}))};UserController.prototype.save=function(){this.topbar.show_message("saving...");var params=$.param({name:this.name,avatar:this.avatar});this.http.post("/_/set_user/",params).success(angular.bind(this,function(data){this.topbar.hide_message()})).error(angular.bind(this,function(){this.topbar.show_error("Saving failed...")}))};module.exports=UserController},{}]},{},[2]);