require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';


import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

// 비구조화할당을 통해 process.env 내부값에 대한 레퍼런스 만들기
const { PORT, MONGO_URI } = process.env;

mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useFindAndModify: false })
    .then(() => {
        console.log('Connect to MongoDB');
    })
    .catch(e => {
        console.log(e);
    });

const app = new Koa();
const router = new Router();

//라우터설정
router.use('/api', api.routes()); //api라우트 적용

//라우터 적용 전 bodyParser적용
app.use(bodyParser());
app.use(jwtMiddleware);

//app인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async ctx => {
    //not found면서 주소가 /api로 시작하지 않는 경우
    if (ctx.status === 404 && ctx.path.indexOf('/api') !== 0) {
        //index.html내용 반환
        await send(ctx, 'index.html', { root: buildDirectory });
    }
});


// PORT가 지정되어있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to port %d', port);
});
