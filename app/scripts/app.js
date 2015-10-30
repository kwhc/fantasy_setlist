'use strict';

/**
 * @ngdoc overview
 * @name fantasySetlistApp
 * @description
 * # fantasySetlistApp
 *
 * Main module of the application.
 */
angular
  .module('fantasySetlistApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.tree',
    'ui.bootstrap',
    'autocomplete'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/quick-draft',{
        templateUrl: 'views/quick-draft.html',
        controller: 'SetlistCtrl'
      })
      .when('/api',{
            templateUrl: 'views/setlist.html',
            controller: 'SetlistCtrl'
      })
      .when('/game/:draftId/:userId',{
        templateUrl: 'views/game-passive.html',
        controller: 'UserGameView'
      })
      .when('/user/:userId',{
        templateUrl: 'views/user.html',
        controller: 'UserView'
      })
      .when('/temp-user/:userId',{
        templateUrl: 'views/temp-user.html',
        controller: 'TempUserView'
      })
      .when('/draft/:draftId',{
        templateUrl: 'views/draft.html',
        controller: 'DraftView'
      })
      .when('/draft-admin/:draftId',{
        templateUrl: 'views/draft-admin.html',
        controller: 'DraftAdminView'
      })
      .when('/draft',{
        templateUrl: 'views/drafts.html',
        controller: 'DraftsView'
      })
      .when('/draft-play/:draftId',{
        templateUrl: 'views/draft-play.html',
        controller: 'DraftPlayCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .factory('Artist',function($resource){
    return $resource('');
  })
  .factory('sldFactory', ['$http', function($http) {

    //var urlBase = '/api/customers';

    var sldFactory = {};

    //dataFactory.getCustomers = function () {
    //  return $http.get(urlBase);
    //};

    //dataFactory.getCustomer = function (id) {
    //  return $http.get(urlBase + '/' + id);
    //};
    //
    //dataFactory.insertCustomer = function (cust) {
    //  return $http.post(urlBase, cust);
    //};
    //
    //dataFactory.updateCustomer = function (cust) {
    //  return $http.put(urlBase + '/' + cust.ID, cust)
    //};
    //
    //dataFactory.deleteCustomer = function (id) {
    //  return $http.delete(urlBase + '/' + id);
    //};
    //
    //dataFactory.getOrders = function (id) {
    //  return $http.get(urlBase + '/' + id + '/orders');
    //};

    //Local API
    //var urlBase = 'http://localhost:8080/api.setlist_draft';
    //Production API
    var urlBase = 'http://sld-api.kentwilhelm.nyc';

    sldFactory.getPicks = function (draftID,userID) {
      return $.get(urlBase + '/picks/'+draftID+'/'+userID);
    };
    sldFactory.getUser = function(userId){
      return $.get(urlBase + '/user/' + userId);
    };
    sldFactory.createTempUsers = function(tempUserData){
      return  $.post(urlBase + '/temp-user', tempUserData);
    };
    sldFactory.getTempUser = function(userId){
      return $.get(urlBase + '/temp-user/' + userId);
    };
    sldFactory.createDraft = function(draftData){
      return $.post(urlBase + '/draft',draftData);
    };
    sldFactory.getDraft = function(draftId){
      return $.get(urlBase + '/draft/' + draftId)
    };
    sldFactory.getDrafts = function(){
      return $.get(urlBase + '/draft');
    };
    sldFactory.createPick = function(pickData){
      return $.post(urlBase + '/pick', pickData);
    };
    return sldFactory;
  }])
  .factory('gracenoteFactory',['$http',function($http){

  }])
  .factory('spotifyFactory',['$http', function($http){
    var spotifyFactory = {};
    var urlSpotfyBase = 'https://api.spotify.com/v1';
    var nfgspotifyid = '4ghjRm4M2vChDfTUycx0Ce';

    spotifyFactory.searchArtist = function(query){
      return $.get(urlSpotfyBase + '/search?q=' + query + '&type=artist');
    };
    spotifyFactory.getAlbums = function(){
      return $.get(urlSpotfyBase+'/artists/'+nfgspotifyid+'/albums?limit=50');
    };
    spotifyFactory.getArtists = function(artistName){
      return $http.get(urlSpotfyBase + '/search?q='+artistName+'&type=artist');
    };

    return spotifyFactory;
  }])
  .factory('bitFactory', ['$http',function($http){
    var bitFactory = {};
    var urlBitBase = 'http://api.bandsintown.com/';

    bitFactory.getVenues = function(venueNameQuery){
      return $.getJSON('http://api.bandsintown.com/venues/search.json?callback=?&query='+venueNameQuery+'&app_id=sld');
    };
    /*
    return{
      getShows: function(){
        return $.get(urlBitBase + 'artists/' + 'New Found Glory' + '/events.json?api_version=2.0&app_id=sld')
          .then(function(response){
            return response.data;
          }, function(response){
            return $q.reject(response.data);
          })
      }
    };
    */
    return bitFactory;
  }])
  .service('dataService', ['$http', function ($http) {

    var urlBase = '/api/customers';

    this.getCustomers = function () {
      return $http.get(urlBase);
    };

    this.getCustomer = function (id) {
      return $http.get(urlBase + '/' + id);
    };

    this.insertCustomer = function (cust) {
      return $http.post(urlBase, cust);
    };

    this.updateCustomer = function (cust) {
      return $http.put(urlBase + '/' + cust.ID, cust)
    };

    this.deleteCustomer = function (id) {
      return $http.delete(urlBase + '/' + id);
    };

    this.getOrders = function (id) {
      return $http.get(urlBase + '/' + id + '/orders');
    };
  }])
  .factory('utility',['$http', function($http){

    var utility = {};

    this.randomImageBackground = function(draftId){
      if(draftId % 5 === 0) {
        return 'images/dave_hause.jpg';
      }
      else if(draftId%4===0){
        return 'images/chris_martin.jpg';
      }
      else if(draftId%3===0){
        return 'images/wonder_years.png';
      }
      else if(draftId % 2 === 0){
        return 'images/blink-182.jpg';
      }
      else{
        return 'images/frank_turner.jpg';
      }
    };

    this.testFactory = function(){
      return console.log('utility test');
    };

    return utility;

  }])
  .factory('RandomBackgroundImage',function(){
    var RandomBackgroundImage = {};

    RandomBackgroundImage.image = function(draftId){
      if(draftId % 5 === 0) {
        return 'images/dave_hause.jpg';
      }
      else if(draftId%4===0){
        return 'images/chris_martin.jpg';
      }
      else if(draftId%3===0){
        return 'images/wonder_years.png';
      }
      else if(draftId % 2 === 0){
        return 'images/blink-182.jpg';
      }
      else{
        return 'images/frank_turner.jpg';
      }
    };

    return RandomBackgroundImage;

  });
