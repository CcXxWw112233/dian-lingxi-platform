import React from 'react';
import { Card } from 'antd'
import NewsListStyle from './NewsList.less'
import QueueAnim from  'rc-queue-anim'


export default class NewsList extends React.Component {
  render() {
    return (
      <div className={NewsListStyle.out}>
         这是动态列表
      </div>
    )
  }
}




