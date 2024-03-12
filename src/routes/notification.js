// routes/notification.js

const express = require('express');
const router = express.Router();
const client = require('../../database/db');

router.get('/', async (req, res) => {
    try {
        // 알림 조회
        const notifications = await client.db("notification_system").collection("notification").find().toArray();

        // notification.hbs 템플릿에 알림 데이터 전달하여 렌더링
        res.render('notification', { notifications: notifications });

    } catch (err) {
        console.log(err)
    }
    finally{

    }
});

module.exports = router;
