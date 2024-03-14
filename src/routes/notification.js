// 알림과 관련된 API

const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');

// 알림 조회
router.get('/', async (req, res) => {
    try {
        const sessionUser = req.session.userId; // 세션에 저장된 사용자 _id
        console.log("알림 출력 기능 구현 세션: ", sessionUser)

        // 예외처리 - 세션
        
        //const notifications = await client.db("notification_system").collection("notification").find().sort({ createdAt: -1 }).toArray();
        //console.log(notifications)

        // notification.hbs 템플릿에 알림 데이터 전달하여 렌더링
        res.render('notification', { notifications: notifications });

    } catch (err) {
        console.log(err)
    }
    finally{

    }
});

module.exports = router;
