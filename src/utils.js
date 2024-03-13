const router = require("express").Router() // express 안에 있는 Router만 import

function checkRequiredField(value, fieldName) {
    // 값이 null, undefined, 빈 문자열인지 확인
    if (value === null || value === undefined || value === "") {
            throw new Error(`${fieldName}를 입력해주세요.`)
    }

    // 정규식을 이용하여 문자열이 숫자와 문자로만 구성되어 있는지 확인
    const regex = /^[a-zA-Z0-9]+$/;
    if (!regex.test(value)) {
        throw new Error(`${fieldName}는 문자로만 이루어져야 합니다.`);
    }

    // 최소 길이 검사
    if (value.length < 4) {
        throw new Error(`${fieldName}는 최소 4글자여야 합니다.`);
    }

    // 최대 길이 검사
    if (value.length > 8) {
        throw new Error(`${fieldName}는 최대 8글자를 초과할 수 없습니다.`);
    }
}

module.exports = {
    checkRequiredField
}