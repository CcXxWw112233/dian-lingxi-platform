import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, Button, DatePicker, Dropdown, Menu } from 'antd'
import DCMenuItemOne from './DCMenuItemOne'
import DCAddChirdrenTaskItem from './DCAddChirdrenTaskItem'
import { deepClone } from '../../../../../utils/util'
const TextArea = Input.TextArea

export default class DCAddChirdrenTask extends React.Component{
  state = {
    isSelectUserIcon: false, // default '#8c8c8c, hover #595959
    isSelectCalendarIcon: false,
    isShowUserCalendar: false,
    List: [1,2,3,4],
    due_time: '', //日期选择后的日期‘2018-08-07’
    name: '',
    chargeMan: '', //子任务负责人
  }
  datePickerChange(date, dateString) {
    this.setState({
      due_time: dateString,
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
  addChirldTask() {
    const { datas:{ drawContent = {}, projectDetailInfoData = {} } } = this.props.model
    const { card_id, child_data = [] } = drawContent
    const { board_id } = projectDetailInfoData
    const  obj = {
      card_id,
      board_id,
      name: this.state.name,
      users: '',
      due_time: this.state.dateString,
      card_name: this.state.name,
      taskGroupListIndex: this.props.model.datas.taskGroupListIndex,
      taskGroupListIndex_index: this.props.model.datas.taskGroupListIndex_index
    }
    drawContent['child_data'].push(obj)
    this.props.updateDatas({drawContent})
    this.props.addChirldTask(obj)
    this.setState({
      isShowUserCalendar: false
    })
  }

  //子任务名称设置
  setchirldTaskNameChange(e) {
    this.setState({
      name: e.target.value
    })
  }

  addInputFocus() {
    this.setState({
      isShowUserCalendar: true
    })
  }

  render() {
    const { isSelectUserIcon, isSelectCalendarIcon, List, isShowUserCalendar } = this.state
    const { datas:{ drawContent = {}, projectDetailInfoData = {} } } = this.props.model
    let { card_id, card_name, child_data = [], start_time, due_time, description, label_data = [] } = drawContent

    return(
      <div className={DrawerContentStyles.divContent_1}>
        {child_data.map((value, key) => {
          return (
            <DCAddChirdrenTaskItem chirldTaskItemValue ={value} key={key} />
          )
        })}
        <div className={DrawerContentStyles.contain_7}>
          <div style={{width: '100%'}}>
            <div className={DrawerContentStyles.contain_7_add}>
              <div>
                <Icon type="plus" style={{marginRight: 4}}/>
                <input onFocus={this.addInputFocus.bind(this)} placeholder={'子任务'} onChange={this.setchirldTaskNameChange.bind(this)}/>
              </div>
              <div style={{display: isShowUserCalendar ? 'block':'block'}}>
                <Dropdown overlay={<DCMenuItemOne List={List} setList={this.setList.bind(this)} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                  <Icon type="user" style={{fontSize: 16,margin:'0 12px',cursor: 'pointer'}} className={!isSelectUserIcon ? DrawerContentStyles.userIconNormal: DrawerContentStyles.userIconSelected}/>
                </Dropdown>
                <Icon type="calendar" style={{fontSize: 16, marginRight: 12 ,cursor: 'pointer'}} className={!isSelectCalendarIcon?DrawerContentStyles.calendarIconNormal:DrawerContentStyles.calendarIconSelected}/>
                <DatePicker onChange={this.datePickerChange.bind(this)} placeholder={'选择截止日期'} style={{opacity: 0, width: 16,background: '#000000',position: 'absolute',right: 114,zIndex:2}} />
                <Button onClick={this.addChirldTask.bind(this)} type={'primary'} style={{width: 40, height: 20,padding: '0 5px',fontSize: 12,}}>保存</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
