// 事件封装
export const categoryIcon = (code) => {
  let icon = (<span></span>)
  switch (code) {
    case 'radio':
      icon = <span>&#xe6af;</span>
      break;
    case 'checkbox':
      icon = <span>&#xe6b2;</span>
      break
    default:
      break;
  }
  return icon
}

// 字段引用详情
export const fieldsQuoteDetail = (type) => {
  let icon = (<span></span>)
  switch (type) {
    case '1':
      
      break;
  
    default:
      break;
  }
}