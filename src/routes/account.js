// 계정과 관련된 API

const express = require('express');
const router = express.Router();
const client = require('../../database/db');
const { ObjectId } = require('mongodb');

router.get('/my', async (req, res) => {
    try {
        // 현재 세션에서 사용자 ID를 가져옴
        const userId = req.session.userId;
        // 사용자 ID를 사용하여 사용자 정보를 찾음
        const user = await client.db("notification_system").collection("account").findOne({ _id: new ObjectId(userId) });
        // 사용자 정보를 개인 정보 페이지에 렌더링
        res.render('profile', { user: user });
    } catch (err) {
        console.error(err);
        // 에러 처리
    }
});

module.exports = router
