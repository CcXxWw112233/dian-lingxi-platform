import React from 'react'
import EditCardDropStyle from './index.less'
import { Icon, Menu, Dropdown, Tooltip, Card,Input, Checkbox } from 'antd'
import CardContentNormal from './CardContentNormal'
import EditCardDropItem from './EditCardDropItem'

export default class EditCardDrop extends React.Component {
  render() {
    return (
      <div className={EditCardDropStyle.edit_cardd_dropdown}>
        <div className={EditCardDropStyle.edit_cardd_dropdown_left}>
          {[1,2,3].map((value, key) => {
            return (
              <EditCardDropItem {...this.props} key={key}/>
            )
          })}
        </div>
        <div className={EditCardDropStyle.edit_cardd_dropdown_right}>
          {[1,2,3].map((value, key) => {
            return (
              <EditCardDropItem {...this.props} key={key}/>
            )
          })}
        </div>
      </div>
    )
  }
}
