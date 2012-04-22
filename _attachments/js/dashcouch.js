;(function (){

  var global = this;

  var App, AppList, AppView, AppListView;

  App = Backbone.Model.extend({
    defaults : {
      name : "App"
    }
  });

  AppList = Backbone.Collection.extend({
    model : App
  });

  AppView = Backbone.View.extend({

    tagName : "li",

    initialize : function () {
      _.bindAll(this, "render", "unrender");
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
        , $db = $.couch.db("dashcouch");

      that.collection.reset();

      $db.allDesignDocs({ success : function (data) {
        var a = "b";

        _(data.rows).each(function (row) {
          var name = row.id.split("/")[1];
          that.collection.add({ name : name });
        });

        that.render();

      }});

    }
  });

  global.AppListView = new AppListView();
}());
