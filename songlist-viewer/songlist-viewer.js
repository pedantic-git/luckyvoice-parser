

Songs = new Meteor.Collection("songs");

if (Meteor.isServer) {

  Meteor.FilterCollections.publish(Songs, {
   name: 'songs'
  });

}

if (Meteor.isClient) {

  SongsFilter = new Meteor.FilterCollections(Songs, {
    template: 'songs',
    sort: {
      defaults: [
	['artist', 'asc']
      ]
    },
    pager: {
      options: [10, 20, 50, 100],
      itemsPerPage: 10
    },
    filters: {
      artist: {
	operator: ['$regex', 'i'],
	condition: '$or',
	searchable: 'required'
      },
      track: {
	operator: ['$regex', 'i'],
	condition: '$or',
	searchable: 'required'
      }
    }
  });

  var search_func = function (event) {
    var search = $('#search').val();
    SongsFilter.filter.set('artist', {value: search});
    SongsFilter.filter.set('track', {value: search});
  };

  Template.songs.events({
    'keyup #search': search_func,
    'touchleave #search': search_func,
    'mouseleave #search': search_func,
    'click .fc-filter': function (event) {
      $('#search').val(''); // reset box
      // because filters only override the artist search
      SongsFilter.filter.set('track', {value: ''});
    },
    'click .fc-filter-reset': function (event) {
      $('#search').val(''); // reset box
    }
  });

  

  Template.songs.alpha = "abcdefghijklmnopqrstuvwxyz".split("");
}
