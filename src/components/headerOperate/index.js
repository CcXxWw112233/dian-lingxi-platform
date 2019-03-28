import React from 'react'
import {
  Icon,
  Menu,
  Dropdown,
  Button
} from 'antd'


export default ({dataSource, item, disabledEnd, disabledDel}) => {
  let dis 
  let menu = (
    <Menu>
      {
        dataSource.reduce((r, c, i) => {
          return [
            ...r,
            (
              c.content === '终止流程'?
              <Menu.Item disabled={disabledEnd}>
                <div 
                  key = {`key${i}`} 
                  onClick = {c.click} 
                  style = {{
                    cursor: 'pointer', 
                    textAlign: 'center', 
                    height: '38px', 
                    lineHeight: '38px'
                  }}
                >
                  {
                    c.content === '移入回收站'?[<Icon style={{marginRight: '5px'}} type='delete' />,c.content]:c.content
                  }
                </div>
              </Menu.Item>:
              <Menu.Item disabled={disabledDel}>
              <div 
                key = {`key${i}`} 
                onClick = {c.click} 
                style = {{
                  cursor: 'pointer', 
                  textAlign: 'center', 
                  height: '38px', 
                  lineHeight: '38px'
                }}
              >
                {
                  c.content === '移入回收站'?[<Icon style={{marginRight: '5px'}} type='delete' />,c.content]:c.content
                }
              </div>
            </Menu.Item>
            )
          ]
        }, [])
      }
    </Menu>
  )
  
  return (
    <Dropdown overlay = {menu} trigger = {['click']}>
      {item}
    </Dropdown>
  )
}