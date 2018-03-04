"use strict";
var express = require('express');
var appexp = express();
var qs = require('querystring');
var url = require("url");
// var mysql= require('mysql')
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbpathurl = 'mongodb://localhost:27017';
const dbName = 'testing';
const collectionName = 'userinfo';

appexp.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});


var mongodbProcess = function() {}

mongodbProcess.prototype.mongodbTest = function(data,mode,callback){

  var res =  null;
    MongoClient.connect(dbpathurl, function (err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server"+mode);
  
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

    if(mode == "add")
    {
    collection.insertMany([
        { name: data.name, age: data.age, company:data.company,email:data.email,phone:data.phone,designation:data.designation }
    ], function (err, result) {
        //console.log("Inserted 1 document into the collection");
        res = result;
        client.close(function(err){     
          console.log("add end")
          console.log(res) 
         callback(res);     
        });
    });
    }
   
    if(mode == "update")
    {
    collection.updateOne({ name: data.name }
        , { $set: { name: data.name,phone: data.phone, age: data.age, company:data.company,email:data.email,designation:data.designation} }, function (err, result) {
            assert.equal(err, null);
            res = result;
            console.log(result);
            client.close(function(err){     
              console.log("updated") 
             callback(res);     
            });
        });


    }
   
    if(mode == "fetch")
    {
    collection.find({ name: data.name }).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log(docs)
        res = docs;
        client.close(function(err){     
          console.log("fetch end") 
         callback(res);     
        });
    });

    }
   
    
     if(mode == "delete")
     {
    collection.deleteOne({ name : data.name }, function(err, result) {
        assert.equal(err, null);
      res = result;
      client.close(function(err){     
        console.log("remove end") 
       callback(res);     
      });
    });   

     }

     if(mode == "list")
     {
       const collection = db.collection(collectionName);
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        res = docs;
        client.close(function(err){     
          console.log("list end") 
         callback(res);     
        });
    });

     } 

     

  });
}

var processData = new mongodbProcess();



appexp.get('/add', function (request, response) {
  
    var queryData = url.parse(request.url, true).query;
    console.log(queryData);
    processData.mongodbTest(queryData,"add",function(data,xml)
    {
       response.writeHead(200, {"Content-Type": "text/plain"});
       response.end(JSON.stringify({"response":"success"}));
    });
});

appexp.get('/update', function (request, response) {
    var queryData = url.parse(request.url, true).query;
    processData.mongodbTest(queryData,"update",function(data,xml)
    {
      response.writeHead(200, {"Content-Type": "text/plain"});
        response.end(JSON.stringify({"response":"updated successfully"}));
    });
});

appexp.get('/fetch', function (request, response) {
    var queryData = url.parse(request.url, true).query;
     processData.mongodbTest(queryData,"fetch",function(data,xml)
    {
       response.writeHead(200, {"Content-Type": "text/plain"});
       response.end(JSON.stringify(data));
    });
});

appexp.get('/delete', function (request, response) {
  var queryData = url.parse(request.url, true).query;
   processData.mongodbTest(queryData,"delete",function(data,xml)
  {
     response.writeHead(200, {"Content-Type": "text/plain"});
     response.end(JSON.stringify({"response":"Data Removed"}));
  });
});

appexp.get('/list', function (request, response) {
  var queryData = url.parse(request.url, true).query;
   processData.mongodbTest(queryData,"list",function(data,xml)
  {
     response.writeHead(200, {"Content-Type": "text/plain"});
     response.end(JSON.stringify({data}));
  });
});


var server = appexp.listen(8030, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);

});

