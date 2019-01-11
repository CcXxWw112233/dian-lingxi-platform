
import React from 'react'
import indexStyles from './index.less'
import { Table, Button, Menu, Dropdown, Icon, Input } from 'antd';
import Header from './Header'
import FileDetailContent from "./FileDetailContent";

const bodyHeight = document.querySelector('body').clientHeight
export default class FileDetail extends React.Component {
  state = {
    clientHeight: document.documentElement.clientHeight,
  }
  constructor() {
    super();
    this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY.bind(this,'ing'))
  }

  resizeTTY(type) {
    const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
    this.setState({
      clientHeight
    })
  }

  render() {
    const { clientHeight } = this.state
    return (
      <div className={indexStyles.fileDetailOut} style={{height: clientHeight, top: 0}}>
        <Header {...this.props}/>
        <FileDetailContent {...this.props} clientHeight={clientHeight}/>
      </div>
    )
  }
}
