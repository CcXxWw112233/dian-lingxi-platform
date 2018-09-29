import React from 'react'
import MenuSearchStyles from './MenuSearch.less'
import { Icon, Input, Button, DatePicker, Menu } from 'antd'

const MenuSearchMultiple = (props) => {
  const { usersArray = [] } = props

  const menuDeselect = ({ item, key, selectedKeys }) => {
    props.setAssignees && props.setAssignees(selectedKeys)
  }
  const menuSelect = ({ item, key, selectedKeys }) => {
    props.setAssignees && props.setAssignees(selectedKeys)
  }
  return (
    <Menu multiple={!props.noMutiple} style={{padding: 8}} onDeselect={menuDeselect} onSelect={menuSelect}>
      <Input/>
      {
        usersArray.map((val, key) => {
          return (
            <Menu.Item style={{height: 32,lineHeight: '32px'}} key={key}>
              {val}
            </Menu.Item>
          )
        })
      }
    </Menu>
  )
}

export default MenuSearchMultiple

