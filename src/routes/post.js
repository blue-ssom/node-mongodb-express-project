// 게시글과 관련된 API
const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');

// 게시글+댓글 전체 조회
router.get('/all', async (req, res) => {
    const sessionUserIdx = req.session.userIdx;
    console.log("게시글 전체 조회 세션:", sessionUserIdx);

    try {
        // 예외처리 - 세션

        // 게시글 조회
        const posts = await client.db("notification_system").collection("post").find().sort({ createdAt: -1 }).toArray();
        
        // 각 게시글에 대한 댓글 조회
        for (const post of posts) {
            const comments = await client.db("notification_system").collection("post_comment").find({ post_id: post._id.toString() }).toArray();
            post.comments = comments;
        }

        // main.hbs 템플릿에 게시글 데이터 전달하여 렌더링
        res.render('main', { posts: posts, currentUser: sessionUserIdx });

    } catch (err) {
        console.log(err)
    }
});

// 해당 게시글 조회
router.get('/:postId', async (req, res) => {
    const postId = req.params.postId;
    try {
        // 예외처리 - 세션
        
        // 게시물 조회
        const post = await client.db("notification_system").collection("post").findOne({ _id: new ObjectId(postId) });

        // 해당 게시글에 대한 댓글 조회
        const comments = await client.db("notification_system").collection("post_comment").find({ post_id: postId }).toArray();

        // 게시글이 존재하지 않으면 /post/all로 이동하도록 수정
        if (!post) {
            throw new Error("존재하는 게시글이 없습니다.");
        } 
        
        // post.hbs 템플릿에 해당 게시글 데이터 전달하여 렌더링
        res.render('post', { post: post, comments: comments  });

    } catch (err) {
        console.log(err)
        res.redirect('/post/all'); // 에러 발생 시 /post/all로 리디렉션
    } finally {
        // if(client) client.close()
        //res.send(result)
    }
});

// 댓글 저장하기
router.post('/comment', async (req, res) => {
    const { postId, comment } = req.body;
    const sessionUser = req.session.userIdx; // 세션에 저장된 사용자 _id
    const sessionUserId = req.session.userId; // 세션에 저장된 사용자 id

    console.log("댓글 저장하기 세션: ", sessionUser)
    console.log("댓글 저장하기 세션: ", sessionUserId)
    try {
        // 예외처리 - 세션

        // 해당 게시글 찾기
        const post = await client.db("notification_system").collection("post").findOne({ _id: new ObjectId(postId) });
        if (!post) {
            throw new Error("존재하는 게시글이 없습니다.");
        }

        // post_comment 컬렉션에 댓글 추가
        await client.db("notification_system").collection("post_comment").insertOne({ 
            post_id: postId, 
            message: comment, // 댓글 내용을 message로 저장
            user:{
                _id: sessionUser, // 댓글 작성자의 사용자 ID를 user_id로 저장
                id: sessionUserId
            }
        });

        const postAuthorId = post.author._id.toString(); // 해당 게시글의 작성자의 _id

        // 자신이 작성한 게시글에 댓글을 작성한 경우 알림을 추가하지 않음
        if ( sessionUser !== postAuthorId) {
            // 알림 추가
            await client.db("notification_system").collection("notification").insertOne({
                message: `${sessionUserId}님이 게시글에 댓글을 작성했습니다.`,
                user: {
                    _id : postAuthorId,
                    id : post.author.id
                },
                post_id: postId,
                createdAt: new Date(),
                type: "comment"
            });
        }

        
    } catch (err) {
        console.log(err)
    } finally {
        // 게시물 페이지로 리다이렉션
        res.redirect(`/post/all`);
    }
});

module.exports = router;
