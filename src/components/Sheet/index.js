import React from 'react'
import styles from './index.less'
import { Modal, Button } from 'antd'
import Sheet from './components/Sheet'
import DEvent, { PREVIEWTABLE } from '../../utils/event'
export default class EditSheet extends React.Component {
  constructor() {
    super(...arguments)
    this.state = {
      visible: false
    }
    this.el = null
    DEvent.on(PREVIEWTABLE, this.openSheet)
  }
  openSheet = () => {
    let { visible } = this.state
    this.setState(
      {
        visible: !visible
      },
      () => {
        this.el && this.el.reload(this.props.data || [])
      }
    )
  }
  close = () => {
    this.setPropsData()
    this.setState({
      visible: false
    })
  }
  setPropsData = () => {
    let { onMessage = () => {} } = this.props
    onMessage(this.el.getFormatData())
  }
  render() {
    const { visible } = this.state
    return (
      <div style={{ display: 'inline-block' }}>
        <Button type="primary" onClick={this.openSheet}>
          <span className="iconfont" style={{ marginRight: 5 }}>
            &#xe7e1;
          </span>
          表格编辑
        </Button>
        {visible && <Sheet ref={el => (this.el = el)} onClose={this.close} />}
      </div>
    )
  }
}
