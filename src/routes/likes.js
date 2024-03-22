// 좋아요 기능과 관련된 API

const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');

router.post('/:postId', async (req, res) => {
    const postId = req.params.postId;
    const sessionUser = req.session.userIdx; // 세션에 저장된 사용자 _id
    const sessionUserId = req.session.userId; // 세션에 저장된 사용자 id
    console.log("좋아요 세션_id", sessionUser)
    console.log("좋아요 세션 id", sessionUserId)



    try {
        
        // 예외처리 - 세션
        // if (!sessionUserId) {
        //   throw new Error("잘못된 접근입니다.")   // 세션이 없는 경우
        // } 

        // 해당 게시글 좋아요 여부 조회
        const post = await client.db("notification_system").collection("post_likes").findOne({ post_id: postId, 'user._id': sessionUser});
        console.log("게시글 존재?", post)

        if(!post){
            // 디버깅
            console.log("1")

            // postLikes에 기록이 없다면 기록 추가
            await client.db("notification_system").collection("post_likes").insertOne({ 
                post_id: postId,
                user:{
                    _id: sessionUser, 
                    id:sessionUserId
                },
            });
            // 해당 post의 likes +1
            await client.db("notification_system").collection("post").updateOne({ _id: new ObjectId(postId) }, { $inc: { likes: 1 } });

            // 해당 게시물의 작성자의 사용자 ID를 가져오기
            const postAuthor = await client.db("notification_system").collection("post").findOne({ _id: new ObjectId(postId) });

            // 자신이 작성한 게시글에 좋아요 누른 경우 알림을 추가하지 않음
            if (sessionUser !== postAuthor.author._id.toString()) {
                // 해당 게시물의 작성자에게 알림을 추가
                const notificationMessage = `${sessionUserId}님이 회원님의 게시글을 좋아합니다.`;
                await client.db("notification_system").collection("notification").insertOne({
                    post_id: postId,
                    message: notificationMessage,
                    user: {
                        _id: postAuthor.author._id, // 작성자의 사용자 ID
                        id: postAuthor.author.id
                    },
                    createdAt: new Date(),
                    type: "like"
                });
            }
            } else {
            // 디버깅
            console.log("2")

            // postLikes에 기록이 있다면 기록 삭제
            await client.db("notification_system").collection("post_likes").deleteOne({ user:{_id : sessionUser, id : sessionUserId}, post_id: postId });
            await client.db("notification_system").collection("post").updateOne(
                { _id: new ObjectId(postId), likes: { $gt: 0 } }, // 해당 post의 likes가 0보다 큰 경우에만 likes를 -1 감소시킴
                { $inc: { likes: -1 } } // 해당 post의 likes -1
            );
        }
        

    } catch (err) {
        console.log(err)
    } finally {
        // if(client) client.close()
        //res.send(result)
    }
});

module.exports = router;
