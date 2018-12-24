import React from 'react'
import EditCardDropStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip, Card,Input, Checkbox } from 'antd'
import CardContentNormal from './CardContentNormal'

export default class EditCardDrop extends React.Component {

  render() {
    return (
      <div className={EditCardDropStyle.edit_cardd_dropdown}>
        <div className={EditCardDropStyle.card_set_item}>
          <div className={EditCardDropStyle.card_set_item_top}>
            <div className={EditCardDropStyle.check}>
              <Checkbox />
            </div>
            <div className={EditCardDropStyle.name}>你麻痹啊你麻痹啊你麻痹啊你麻痹啊你麻痹啊你麻痹啊你麻痹啊</div>
            <div className={EditCardDropStyle.turn}>
              <Icon type="down" />
            </div>
          </div>
          <div className={EditCardDropStyle.card_set_item_bott}>
             <CardContentNormal {...this.props} />
          </div>
        </div>
      </div>
    )
  }
}
