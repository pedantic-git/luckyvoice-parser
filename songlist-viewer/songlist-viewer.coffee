@Songs = new Meteor.Collection "songs"
@Pages = new Meteor.Pagination Songs,
  perPage: 50
  dataMargin: 2
  infinite: true,
  table:
    class: "table table-border"
    fields: ["artist", "track", "duration"]
    header: ["Artist", "Title", "Duration"]
    wrapper: "table-wrapper"
