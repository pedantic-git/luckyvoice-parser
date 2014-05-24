

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
      options: [20, 50, 100],
      itemsPerPage: 20
    },
    filters: {
      artist: {
	operator: ['$regex', 'i'],
	condition: '$or',
	searchable: true
      },
      track: {
	operator: ['$regex', 'i'],
	condition: '$or',
	searchable: true
      }
    }
  });

  Template.songs.events({
    'keyup #search': function (event) {
      var search = $('#search').val();
      SongsFilter.filter.set('artist', {value: search});
      SongsFilter.filter.set('track', {value: search});
    }
  });

  Template.songs.alpha = "abcdefghijklmnopqrstuvwxyz".split("");
}
