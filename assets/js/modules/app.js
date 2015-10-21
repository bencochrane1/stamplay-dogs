'use strict';

angular.module('doggydelight', ['doggydelight.service', 'ngRoute', 'ui.router', 'ngStamplay']);

angular.module('doggydelight')

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('home', {
    url: '/',
    templateUrl: '/pages/home.html',
    controller: 'homeCtrl',
    controllerAs: 'home'
  })

  .state('subscriptions', {
    url: '/subscriptions',
    templateUrl: '/pages/subscriptions.html',
    controller: 'subscriptionCtrl',
    controllerAs: 'sub'
  })

  .state('profile', {
    url: '/profile',
    templateUrl: '/pages/profile.html',
    controller: 'profileCtrl',
    controllerAs: 'profile'
  });

  $urlRouterProvider.otherwise('/');
})

.run(function($rootScope, userService) {
  userService.getUserModel()
  .then(function(userResp) {
    $rootScope.user = userResp;
  });
});
