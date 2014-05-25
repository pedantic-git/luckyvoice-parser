

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

  Template.songs.rendered = function () {
    Session.set('artistfilter', undefined);
  };

  var search_func = function (event) {
    var search = $('#search').val();
    Session.set('artistfilter', undefined);
    SongsFilter.filter.set('artist', {value: search});
    SongsFilter.filter.set('track', {value: search});
  };

  Template.songs.events({
    'keyup #search': search_func,
    'touchleave #search': search_func,
    'click .fc-filter': function (event) {
      $('#search').val(''); // reset box
      // because filters only override the artist search
      SongsFilter.filter.set('track', {value: ''});

      Session.set('artistfilter', event.target.innerHTML);
    },
    'click .fc-filter-reset': function (event) {
      $('#search').val(''); // reset boxno
      Session.set('artistfilter', undefined);
    }
  });

  Template.songs.helpers({
    alpha: "abcdefghijklmnopqrstuvwxyz".split(""),
    isartistfilter: function (letter) {
      var af = Session.get('artistfilter');
      if (letter == '') {
	return af == undefined;
      }
      return letter == af;
    }
  });
}
