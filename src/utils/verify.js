// 验证手机号
export const validateTel = (value) => {
  return (/^[1][3-8]\d{9}/.test(value))
}
// 验证邮箱
export const validateEmail = (value) => {
  return (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(value))
}
// 验证密码 正则匹配用户密码8-32位数字和字母的组合
export const validatePassword = (value) => {
  return (/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,32}/.test(value))
}
