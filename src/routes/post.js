
// routes/post.js

const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');


router.get('/:postId', async (req, res) => {
    try {
        // ObjectId 생성
        const postId = req.params.postId;
        console.log("postId:",postId)

        // 게시물 조회
        const post = await client.db("notification_system").collection("post").findOne({ _id: new ObjectId(postId) });
        if (!post) {
            throw new Error("존재하는 게시글이 없습니다.");
        } 
        
        console.log(post)
        
        // 게시물을 HBS에 렌더링하여 클라이언트에 전송
        res.render('post', { post: post });

    } catch (err) {
        console.log(err)
    }
    finally{

    }
});

module.exports = router;
