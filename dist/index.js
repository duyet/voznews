"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const next = require("next");
const request = require("request");
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare()
    .then(() => {
    const server = express();
    server.get('/api/list', (req, res) => {
        const page = req.query.page;
        request.get(`https://p.voz.vn/feed/?box=diembao&page=${page}`, (err, data) => {
            if (err)
                console.error(err);
            res.json(JSON.parse(data.body));
        });
    });
    server.get('/api/view', (req, res) => {
        const id = req.query.id;
        request.get(`https://p.voz.vn/posts/${id}`, (err, data) => {
            if (err)
                console.error(err);
            res.json(JSON.parse(data.body));
        });
    });
    server.get('/api/comments', (req, res) => {
        const id = req.query.id;
        request.get(`https://p.voz.vn/posts/${id}/comments`, (err, data) => {
            if (err)
                console.error(err);
            res.json(JSON.parse(data.body));
        });
    });
    server.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(port, (err) => {
        if (err)
            throw err;
        console.log(`> Ready at :${port}`);
    });
})
    .catch((err) => {
    console.error(err.stack);
    process.exit(1);
});
//# sourceMappingURL=index.js.map