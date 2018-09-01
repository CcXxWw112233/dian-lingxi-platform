import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, Button, DatePicker, Menu } from 'antd'

const DCMenuItemOne = (props) => {
  const { execusorList } = props
  const handleMenuIconDelete = (key) =>{
    execusorList.splice(key,1)
    props.setList(execusorList)
  }
  const handleMenuReallyClick = (key) => {
    props.chirldrenTaskChargeChange()
  }
  return (
    <div className={DrawerContentStyles.menuOneout}>
      <div className={DrawerContentStyles.menuOne}>
        <div style={{width: 160, height: 42, margin: '0 auto'}}>
          <Input placeholder={'请输入负责人名称'}  style={{width: 160, marginTop: 6}}/>
        </div>
        {execusorList.map((value, key) => {
          return(
            <div style={{position: 'relative'}} key={key}  >
              <div  style={{padding:0,margin: 0, height: 32}} onClick={()=>{handleMenuReallyClick(value.user_id)}}>
                <div className={DrawerContentStyles.menuOneitemDiv} >
                  {value.img?(
                    <img src={value.img} className={DrawerContentStyles.avatar} />
                  ):(
                    <div style={{height:20,width: 20,borderRadius:20,backgroundColor:'#f2f2f2',textAlign: 'center'}}>
                      <Icon type={'user'} style={{fontSize:12, color: '#8c8c8c', marginTop: 4,display: 'block'}}/>
                    </div>
                  )}
                  <span >{value.full_name}</span>
                </div>
              </div>
              <Icon type="close-circle" style={{fontSize: 14,marginLeft: 8,position: 'absolute', right: 10, top: 9}} onClick={()=>{handleMenuIconDelete({key,user_id: value.user_id})}}/>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DCMenuItemOne
