;(function(){

  var couchapp = require('couchapp');
  var path = require('path');
  var fs = require('fs');

  var ignore
      ,loadFileOptions
      ,validateDocUpdate
      ,ddoc
      ,loadAllAttachments

  validateDocUpdate = function validateDocUpdate (newDoc, savedDoc, userCtx) {
    if(!userCtx.name){
      throw({forbidden : "You must be logged in to enter patient records"})
    }
    if(newDoc.type === "data_managment_form"){
      if(newDoc.opername !== userCtx.name){
        throw({forbidden : "opername required to match your username"})
      }
    }
  }

  loadAllAttachments = function loadAllAttachments (ddoc, dir) {
    var listings = fs.readdirSync(dir)
    listings.forEach(function(listing){
        var file = path.join(dir, listing)
            ,stat = fs.statSync(file)
            ,prefix = ""
        if(stat.isFile()){return }
        if(path.basename(file) === "_attachments"){
            prefix = path.dirname(file).slice(__dirname.length+1)
            couchapp.loadAttachments(ddoc, file, prefix)
        } else {
            loadAllAttachments(ddoc, file)
        }
    });
  }

  ignore = JSON.parse(fs.readFileSync(path.join(__dirname, ".couchappignore")).toString())
  loadFileOptions = {ignore: ignore}

  // To load a subdirectory: views : couchapp.loadFiles('./views', loadFileOptions)
  ddoc = { _id : '_design/DashCouch'
    ,views : couchapp.loadFiles('./views', loadFileOptions)
    ,evently : null
    ,lists : null
    ,shows : null
    ,vendor : null
  }

  loadAllAttachments(ddoc, __dirname);
  module.exports = ddoc
}());
