const http = require("http");
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const app = new Koa();
const router = new Router();
const bodyParser = require('koa-bodyparser');

// 假数据
const articleList = require('./data/articleList');


app.use(bodyParser());

// 跨域
const allowOrigins = [
    "http://localhost:6426",
    "http://localhost:8080"
];
app.use(cors({
    origin: function (ctx) {
        if (allowOrigins.includes(ctx.header.origin)) {
            return ctx.header.origin;
        }
        return false;
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    withCredentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

const query = function (results) {
    return new Promise((resolve,reject) => {
        resolve(results);
        // if (err) {
        //     //do something
        //     reject(err);
        // } else {
        //     //return data or anything you want do!
        //     resolve(results);
        // }
    })
}

router.get('/articleList', async (ctx) => {
    const sql = articleList;
    let results = await query(sql);
    let res = Object.create(null);
    res['data'] = results
    res['code'] = 200;
    res['message'] = 'success';
    ctx.body = res;
});

router.post('/postData', async (ctx, next) => {
    const data = ctx.request.body.name;
    let results = await query(data);
    let res = Object.create(null);
    res['data'] = results;
    res['code'] = 200;
    res['message'] = 'success';
    ctx.body = res
});

app
    .use(router.routes())
    .use(router.allowedMethods());

const port = 8081;
const hostname = '127.0.0.1';
http.createServer(app.callback()).listen(port,()=>{
    console.log('服务器启动中...',`http://${hostname}:${port}/`)
});

