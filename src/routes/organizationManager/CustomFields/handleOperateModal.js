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