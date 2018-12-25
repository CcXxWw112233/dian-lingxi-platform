import React from 'react'
import EditCardDropStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip, Card,Input, Checkbox } from 'antd'
import CardContentNormal from './CardContentNormal'

export default class EditCardDropItem extends React.Component {
  state ={
    bottVisible: '1', //1默认 2展开 3关闭
  }
  setBottVisible(state) {
    const { bottVisible } = this.state

    this.setState({
      bottVisible: bottVisible === '1'? '2':( bottVisible==='2'?'3':'2')
    })

  }
  render() {
    const { bottVisible } = this.state

    return (
      <div  className={`${EditCardDropStyle.card_set_item} ${bottVisible !== '1' ? (bottVisible === '2' ? EditCardDropStyle.showBott2 : EditCardDropStyle.hideBott2): EditCardDropStyle.hideinit}`}>
        <div className={EditCardDropStyle.card_set_item_top}>
          <div className={EditCardDropStyle.check}>
            <Checkbox />
          </div>
          <div className={EditCardDropStyle.name}>卡片名词</div>
          <div  className={`${EditCardDropStyle.turn} ${bottVisible!=='1'?(bottVisible === '2'?EditCardDropStyle.upDown_up: EditCardDropStyle.upDown_down): ''}`}>
            <Icon type="down"  onClick={this.setBottVisible.bind(this)} />
          </div>
        </div>
        <div className={`${EditCardDropStyle.card_set_item_bott} ${bottVisible !== '1' ? (bottVisible === '2' ? EditCardDropStyle.showBott : EditCardDropStyle.hideBott) : EditCardDropStyle.noDoc}`} >
          <CardContentNormal {...this.props} />
        </div>
      </div>

    )
  }
}
