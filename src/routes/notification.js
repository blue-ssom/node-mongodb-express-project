// 알림과 관련된 API

const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');


// 알림 조회
router.get('/', async (req, res) => {
    // 세션에서 현재 사용자의 ID 가져오기
    const sessionUserIdx = req.session.userIdx;
    const sessionUserId = req.session.userId;
    console.log("알림 조회에서 세션", sessionUserIdx)

    try {

        // 예외처리 - 세션
        
        // Aggregation Framework를 사용하여 알림 데이터 필터링 및 조인
        const notifications = await client.db("notification_system").collection("notification").aggregate([
            // $match stage를 사용하여 type이 post이거나 type이 like이면서 user._id가 세션와 같은 알림을 필터링
            {
                $match: {
                    $or: [
                        { type: 'post' },
                        { type: 'like', "user._id": new ObjectId(sessionUserIdx) },
                        { type: 'comment', "user._id": sessionUserIdx }

                    ]
                }
            },
        ]).sort({ createdAt: -1 }).toArray();

        // notification.hbs 템플릿에 알림 데이터 전달하여 렌더링
        res.render('notification', { notifications: notifications });

    } catch (err) {
        console.log(err)
    }
});

module.exports = router;
