;(function (){

  var global = this;

  var App, AppList, AppView, AppListView, $db;

  $db = $.couch.db("dashcouch");

  App = Backbone.Model.extend({
    defaults : {
      name : "App",
      ddoc : {}
    }
  });

  AppList = Backbone.Collection.extend({
    model : App
  });

  AppView = Backbone.View.extend({

    tagName : "li",

    events : {
      'click' : 'load'
    },

    initialize : function () {
      _.bindAll(this, "render", "unrender", "load");
      this.model.bind("change", this.render);
      this.model.bind("remove", this.unrender);
    },

    render : function () {
      var name = this.model.get("name");
      $(this.el).html("<a href='#"+name+"'>"+name+"</a>");
      return this;
    },

    unrender : function () {
      $(this.el).remove();
    },

    load : function () {
      var that = this
        , ddoc = this.model.get("ddoc");
      $db.openDoc(ddoc, { success : function (doc){
        that.model.set("doc", doc);
        $(".content").html(doc.dashapp.tabs.main);
      }});
    }

  });

  AppListView = Backbone.View.extend({

    el : $(".app-menu"),

    initialize : function () {
      _.bindAll(this, "render", "getApps");
      this.collection = new AppList();
      this.getApps();
    },

    render : function () {
      $(this.el).empty();
      _(this.collection.models).each(function (app) {
        var appView = new AppView({ model : app });
        $(this.el).append(appView.render().el);
      }, this);
    },

    getApps : function () {
      var that = this

      that.collection.reset();

      $db.allDesignDocs({ success : function (data) {

        _(data.rows).each(function (row) {
          var name = row.id.split("/")[1];
          that.collection.add({ name : name, ddoc : row.id });
        });

        that.render();

      }});
    }

  });

  global.AppListView = new AppListView();
}());
