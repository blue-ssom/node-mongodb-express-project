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
    }
    console.log("id:", id);
    console.log("password:", password);

    try{
        // 예외처리
        utils.checkRequiredField(id, "아이디")
        utils.checkRequiredField(password, "비밀번호")

        const data = await client.db("notification_system").collection("account").findOne({ id, password })

        if (!data) {
            throw new Error("아이디 또는 비밀번호가 잘못되었습니다.")
        }

        // 세션에 사용자의 _id 저장 - 문자열로 변환
        req.session.userIdx = data._id.toString();
        req.session.userId = data.id;

        console.log("세션 idx:", req.session.userIdx)
        console.log("세션 id:", req.session.userId)

        result.success = true;
        result.message = "로그인 성공!";
        result.data = data;

        // 로그인 성공 시 게시글 조회 페이지로 리다이렉트
        res.redirect("/post/all");
         
    } catch (err) {
        console.log(err)
        result.message = err.message
        res.send(result) // 에러가 발생한 경우 JSON 응답을 보내기
    }
})

module.exports = router
