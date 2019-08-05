// 动态列表
import React, { Component } from 'react'
import DrawDetailInfoStyle from '../DrawDetailInfo.less'

export default class DynamicContain extends Component {
  render() {
    return (
      <ul>
        <li>
          <div className={DrawDetailInfoStyle.left}>
            <img />
          </div>
          <div className={DrawDetailInfoStyle.right}>
            <div className={DrawDetailInfoStyle.news_text}>
              xxx 修改了原项目名 「xxx」为「xxx」名称。
            </div>
            <div className={DrawDetailInfoStyle.news_time}>xxxx时间</div>
          </div>
        </li>
      </ul>
    )
  }
}
