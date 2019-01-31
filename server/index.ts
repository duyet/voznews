import * as express from 'express';
import * as next from 'next';
import * as request from 'request';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
    .then(() => {
        const server = express();

        server.get('/api/list', (req: express.Request, res: express.Response) => {
            const page = req.query.page;
            request.get(`https://p.voz.vn/feed/?box=diembao&page=${page}`, (err, data) => {
                if (err) console.error(err);
                res.json(JSON.parse(data.body));
            });
        });

        server.get('/api/view', (req: express.Request, res: express.Response) => {
            const id = req.query.id;
            request.get(`https://p.voz.vn/posts/${id}`, (err, data) => {
                if (err) console.error(err);
                res.json(JSON.parse(data.body));
            });
        });

        server.get('/api/comments', (req: express.Request, res: express.Response) => {
            const id = req.query.id;
            const page = req.query.page || 1;
            request.get(`https://p.voz.vn/posts/${id}/comments?page=${page}`, (err, data) => {
                if (err) console.error(err);
                res.json(JSON.parse(data.body));
            });
        });

        server.get('*', (req: express.Request, res: express.Response) => {
            return handle(req, res);
        });

        server.listen(port, (err: Error) => {
            if (err) throw err;
            console.log(`> Ready at :${port}`);
        });
    })
    .catch((err: Error) => {
        console.error(err.stack);
        process.exit(1);
    });
