// express.js import하기
const express = require("express")
const session = require('express-session');
const dotenv = require('dotenv').config(); // dotenv 패키지를 사용하여 환경 변수 로드
const client = require("./database/db")  // mongoDB연결
const hbs  = require('hbs'); // hbs 패키지 사용

const app = express()
const port = 8000

// 우리가 통신에서는 json으로 값을 주고 받긴 함
// json은 원래 통신에 사용할 수 없는 자료구조임
// json은 string으로 변환해서 보내고, 받는 쪽은 이걸 json으로 변화해서 사용함
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
    secret: 'secret-key',       
    resave: false,              
    saveUninitialized: true,    
    cookie: { maxAge: 1800000 } 
}))


// 템플릿 디렉토리 설정
app.set('views', __dirname + '/views');
// hbs 확장자 설정
app.set('view engine', 'hbs');


const loginRouter = require('./src/routes/index');  // index.js파일 import
app.use('/login', loginRouter);

const accountRouter = require('./src/routes/account');  // account.js파일 import
app.use('/account',accountRouter);

const likesRouter = require('./src/routes/likes');  // likes.js파일 import
app.use('/likes',likesRouter);

const postRouter = require('./src/routes/post');  // post.js파일 import
app.use('/post', postRouter);

const notificationRouter = require('./src/routes/notification');  // notification.js파일 import
app.use('/notification', notificationRouter);


// Web Server 실행 코드
app.listen(port, () => {
    console.log(`${port}번에서 HTTP Web Server 실행`)
})