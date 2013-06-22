App = Ember.Application.create();

App.Record = Ember.Object.extend({
  init: function () {
    this.set('key', Math.random());
    this.set('value', Math.random()*100);
  }
});

App.ApplicationController = Ember.ArrayController.extend({
  selected: -1,
  content: [App.Record.create(), App.Record.create()],

  insert: function() {
    this.unshiftObject(App.Record.create());
  },
  add: function() {
    this.pushObject(App.Record.create());
  },
  edit: function() {
    var record = this.content[this.get('selected')]
    if (record) record.set('value', 'Edited');
  },
  remove: function() {
    if (this.get('selected') !== -1) {
      this.removeObject(this.content[this.get('selected')]);
    }
  },
  start: function() {
    var that = this,
        i = 0,
        launch = new Date().getTime();
    (function adding() {
      that.unshiftObject(App.Record.create());
      i += 1;
      if (i % 100 === 0) {
        console.log((new Date().getTime() - launch)/1000);
      }
      if (i < that.get('amount')) setTimeout(adding, that.get('timer'));
      else that.set('elapsed', (new Date().getTime() - launch)/1000);
    })();
  }
})

App.RecordView = Ember.View.extend({
  tagName: 'tr',
  record: null,
  click: function (ev) {
    var ac = App.__container__.lookup("controller:application");

    ac.set('selected', ac.content.indexOf(this.record));
    $('.error').each(function (i, el) {
      $(el).removeClass('error');
    });
    $(ev.target).parent().addClass('error');
  }
});
