// express.js import하기
const express = require("express")
const session = require('express-session');
const dotenv = require('dotenv').config(); // dotenv 패키지를 사용하여 환경 변수 로드
const client = require("./database/db")  // mariaDB연결

const app = express()
const port = 8000

// 우리가 통신에서는 json으로 값을 주고 받긴 함
// json은 원래 통신에 사용할 수 없는 자료구조임
// json은 string으로 변환해서 보내고, 받는 쪽은 이걸 json으로 변화해서 사용함
app.use(express.json())

// 세션 설정
app.use(session({
    secret: 'secret-key',       
    resave: false,              
    saveUninitialized: true,    
    cookie: { maxAge: 1800000 } 
}))

// Web Server 실행 코드
app.listen(port, () => {
    console.log(`${port}번에서 HTTP Web Server 실행`)
})