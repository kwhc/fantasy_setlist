'use strict';

/**
 * @ngdoc function
 * @name fantasySetlistApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasySetlistApp
 */
angular.module('fantasySetlistApp')
  .controller('MainCtrl', function ($scope,$http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $http.get('http://musicbrainz.org/ws/2/artist/6acb932e-840d-47ac-8e0d-725ad8a6e52c?fmt=json')
        .success(function(data){
            $scope.test = data;
        });

  });
