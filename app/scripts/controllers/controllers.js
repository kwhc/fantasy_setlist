'use strict';

/**
 * @ngdoc function
 * @name fantasySetlistApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fantasySetlistApp
 */
angular.module('fantasySetlistApp')
    .controller('SetlistCtrl', function ($scope,$http,$filter,$routeParams,sldFactory,spotifyFactory,bitFactory){
        $scope.players=[];
        $scope.curOrderPos = 0;
        $scope.playerCount = $scope.players.length;
        $scope.playerCountArr=[];
        $scope.draftOrderType = 'snake';
        $scope.draftRounds=[1,2,3,4,5,6,7,8,9,10];
        $scope.currentDraftRound=1;
        $scope.pickCount=0;
        $scope.format = 'EEEE, MMMM dd, yyyy';
        $scope.artist={};

        $scope.draft={
          id: null,
          rounds:[1,2,3,4,5,6,7,8,9,10]
        };

        $scope.showBandName=true;
        $scope.showPlayers=false;
        $scope.showSongs=false;

        $scope.show={
          artists:[],
          venue:null,
          tour:null,
          date:null
        };

        $scope.toggleBandName=function(){
            $scope.showBandName=false;
            $scope.showPlayers=true;
            $scope.showSongs=false;
        };
        $scope.togglePlayers=function(){
            $scope.showBandName=false;
            $scope.showPlayers=false;
            $scope.showSongs=true;
        };
        $scope.toggleSongs=function(){

        };

        $scope.isEven=function(value) {
            if(value%2 == 0) {
                return true;
            }else {
                return false;
            }
        };

        $scope.draftRoundEnd=function(){
            if($scope.currentDraftRound===($scope.draftRounds.length+1)){
                console.log('End of draft.');
                return true;
            }else{
                //console.log('Draft continues.'+$scope.currentDraftRound+' '+$scope.draft.rounds.length);
                return false;
            }
        };

        $scope.playersPick=function(name){
            if(!(name==null) || !(name=='')){
                return name+'\'s Pick';
            }
        };

        $scope.addPlayer = function(){
            $scope.curOrderPos++;
            $scope.players.push({name:$scope.newPlayerName,pos:$scope.curOrderPos,songs:[]});
            $scope.playerCountArr.push({pos:$scope.curOrderPos});
            $scope.newPlayerName = '';
            $scope.playerCount = $scope.players.length;
            console.log($scope.draft.players);
        };

        $scope.treeCallbacks={
            dropped: function(e){
                //e.source.nodeScope.$modelValue.pos = e.dest.index;
                angular.forEach($scope.players, function(player){
                   player.pos=$scope.players.indexOf(player) + 1;
                });
                $scope.currentPlayer=$scope.players[0];
                console.log('Just dropped '+ e.source.nodeScope.$modelValue.name + '. His new index is: '+e.dest.index);
            }
        };

        $scope.today = function() {
          //$scope.eventDate = $filter('date')(new Date(), $scope.format);
          //$scope.eventDate = new Date();
        };
        $scope.today();

        $scope.clear = function () {
          $scope.eventDate = null;
        };

        // Disable weekend selection
        //$scope.disabled = function(date, mode) {
        //  return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
        //};

        $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function($event) {
          $event.preventDefault();
          $event.stopPropagation();
          $scope.opened = true;
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.updateArtists = function(typed){
          $scope.newartists = getMyHttpData(typed);
        };

        function getMyHttpData(){
          var deferred = $q.defer();
          $http.jsonp(request)
          .success(function(data){
            // the promise gets resolved with the data from HTTP
            deferred.resolve(data);
          });
          // return the promise
          return deferred.promise;
        };
        $scope.artists = [];
        //Get artists
        $scope.getArtists = function(artistNameQuery){
          spotifyFactory.getArtists(artistNameQuery)
            .success(function(data){
              $scope.artists = angular.fromJson(data.artists.items);
            });
        };

        $scope.setArtist = function(a){
          $scope.artist.name = a.name;
          $scope.artist.img = $scope.setArtistImage(a);
        };

        $scope.setArtistImage = function(a){
          if(a.images.length === 0){
            return 'images/artistDefault.png';
          }else{
            return a.images[0].url;
          }
        };

        $scope.venue = {};
        $scope.getVenue = function(venueQuery){
          bitFactory.getVenues(venueQuery)
            .success(function(data){
              $scope.$apply(function(){$scope.possibleVenues = angular.fromJson(data)});
            });
        };
        $scope.setVenue = function(v){
            $scope.venue.name = v.name;
        }

        $scope.disableAddPlayersBtn = function(){
          if(!$.isEmptyObject($scope.venue) && !$.isEmptyObject($scope.artist) && $scope.eventDate != null){
            return false;
          }else{
            return true;
          }
        }
        //Get songs
        /*
        $http.get('http://developer.echonest.com/api/v4/song/search?api_key=XWKTVTJRVNNJ89ZGV&artist=new+found+glory&results=100')
            .success(function(data2){
                $scope.echonest=data2.response;
                $scope.songs=data2.response.songs;
                //console.log(data2.response);
        });
        */

        //Get Albums
        //$http.get('https://api.spotify.com/v1/artists/'+nfgspotifyid+'/albums?limit=50')
        /*spotifyFactory.getAlbums()
          .success(function(data){
              $scope.albums=data.items;
              //$scope.songs=data.response.songs;
              //console.log(data.items);
              $scope.albumid = [];
              angular.forEach($scope.albums,function(value,index){
                  $scope.albumid.push(value.id);
                  //console.log(value.id+index);
              });
              //console.log($scope.albumid);
              $http.get('https://api.spotify.com/v1/albums?ids='+$scope.albumid)
                  .success(function(data1){
                     console.log('yes? '+data1);
                  });
          });*/

        $scope.createDraft = function(){
          $scope.createDraftDataJSON = JSON.stringify({title:$scope.artistName});
          sldFactory.createDraft($scope.createDraftDataJSON)
            .success(function(data,status){
              //console.log('status: '+status);
              //console.log('draft id: '+ angular.fromJson(data).id);
              $scope.$apply(function(){$scope.draft = {id: angular.fromJson(data).id}});
              //console.log('scope id: '+$scope.draft.id);
            })
            .error(function(data,status){
              console.log('error creating draft');
              console.log('data: '+data);
              console.log('status: '+status);
            })
            .then(function(data){

            });
        };

        $scope.createTempUsers = function($q){
          angular.forEach($scope.players, function(player){
            $scope.createTempUserDataJSON = JSON.stringify({name:player.name, draftID:$scope.draft.id});
              sldFactory.createTempUsers($scope.createTempUserDataJSON)
              .success(function(data,status){
                console.log('data: '+data);
                console.log('status: '+status);
                $scope.$apply(function(){player.id = angular.fromJson(data).id});
                console.log('Temp User Created: '+player.id);
              })
              .error(function(data,status){
                console.log('Error creating temp user');
                console.log('data'+data);
                console.log('status:'+status);
              })
              .then(function(){
                $scope.$apply(function(){$scope.currentPlayer=$scope.players[0]});
                console.log('First Player ID: '+$scope.players[0].id);
                console.log('Current Player ID: '+$scope.currentPlayer.id);
                console.log('Current Player Name: '+$scope.currentPlayer.name);
              });
          });

        };

        $scope.setDraftOrder=function(){
          $scope.createTempUsers();
          $scope.togglePlayers();
        };

        $scope.createDraftOrder = function(){
          //var createDraftOrderUrl = sldApiURLBase + '/';
          //$.post(createDraftOrderUrl,createDraftOrder)
        };

      $scope.createPick = function(userID){
        console.log('userID: '+userID);
        console.log('roundID: '+$scope.currentDraftRound);
        console.log('song title: '+$scope.currentSong);
        console.log('draftID: '+$scope.draft.id);

        $scope.createPickDataJSON = JSON.stringify({'draftID':$scope.draft.id, 'userID':userID, 'song_name':$scope.currentSong, 'roundID':$scope.currentDraftRound});
        sldFactory.createPick($scope.createPickDataJSON)
          .success(function(data, status){
              console.log('Posted');
              console.log(data);
          })
          .error(function(data, status){
              console.log('data: '+data);
              console.log('status: '+status);
          });
      };

      $scope.addSong = function(currentPlayerID){
        $scope.createPick(currentPlayerID);

        angular.forEach($scope.players, function(player){
          if(player.name === $scope.currentPlayer.name){
            console.log(player.name+' chooses '+$scope.currentSong);
            player.songs.push({name:$scope.currentSong,round:$scope.currentDraftRound});
            $scope.currentSong = "";
          }
        });

        console.log('Adjusted Index of current player: '+($scope.players.indexOf($scope.currentPlayer)+1)+' of '+$scope.players.length);

      //Change next current player depending on draft order type
      switch($scope.draftOrderType) {
        case 'straight':
          if(($scope.players.indexOf($scope.currentPlayer)+1)===$scope.players.length) {
            //Reset to top of list
            $scope.currentPlayer = $scope.players[0];
            //Increase Current Draft Round by 1
            $scope.currentDraftRound++;
          }else{
            //Next current player
            $scope.currentPlayer = $scope.players[($scope.players.indexOf($scope.currentPlayer)+1)];
          }
          break;
        case 'snake':
          console.log('Draft Round: '+$scope.currentDraftRound);

          if($scope.isEven($scope.currentDraftRound)){
            if(($scope.players.indexOf($scope.currentPlayer)+1)===1){
              $scope.currentPlayer = $scope.currentPlayer;
              if($)
                $scope.currentDraftRound++;
            }else{
              $scope.currentPlayer = $scope.players[($scope.players.indexOf($scope.currentPlayer)-1)];
            }
          }else{
            console.log('Counting Up');
            //console.log('Current Pick: '+$scope.currentPlayer.name +($scope.players.indexOf($scope.currentPlayer)+1));

            //Count up
            if(($scope.players.indexOf($scope.currentPlayer)+1)===$scope.players.length){
              $scope.currentPlayer = $scope.currentPlayer;
              console.log('Counting Down: '+ ($scope.players.indexOf($scope.currentPlayer)+1));
              //Count down
              $scope.currentDraftRound++;
            }else{
              $scope.currentPlayer = $scope.players[($scope.players.indexOf($scope.currentPlayer)+1)];
            }
            console.log('Next up: '+$scope.currentPlayer.name+' Index: '+($scope.players.indexOf($scope.currentPlayer)+1));
        }
        break;
      }
    };

    $scope.routeUserId = $routeParams.userId;
    $scope.routeDraftId = $routeParams.draftId;
    $scope.getUserPicks = function(){
      sldFactory.getPicks($scope.routeDraftId,$scope.routeUserId);
    }
  })
  .controller('UserGameView', function ($scope,$filter,$routeParams,sldFactory) {
    $scope.routeUserId = $routeParams.userId;
    $scope.routeDraftId = $routeParams.draftId;
    $scope.getUserPicks = function(){
      sldFactory.getPicks($scope.routeDraftId,$scope.routeUserId)
        .success(function(data,status){
          console.log('success! data: '+data);
          console.log('success! status: '+status);
          $scope.$apply(function(){$scope.picks=angular.fromJson(data)});
        })
        .error(function(data,status){
          console.log('error data: '+data);
          console.log('error status: '+status);
        });
    };

    $scope.getAllPicks = function(){
      sldFactory.getPicks();
    };

    $scope.init=function(){
      $scope.getUserPicks();
    };
    $scope.getUserPicks();
  })
  .controller('UserView',function ($scope,$routeParams,sldFactory){

    $scope.getData = function() {
      sldFactory.getUser($routeParams.userId)
        .success(function (data, status) {
          $scope.$apply(function(){$scope.user = angular.fromJson(data).user});
          console.log(angular.fromJson(data));
          console.log(data);
          console.log(angular.fromJson(data).user);

        sldFactory.getPicks($scope.user.draftId,$routeParams.userId)
          .success(function(picksData, picksStatus){
            $scope.$apply(function(){$scope.picks = angular.fromJson(picksData)});
            console.log('picks');
            console.log(angular.fromJson(picksData));
            console.log(picksData);
          });

        });
    };

    $scope.getData();
  })
  .controller('TempUserView',function ($scope,$routeParams,sldFactory){

    $scope.togglePlayed = function(){

    };

    $scope.getData = function() {
      sldFactory.getTempUser($routeParams.userId).
        success(function(data, status) {
          $scope.$apply(function(){$scope.tempuser = angular.fromJson(data).user});
          console.log(angular.fromJson(data).user);
        }).
        then(function(){
          sldFactory.getPicks($scope.tempuser.draft.id,$routeParams.userId)
            .success(function(data2){
              console.log(angular.fromJson(data2));
              console.log($scope.tempuser.draft.id);
              $scope.$apply(function(){$scope.picks = angular.fromJson(data2)});
            })
        });
    };

    $scope.getData();
  })
  .controller('DraftView', function($scope,$routeParams,sldFactory){

    $scope.randomImageBackground = function(draftId){
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

    $scope.getDraftViewData = function(){
      sldFactory.getDraft($routeParams.draftId)
        .success(function(data){
          console.log(data);
          $scope.$apply($scope.draft=angular.fromJson(data).draft);
          $scope.$apply($scope.users=angular.fromJson(data).draft.users);
        });
    };

    $scope.getDraftViewData();

  })
  .controller('DraftAdminView', function($scope,$routeParams,sldFactory){

    $scope.randomImageBackground = function(draftId){
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

    $scope.getDraftViewData = function(){
      sldFactory.getDraft($routeParams.draftId)
        .success(function(data){
          console.log(data);
          $scope.$apply($scope.draft=angular.fromJson(data).draft);
          $scope.$apply($scope.users=angular.fromJson(data).draft.users);
        });
    };

    $scope.getDraftViewData();

  })
  .controller('DraftsView',function($scope,sldFactory){

    $scope.teaserSize = function(draftId){
      if(draftId % 8 === 0){
        return 'col-lg-8 col-md-12';
      }else{
        return 'col-lg-4 col-md-6 col-sm-12';
      }
    };

    $scope.randomImageBackground = function(draftId){
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

    $scope.getDraftsData = function(){
      sldFactory.getDrafts()
        .success(function(data){
          $scope.$apply($scope.drafts=angular.fromJson(data));
        })
    };
    $scope.getDraftsData();
  })
  .controller('DraftPlayCtrl',function($scope,$routeParams,sldFactory,RandomBackgroundImage){

/*    $scope.randomImageBackground = function(draftId){
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
    };*/

    $scope.getDraftViewData = function(){
      //$scope.randomImageBackground = RandomBackgroundImage();
      $scope.backgroundImg = RandomBackgroundImage;
      $scope.backgroundImg.image($routeParams.draftId);
      sldFactory.getDraft($routeParams.draftId)
        .success(function(data){
          console.log(data);
          $scope.$apply($scope.draft=angular.fromJson(data).draft);
          $scope.$apply($scope.users=angular.fromJson(data).draft.users);
        });
    };

    $scope.getDraftViewData();

  });
