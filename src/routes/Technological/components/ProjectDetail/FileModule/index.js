import React from 'react'
import indexStyles from './index.less'
import { Table, Button } from 'antd';
import FileList from './FileList'

const data = [];
for (let i = 0; i < 10; i++) {
  data.push({
    id: i+5,
    name: `Edward King ${20 + 10 * Math.random()}`,
    size:`${20+i}${i % 2 === 0 ? 'MB' : 'G' }` ,
    updateTime: '2011-01-01 14:00',
    founder: ` ${20 + 10 * Math.random()}`,
  });
}
export default class FileIndex extends React.Component {

  render() {
    return (
      <div className={indexStyles.fileOut}>
        <FileList dataSource={data} />
      </div>
    )
  }
}
