;(function (){

  var global = this;

  var App, AppList, AppView, AppListView, $db, Dashcouch = {},
      dbName, ddocName, fragments;

  fragments = unescape(document.location.href).split('/');
  dbName = fragments[3];
  ddocName = fragments[5];

  Dashcouch.$db = $db = $.couch.db(dbName);
  Dashcouch.ddoc = ddocName;

  Backbone.couch_connector.config.db_name = dbName;
  Backbone.couch_connector.config.ddoc_name = ddocName;

  Dashcouch.App = App = Backbone.Model.extend({
    defaults : {
      name : "App",
      ddoc : {}
    }
  });

  Dashcouch.AppList = AppList = Backbone.Collection.extend({
    model : App
  });

  Dashcouch.AppView = AppView = Backbone.View.extend({

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
        , ddoc = this.model.get("ddoc")
        , name = this.model.get("name");

      $db.openDoc(ddoc, { success : function (doc){
        that.model.set("doc", doc);
        Dashcouch.Apps = Dashcouch.Apps || {};
        Dashcouch.Apps[name] = {
          app : that.model
        };
        if ( doc.run ) {
          var uri = "../"+name+doc.run, s;
          s = document.createElement("script");
          s.src = uri;
          document.body.appendChild(s);
          //document.body.write('<script src="'+uri+'"><\/script>')
        }
        else if ( doc.dashapp.js && doc.dashapp.js.main ){
          var main = doc.dashapp.js.main;
          main = new Function("app", main.match(/{([\S\s]+)}/)[1]);
          main(that.model);
        }
        else if ( doc.dashapp.templates && doc.dashapp.templates.main ) {
          $(".content").html(doc.dashapp.templates.main);
        }
      }});

    }

  });

  Dashcouch.AppListView = AppListView = Backbone.View.extend({

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
          if (name !== "DashCouch") {
            that.collection.add({ name : name, ddoc : row.id });
          }
        });

        that.render();

      }});
    }

  });

  global.Dashcouch = global.Dashcouch || Dashcouch;
  global.AppListView = new AppListView();
}());
