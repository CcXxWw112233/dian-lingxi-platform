
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input } from 'antd';
import Header from './Header'
import FileDetailContent from "./FileDetailContent";

const bodyHeight = document.querySelector('body').clientHeight
export default class FileDetail extends React.Component {
  state = {}

  render() {
    return (
      <div className={indexStyles.fileDetailOut} style={{height: bodyHeight, top: 0}}>
        <Header {...this.props}/>
        <FileDetailContent {...this.props}/>
      </div>
    )
  }
}
