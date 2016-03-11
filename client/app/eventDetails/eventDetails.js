angular.module('eventDetails', ['eventList'])
.controller('eventDetailsController', ['$scope', '$http', 'requestFactory', '$cookies', '$routeParams', function($scope, $http, requestFactory, $cookies, $routeParams) {  
/** ADD ITEM AND ADD GUEST INPUT BOXES **/

  // Holds text input from add item and add guest input boxes
  $scope.itemName;
  $scope.guestName; 
  $scope.guestEmail; 

  // sends a POST request to insert new item into the DB
  $scope.addItemFunc = function(itemName){
    $scope.itemName = '' // reset text field
    var newItem = { 
      EventId: $cookies.get('eventID'),
      name: itemName // this is coming from ng-model
    };
    requestFactory.addItem(newItem)
      .then(function() { 
        initializeDetails(); // update view
      });
  };

  // sends a POST request to insert new guest into the DB
  $scope.addGuestFunc = function(guestName, guestEmail){
    var newGuest = {
      EventId: $cookies.get('eventID'),
      name: guestName, //this is coming from ng-model
      email: guestEmail
    };
    requestFactory.addGuest(newGuest)
      .then(function() { 
        initializeDetails(); // update view
      });
    $scope.guestName = '';
    $scope.guestEmail = '';
  };

/** DRAG AND DROP TABLE **/

  // guests holds guests and the items they are bringing
  // selected is specific to drag-and-drop (can specify cb on item selected)
  $scope.models = {
    selected: null,
    guests: {}
  };

  // ng-model for storing event details
  $scope.details;

  // For simplicity when refering to the ng-model guests
  var guests =  $scope.models.guests;

  var initializeDetails = function() {
    // Makes request to server for all event details
    requestFactory.getEvents($routeParams.eventID)
      .then(function(details) {
        
        // assign event details to ng-model details
        $scope.details = details;

        // temporarily holds guestId: [items]
        var temp = {};

        // Populate temp
        for (var j = 0; j < details.items.length; j++) {
          var GuestId = details.items[j].GuestId;
          var item = details.items[j];
          if (temp[GuestId]) {
            temp[GuestId].push(item);
          } else {
            temp[GuestId] = [item];
          }
        }        

        // Populate the ng-model guests
        for (var i = 0; i < details.guests.length; i++){
          var guestName = details.guests[i].name;
          var guestId = details.guests[i].id;
          // Adds guestName and guestId to ng-model guests 
          // and assigns guests an items array or an empty array
          guests[guestName + ' ' + guestId] = temp[guestId] ? temp[guestId] : [];
        }
      })
  }

  // Fires when an item is moved to a column
  $scope.reassignItem = function(item, guestInfo) {
    var guestId = $scope.getId(guestInfo);
    requestFactory.updateItem(item, guestId);
    // nessesary for drag-and-drop visualization
    // return false to reject client-side visual update
    return item; 
  }

  // parse guestInfo for guest name
  $scope.getId = function(guestInfo) {
    var name = guestInfo.match(/([^\s])+/g);
    return name[name.length - 1]; // id comes after the last space
  }

  // parse guestInfo for guest Id 
  $scope.getName = function(guestInfo) {
    var name = guestInfo.match(/([^\s])+/g);
    return name.slice(0, name.length - 1).join(' '); // name is everything before the last space
  }

/** EMAIL **/
  // sends unique eventDetails url to all guests
  $scope.email = function() {
    var eventID = $cookies.get("eventID")
    requestFactory.sendEmails(eventID);
  }

/** INITIALIZE ON PAGE LOAD **/
  initializeDetails();
}])

.factory('requestFactory', function($http, $cookies) {
  // All requests return a promise to chain further functionality
  var getEvents = function(eventID) {
    return $http({
      method: 'GET',
      url: '/api/eventDetails/' + eventID
    })
    .then(function(res) {
      // returns a promise with data from the server
      return res.data;
    })
  };

  var sendEmails = function(eventID) {
    return $http({
      method: 'GET',
      url: '/api/email/' + eventID
    });
  };

  var updateItem = function(item, guestId) {
    return $http({
      method: 'PUT',
      url: '/api/items/' + item.id,
      data: {GuestId: guestId}
    })
    .then(function() {
      console.log("UPDATED DB");
    })
  };

  var addGuest = function(newGuest) {
    return $http({
      method: 'POST',
      url: '/api/guests',
      data: newGuest
    });
  };

  var addItem = function(newItem) {
    return $http({
      method: 'POST',
      url: '/api/items',
      data: newItem
    });
  };

  return {
    getEvents: getEvents,
    sendEmails: sendEmails,
    updateItem: updateItem,
    addGuest: addGuest,
    addItem: addItem
  }
})