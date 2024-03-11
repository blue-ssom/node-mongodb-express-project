// 로그인 API
const express = require("express")
const router = require("express").Router() // express 안에 있는 Router만 import
const client = require('../../database/db') // MongoDB연결
const utils = require('../utils');

router.get('/', (req, res) => {
    res.render('login');
});

router.post("/", async(req,res) => {
    const { id, password } = req.body
    const result = {
        "success": false,
        "message": "",
        "data" : null
    }
    console.log("Received ID:", id);
    console.log("Received Password:", password);

    try{
        // 예외처리
        utils.checkRequiredField(id, "아이디")
        utils.checkRequiredField(password, "비밀번호")

        const data = await client.db("notification_system").collection("account").findOne({ id, password })

        if (!data) {
            throw new Error("아이디 또는 비밀번호가 잘못되었습니다.")
        }

         // 세션에 사용자의 _id 저장
        req.session.userId = data._id;

        result.success = true;
        result.message = "로그인 성공!";
        result.data = data;

    } catch (err) {
        console.log(err)
        result.message = err.message
    } finally {
        if(client) client.close()
        res.send(result)
    }
})

module.exports = router