import Post from '../../models/post'
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const checkObjectId = (ctx, next) => {
    const { id } = ctx.params;
    if (!ObjectId.isValid(id)) {
        ctx.status = 400; //bad request
        return;
    }
    return next();
};

//데이터생성
/*
POST /api/posts
{
    title: '제목',
    body: '내용',
    tags: ['태그1', '태그2']
}
*/
export const write = async ctx => {
    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string().required(), //required()가 있으면 필수항목
        body: Joi.string().required(),
        tags: Joi.array()
            .items(Joi.string())
            .required(), //문자열로 이루어진 배열
    });

    //검증하고 나서 검증 실패인 경우 에러처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400; //bad request
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};
//데이터조회
/*
GET /api/posts
*/
export const list = async ctx => {
    //query는 문자열이기에 숫자로 변환해줘야댐. 값이 주어지지 않았다면 1을 기본으로 사용
    const page = parseInt(ctx.query.page || '1', 10);

    if (page < 1) {
        ctx.status = 400;
        return;
    }
    try {
        const posts = await Post.find()
            .sort({ _id: -1 })
            .limit(10)
            .skip((page - 1) * 10)
            .lean()
            .exec();
        const postCount = await Post.countDocuments().exec();
        ctx.set('Last-Page', Math.ceil(postCount / 10));
        ctx.body = posts.map(post => ({
            ...post,
            body:
                post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
        }));
    } catch (e) {
        ctx.throw(500, e);
    }
};

//특정 포스트 조회
/*
GET /api/posts/:id
*/
export const read = async ctx => {
    const { id } = ctx.params;
    try {
        const post = await Post.findById(id).exec();
        if (!post) {
            ctx.status = 404; //not found
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};

//데이터삭제
/*
DELETE /api/posts/:id
*/
export const remove = async ctx => {
    const { id } = ctx.params;
    try {
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204; // no content(성공하긴 했지만 응답할 데이터 없음)
    } catch (e) {
        ctx.throw(500, e);
    }
};

//데이터수정
/*
PATCH /api/posts/:id
{
    title: '수정',
    body: '수정내용',
    tags: ['수정','태그']
}
*/
export const update = async ctx => {
    const { id } = ctx.params;
    // write에서 사용한 schema와 비슷한데 require()가 없음
    const schema = Joi.object().keys({
        //객체가 다음 필드를 가지고 있음을 검증
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array()
            .items(Joi.string()), //문자열로 이루어진 배열
    });

    //검증하고 나서 검증 실패인 경우 에러처리
    const result = schema.validate(ctx.request.body);
    if (result.error) {
        ctx.status = 400; //bad request
        ctx.body = result.error;
        return;
    }
    try {
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new: true, //이 값을 설정하면 업뎃 된 데이터를 반환, false일 때는 업뎃전 데이터 반환
        }).exec();
        if (!post) {
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch (e) {
        ctx.throw(500, e);
    }
};

