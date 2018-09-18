import React from 'react'
import MenuSearchStyles from './MenuSearch.less'
import { Icon, Input, Button, DatePicker, Menu } from 'antd'

const MenuSearchMultiple = (props) => {
  const { menuSortList = [1,2,3] } = props

  const handleMenuReallyClick = (data) => {
    console.log(data)
    const { excutors = [] } = props

  }
  return (
    <Menu multiple style={{padding: 8}} onClick={handleMenuReallyClick}>
      <Input/>
      {
        menuSortList.map((val, key) => {
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

