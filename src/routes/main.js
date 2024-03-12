// 게시글 가져오는 API

const express = require("express")
const router = require("express").Router() // express 안에 있는 Router만 import
const client = require('../../database/db') // MongoDB연결
const utils = require('../utils');

// MongoDB 연결 상태 확인
const isConnected = client !== null && client !== undefined;

router.get('/', async (req, res) => {
    try {
        // 예외처리 - 세션

        // MongoDB에 연결되어 있는지 확인
        if (!isConnected) {
            throw new Error('MongoDB에 연결되어 있지 않습니다.');
        }

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

module.exports = router;
