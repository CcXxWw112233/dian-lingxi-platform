import React from 'react'
import indexStyles from './index.less'
import { Table, Button } from 'antd';
import FileList from './FileList'
import MoveToDirectory from './MoveToDirectory'


export default class FileIndex extends React.Component {

  render() {
    return (
      <div className={indexStyles.fileOut}>
        <FileList {...this.props} />
        <MoveToDirectory {...this.props} />
      </div>
    )
  }
}
