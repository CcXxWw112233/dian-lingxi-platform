import React from 'react'
import styles from './index.less'

// 需要在挂载该组件的父元素设置position: relative, padding-right: 4
export default function index(props) {
  const { show_dot, top = 0, right = 0 } = props
  return (
    <div
      className={styles.badgedot}
      style={{ display: show_dot ? 'block' : 'none', top, right }}
    ></div>
  )
}
