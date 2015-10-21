'use strict';

angular.module('doggydelight')

.controller('homeCtrl', function($rootScope, userService) {

  var homeModel = this;

  homeModel.isLogged = userService.isLogged();
  homeModel.signUp = signUp;
  homeModel.logout = logout;

  $rootScope.$watch('user', function(newVal) {
    homeModel.user = newVal;
    homeModel.isLogged = userService.isLogged();
  }, true);


  function signUp() {
    userService.login();
  }

  function logout() {
    userService.logout();
  };

});
