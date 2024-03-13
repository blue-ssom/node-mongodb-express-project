// 게시글과 관련된 API

const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');

// 게시글 조회
router.get('/all', async (req, res) => {
    try {
        // 예외처리 - 세션

        // 게시글 조회
        const posts = await client.db("notification_system").collection("post").find().sort({ createdAt: -1 }).toArray();

        // main.hbs 템플릿에 게시글 데이터 전달하여 렌더링
        res.render('main', { posts: posts });

    } catch (err) {
        console.log(err)
        // result.message = err.message
    } finally {
        // if(client) client.close()
        //res.send(result)
    }
    
});

// 해당 게시글 조회
router.get('/:postId', async (req, res) => {
    try {
        // 예외처리 - 세션
        
        // ObjectId 생성
        const postId = req.params.postId;
        console.log("postId:",postId)

        // 게시물 조회
        const post = await client.db("notification_system").collection("post").findOne({ _id: new ObjectId(postId) });
        console.log(post)
        if (!post) {
            throw new Error("존재하는 게시글이 없습니다.");
        } 
        
        // post.hbs 템플릿에 해당 게시글 데이터 전달하여 렌더링
        res.render('post', { post: post });

    } catch (err) {
        console.log(err)
    } finally {
        // if(client) client.close()
        //res.send(result)
    }
});

module.exports = router;
