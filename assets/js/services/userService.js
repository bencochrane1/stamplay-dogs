'use strict';

angular.module('doggydelight.service')

.factory('userService', function($q, $stamplay) {

  var user = $stamplay.User().Model;

  return {
    createCard: createCard,
    subscribe: subscribe,
    getUserModel: getUserModel,
    saveAddress: saveAddress,
    login: login,
    logout: logout,
    isLogged: isLogged,
    unsubscribe: unsubscribe
  }

  function unsubscribe(planId) {
    var deferred = $q.defer();

    $stamplay.Stripe().deleteSubscription(user.get('id'), planId)
    .then(function() {
      return $stamplay.Stripe().getSubscriptions(user.get('id'));
    })
    .then(function(response) {
      user.set('subscriptions', response.data);
      var saveUser = $stamplay.User().Model;

      saveUser.set('subscriptions', user.get('subscriptions'));
      saveUser.set('_id', user.get('_id'));
      saveUser.save()
      .then(function() {
        deferred.resolve();
      })
    })
    .catch(function(error) {
      console.log(error);
      deferred.reject(error);
    });

    return deferred.promise;
  };

  function isLogged() {
    return user.isLogged();
  };

  function logout() {
    return user.logout();
  };

  function login() {
    return user.login('facebook');
  };

  function saveAddress(address, city, zipcode) {
    var saveUser = $stamplay.User().Model;

    user.set('address', {
      address: address,
      city: city,
      zipcode: zipcode
    });
    saveUser.set('address', user.get('address'));
    saveUser.set('_id', user.get('_id'));

    return saveUser.save();
  };

  function createCard(cardObj) {
    var deferred = $q.defer();
    var $stripe = $stamplay.Stripe();

    $stripe.getCreditCard(user.get('id'))
    .then(function(response) {
      var newDeferred = $q.defer();
      if (response.card_id) {
        newDeferred.resolve();
      } else {
        Stripe.card.createToken(cardObj, function(error, response) {
          var token = response.id;
          $stamplay.Stripe().createCreditCard(user.get('id'), token)
          .then(function(response) {
            newDeferred.resolve(response);
          })
          .catch(function(error) {
            newDeferred.reject(error);
          });
        });
      }
      return newDeferred.promise;
    })
    .catch(function(error) {
      console.log(error);
    });
    return deferred.promise;
  };

  function subscribe(planId) {
    var deferred = $q.defer();

    $stamplay.Stripe().createSubscription(user.get('id'), planId)
    .then(function() {
      return $stamplay.Stripe().getSubscriptions(user.get('id'));
    })
    .then(function(response) {
      user.set('subscriptions', response.data);
      var saveUser = $stamplay.User().Model;
      saveUser.set('subscriptions', user.get('subscriptions'));
      saveUser.set('id', user.get('id'));
      saveUser.save()
      .then(function() {
        deferred.resolve();
      });
    })
    .catch(function(error) {
      console.log(error);
      deferred.reject(error);
    });

    return deferred.promise;
  };

  function getUserModel() {
    var deferred = $q.defer();
    console.log('gets intpo getUserModel');
    user.currentUser()
    .then(function() {
      if (user.isLogged()) {
        console.log('the user is logged in');
        console.log('stripe customer id: ', user.get('stripeCustomerId'));
        if (!user.get('stripeCustomerId')) {
          console.log('theres no stripe customer ID')
          console.log('user id: ', user.get('id'));
          $stamplay.Stripe().createCustomer(user.get('id'))
          .then(function(stripeResponse) {
            console.log('we got a response from stripe: ', stripeResponse)
            var saveUser = $stamplay.User().Model;
            user.set('stripeCustomerId', stripeResponse.customer_id);
            user.set('subscriptions', stripeReponse.subscriptions);
            saveUser.set('stripeCustomerId', user.get('stripeCustomerId'));
            saveUser.set('subscriptions', user.get('subscritions'));
            saveUser.set('_id', user.get('_id'));
            saveUser.save()
            .then(function() {
              deferred.resolve(user);
            })
          })
        } else {
          console.log('it was ok with stripe');
          deferred.resolve(user);
        }
      } else {
        console.log('it was ok with stripe');
        deferred.resolve(user);
      }
    })
    .catch(function(error) {
      console.log('it didnt like stripe: ', error)
      deferred.reject(error);
    });
    console.log('end of the function')
    return deferred.promise;
  };

})
