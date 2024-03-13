const router = require("express").Router() // express 안에 있는 Router만 import

function checkRequiredField(value, fieldName) {
    // 값이 null, undefined, 빈 문자열인지 확인
    if (value === null || value === undefined || value === "") {
            throw new Error(`${fieldName}를 입력해주세요.`)
    }
}

module.exports = {
    checkRequiredField
}