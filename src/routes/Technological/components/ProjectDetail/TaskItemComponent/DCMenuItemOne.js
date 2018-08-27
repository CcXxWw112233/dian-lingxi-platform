import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, Button, DatePicker, Menu } from 'antd'

const DCMenuItemOne = (props) => {
  const { List } = props
  const handleMenuIconDelete = (key) =>{
    console.log(1,key)
    List.splice(key,1)
    console.log(List)
    props.setList(List)
  }
  const handleMenuReallyClick = (key) => {
    console.log(2,key)
    props.chirldrenTaskChargeChange()
  }
  return (
    <div  className={DrawerContentStyles.menuOneout}>
      <div className={DrawerContentStyles.menuOne}>
        <div style={{width: 160, height: 42, margin: '0 auto'}}>
          <Input placeholder={'请输入负责人名称'}  style={{width: 160, marginTop: 6}}/>
        </div>
        {List.map((value, key) => {
          return(
            <div style={{position: 'relative'}} key={key}  >
              <div  style={{padding:0,margin: 0, height: 32}} onClick={()=>{handleMenuReallyClick(key)}}>
                <div className={DrawerContentStyles.menuOneitemDiv} >
                  <img src="" className={DrawerContentStyles.avatar} />
                  <span >{value}</span>
                </div>
              </div>
              <Icon type="close-circle" style={{fontSize: 14,marginLeft: 8,position: 'absolute', right: 10, top: 9}} onClick={()=>{handleMenuIconDelete(key)}}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DCMenuItemOne
