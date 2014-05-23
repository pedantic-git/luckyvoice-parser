

Songs = new Meteor.Collection("songs");

Pages = new Meteor.Pagination(Songs, {
  perPage: 50,
  dataMargin: 2,
  table: {
    class: "table table-border",
    fields: ["artist", "track", "duration"],
    header: ["Artist", "Title", "Duration"],
    wrapper: "table-wrapper"
  },
  sort: {artist: 1}
});

if (Meteor.isClient) {

  Template.songs.events({
    'keyup #search': function (event) {
      var search = $('#search').val();
      Pages.set({filters: {artist: search}});
    }
  });
}
