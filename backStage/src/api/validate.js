//数字，字母的密码
export function isPassword(str) {
    const reg = /^[0-9a-zA-Z]+$/;
    return reg.test(str.trim());
}