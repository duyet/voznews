"use strict";
exports.__esModule = true;
var express = require("express");
var next = require("next");
var request = require("request");
var port = process.env.PORT || 3000;
var dev = process.env.NODE_ENV !== 'production';
var app = next({ dev: dev });
var handle = app.getRequestHandler();
app.prepare()
    .then(function () {
    var server = express();
    server.get('/api/list', function (req, res) {
        var page = req.query.page;
        request.get("https://p.voz.vn/feed/?box=diembao&page=" + page, function (err, data) {
            if (err)
                console.error(err);
            res.json(JSON.parse(data.body));
        });
    });
    server.get('/api/view', function (req, res) {
        var id = req.query.id;
        request.get("https://p.voz.vn/posts/" + id, function (err, data) {
            if (err)
                console.error(err);
            res.json(JSON.parse(data.body));
        });
    });
    server.get('/api/comments', function (req, res) {
        var id = req.query.id;
        request.get("https://p.voz.vn/posts/" + id + "/comments", function (err, data) {
            if (err)
                console.error(err);
            res.json(JSON.parse(data.body));
        });
    });
    server.get('*', function (req, res) {
        return handle(req, res);
    });
    server.listen(port, function (err) {
        if (err)
            throw err;
        console.log("> Ready at :" + port);
    });
})["catch"](function (err) {
    console.error(err.stack);
    process.exit(1);
});
