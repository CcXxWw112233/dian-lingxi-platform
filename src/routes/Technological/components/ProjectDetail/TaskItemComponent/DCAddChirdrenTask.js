import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, Button, DatePicker, Dropdown, Menu } from 'antd'
import DCMenuItemOne from './DCMenuItemOne'
import DCAddChirdrenTaskItem from './DCAddChirdrenTaskItem'
const TextArea = Input.TextArea

export default class DCAddChirdrenTask extends React.Component{
  state = {
    isSelectUserIcon: false, // default '#8c8c8c, hover #595959
    isSelectCalendarIcon: false,
    List: ['子任务子任务子任务子任务子任务子任务',2,3,4]
  }
  datePickerChange(date, dateString) {
    console.log( dateString);
    this.setState({
      isSelectCalendarIcon: true
    })
  }
  //设置子任务负责人组件---------------start
  setList(arr) {
    this.setState({
      List: arr
    })
  }
  chirldrenTaskChargeChange() {
    this.setState({
      isSelectUserIcon: true
    })
  }
  //设置子任务负责人组件---------------end

  render() {
    const { isSelectUserIcon, isSelectCalendarIcon, List } = this.state

    return(

      <div className={DrawerContentStyles.divContent_1}>
        <DCAddChirdrenTaskItem />
        <div className={DrawerContentStyles.contain_7}>
          <div style={{width: '100%'}}>
            <div className={DrawerContentStyles.contain_7_add}>
              <div>
                <Icon type="plus" style={{marginRight: 4}}/>
                <input  placeholder={'子任务'} />
              </div>
              <div>
                <Dropdown overlay={<DCMenuItemOne List={List} setList={this.setList.bind(this)} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                  <Icon type="user" style={{fontSize: 16,margin:'0 12px',cursor: 'pointer'}} className={!isSelectUserIcon ? DrawerContentStyles.userIconNormal: DrawerContentStyles.userIconSelected}/>
                </Dropdown>
                <Icon type="calendar" style={{fontSize: 16, marginRight: 12 ,cursor: 'pointer'}} className={!isSelectCalendarIcon?DrawerContentStyles.calendarIconNormal:DrawerContentStyles.calendarIconSelected}/>
                <DatePicker onChange={this.datePickerChange.bind(this)} style={{opacity: 0, width: 16,background: '000000',position: 'absolute',right: 90,zIndex:2}} />
                <Button type={'primary'} style={{width: 40, height: 20,padding: '0 5px',fontSize: 12,}}>保存</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
