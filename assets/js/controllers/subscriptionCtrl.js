'use strict';

angular.module('doggydelight')

.controller('subscriptionCtrl', function($rootScope, $location, $anchorScroll, $timeout, userService) {

  var subModel = this;

  subModel.saveAddress = true;
  subModel.address = (subModel.user && subModel.user.get('address')) ? subModel.user.get('address') : {};

  subModel.showThankyou = false;
  subModel.showPayment = false;

  subModel.openSubscribe = openSubscribe;
  subModel.subscribe = subscribe;

  subModel.selectedPlanMap = {
    tplanOne: 'God save the queen',
    tplanTwo: 'From kentucky with love',
    tplanThree: 'The rum diary'
  };

  subModel.card = {
    number: '4242424242424242',
    expM: '12',
    expY: '2026',
    cvc: '989'
  };    

  function openSubscribe(planId) {
    subModel.showPayment = true;
    subModel.showThankyou = false;
    subModel.selectedPlanName = subModel.selectedPlanMap[planId];
    subModel.selectedPlanId = planId;

    $timeout(function() {
      $location.hash('payment-form');
      $anchorScroll();
    })
  }

  function subscribe($event) {
    $($event.currentTarget).prop('disabled', 'disabled');

    if (subModel.saveAddress) {
      userService.saveAddress(subModel.address.address, subModel.address.city, subModel.address.zipcode);
    }

    userService.createCard({
      number: subModel.card.number,
      exp_month: subModel.card.expM,
      exp_year: subModel.card.expY,
      cvc: subModel.card.cvc
    })
    .then(function() {
      return userService.subscribe(subModel.selectedPlanId);
    })
    .then(function() {
      subModel.showPayment = false;
      subModel.showThankyou = true;
      $($event.currentTarget).removeProp('disabled');
    })
    .catch(function(error) {
      $($event.currentTarget).removeProp('disabled');
    });
  }


});
