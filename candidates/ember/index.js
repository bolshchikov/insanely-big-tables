App = Ember.Application.create();

App.Record = Ember.Object.extend({
  init: function () {
    this.set('key', Math.random());
    this.set('value', Math.random()*100);
  }
});

App.DataController = Ember.ArrayProxy.create({
  timer: null,
  amount: null,
  elapsed: null,
  selected: -1,
  content: [
    App.Record.create(),
    App.Record.create()
  ]
});

App.ApplicationController = Ember.Controller.extend({
  insert: function() {
    App.DataController.unshiftObject(App.Record.create());
  },
  add: function() {
    App.DataController.pushObject(App.Record.create());
  },
  edit: function() {
    var index = App.DataController.get('selected');
    if (index !== -1) {
      App.DataController.content[index].set('value', 'Edited');
    }
  },
  remove: function() {
    var index = App.DataController.get('selected');
    if (index !== -1) {
      App.DataController.removeObject(App.DataController.content[index]);
    }
  },
  start: function() {
    var timer = App.DataController.get('timer'),
        amount = App.DataController.get('amount'),
        i = 0,
        launch = new Date().getTime();
    (function adding() {
      App.DataController.unshiftObject(App.Record.create());
      i += 1;
      if (i % 100 === 0) {
        console.log((new Date().getTime() - launch)/1000);
      }
      if (i < amount) setTimeout(adding, timer);
      else App.DataController.set('elapsed', (new Date().getTime() - launch)/1000);
    })();
  }
})

App.RecordView = Ember.View.extend({
  tagName: 'tr',
  record: null,
  click: function (ev) {
    App.DataController.set('selected', App.DataController.content.indexOf(this.record));
    $('.error').each(function (i, el) {
      $(el).removeClass('error');
    });
    $(ev.target).parent().addClass('error');
  }
});

App.TimerInputView = Ember.TextField.extend({
  attributeBindings: ['placeholder'],
  placeholder: 'timer, ms',
  valueBinding: 'App.DataController.timer'
});

App.AmountInputView = Ember.TextField.extend({
  attributeBindings: ['placeholder'],
  placeholder: 'amount',
  valueBinding: 'App.DataController.amount'
});

App.TotalView = Ember.TextField.extend({
  attributeBindings: ['readonly'],
  classNames: ['total'],
  readonly: 'readonly',
  valueBinding: 'App.DataController.content.length'
});

App.ElapsedView = Ember.TextField.extend({
  attributeBindings: ['readonly', 'placeholder'],
  classNames: ['elapsed'],
  readonly: 'readonly',
  placeholder: 'elapsed time, sec',
  valueBinding: 'App.DataController.elapsed'
});
