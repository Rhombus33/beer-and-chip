var USER = require('./models/models').User;
var EVENT = require('./models/models').Event;
var ITEM = require('./models/models').Item; 
var GUEST = require('./models/models').Guest;
var BASKET = require('./models/models').Basket;

var users = [
  { facebookID: 10,
    displayName: 'Diamond',
    email: 'DW@DW.com' },
  { facebookID: 5,
    displayName: 'Alex',
    email: 'AS@AS.com' }
];

var events = [
  { UserId: 1,
    name: "Diamond's BDAY" }, 
  { UserId: 2,
    name: "Alex's BDAY" },
  { UserId: 2,
    name: "Alex's Graduation" }
];

var items = [{name: 'cake', EventId: 1},{name: 'milk', EventId: 1}];

var guests = [
  { EventId: 1,
    name: 'Diamond',
    email: 'diamond.d.wheeler@gmail.com' },
  { EventId: 2,
    name: 'John' },
  { EventId: 3,
    name: 'Allen' },
  { EventId: 2,
    name: 'Allen' },
];

var baskets = [
  { EventId: 1,
    GuestId: 1 
  },
  { EventId: 2,
    GuestId: 2
  },
  { EventId: 3,
    GuestId: 3 
  },
  { EventId: 2,
    GuestId: 4 
  }
];


USER.bulkCreate(users)
  .then(function() {
    EVENT.bulkCreate(events)
      .then(function() {
        GUEST.bulkCreate(guests)
        .then(function() {
          BASKET.bulkCreate(baskets);
          ITEM.bulkCreate(items);
        });
      });
  });

