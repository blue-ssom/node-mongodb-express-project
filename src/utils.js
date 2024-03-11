const router = require("express").Router() // express 안에 있는 Router만 import

function checkRequiredField(value, fieldName) {
    if (value === null || value === undefined || value === "") {
        if(fieldName === '이름' || fieldName === '이메일'){
            throw new Error(`${fieldName}을 입력해주세요.`)
        }
        else {
            throw new Error(`${fieldName}를 입력해주세요.`)
        }
    }   
}
module.exports = {
    checkRequiredField
}