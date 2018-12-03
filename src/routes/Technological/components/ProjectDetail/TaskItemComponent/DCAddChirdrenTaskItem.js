import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Input, Button, DatePicker, Dropdown, Menu, Avatar, Tooltip } from 'antd'
import DCMenuItemOne from './DCMenuItemOne'
import { timestampToTimeNormal, timeToTimestamp } from '../../../../../utils/util'

const TextArea = Input.TextArea

export default class DCAddChirdrenTaskItem extends React.Component{

  state = {
    isCheck: false
  }
  itemOneClick() {
    const { chirldTaskItemValue, chirldDataIndex } = this.props
    const {  datas:{ drawContent = {}, } } = this.props.model
    const { card_id, is_realize = '0' } = chirldTaskItemValue
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1'
    }
    drawContent['child_data'][chirldDataIndex]['is_realize'] = is_realize === '1' ? '0' : '1'
    this.props.updateDatas({drawContent})
    this.props.completeTask(obj)
  }
  //设置子任务负责人组件---------------start
  setList(id) {
    const { datas:{ projectDetailInfoData = {} } } = this.props.model
    const { board_id } = projectDetailInfoData
    this.props.removeProjectMenbers({board_id, user_id: id})
  }
  chirldrenTaskChargeChange({ user_id, full_name, avatar }) {
    const { datas:{ drawContent = {} } } = this.props.model
    const { chirldTaskItemValue } = this.props
    const { card_id, executors=[] } = chirldTaskItemValue
    executors[0] = {
      user_id,
      user_name: full_name,
      avatar: avatar
    }
    this.props.addTaskExecutor({
      card_id,
      users: user_id,
    })
  }
  datePickerChange(date, dateString) {
    if(!dateString) {
      return false
    }
    const { datas:{ drawContent = {} } } = this.props.model
    const { chirldTaskItemValue } = this.props
    const { card_id } = drawContent
    chirldTaskItemValue['due_time'] = timeToTimestamp(dateString)
    const updateObj = {
      card_id,
      due_time: dateString
    }
    this.props.updateTask({updateObj})
  }

  render() {
    const { chirldTaskItemValue, chirldDataIndex } = this.props
    const { card_id, card_name, due_time, is_realize = '0' ,executors = []} = chirldTaskItemValue
    const { datas:{ projectDetailInfoData = {} } } = this.props.model
    const { data = [] } = projectDetailInfoData //任务执行人列表
    let executor = {//任务执行人信息
      user_id: '',
      user_name: '',
      avatar: '',
    }
    if(executors.length) {
      executor = executors[0]
    }

    const imgOrAvatar = (img) => {
      return  img ? (
        <div>
          <img src={img} style={{width: 16, height: 16,marginRight:8,borderRadius: 16, margin:'0 12px'}} />
        </div>
      ):(
        <div style={{height:16,width: 16,borderRadius:16,backgroundColor:'#e8e8e8',marginRight:8,textAlign: 'center',margin:'0 12px',marginTop: 2,}}>
          <Icon type={'user'} style={{fontSize:10, marginTop: 4,color: '#8c8c8c', display: 'block',}}/>
        </div>
      )
    }

    return (
      <div  className={DrawerContentStyles.taskItem}>
        <div key={'1'} className={DrawerContentStyles.item_1} >
          <div className={is_realize === '1' ? DrawerContentStyles.nomalCheckBoxActive: DrawerContentStyles.nomalCheckBox} onClick={this.itemOneClick.bind(this)}>
            <Icon type="check" style={{color: '#FFFFFF',fontSize:12, fontWeight:'bold'}}/>
          </div>
          <div>{`${card_name}`}<span style={{color: '#d5d5d5',marginLeft:6}}>{due_time? (due_time.indexOf('-') !==-1? due_time : timestampToTimeNormal(due_time))+ '截止' : ''}</span></div>
          <div style={{position:'relative', height: 22,display: 'flex', justifyContent: 'align-items'}}>
            <Dropdown overlay={
              <DCMenuItemOne execusorList={data} setList={this.setList.bind(this)} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>
            }>
              {executor.user_id? (
                <Tooltip title={executor.user_name || '佚名'}>
                  {imgOrAvatar(executor.avatar)}
                </Tooltip>
              ) : (
                <div>
                  <Icon type="user" style={{fontSize: 16,margin:'0 12px',marginTop: 2,cursor: 'pointer'}} className={DrawerContentStyles.userIconNormal}/>
                </div>
              )}

            </Dropdown>
            <div>
              {!due_time?(
                <Icon type="calendar" style={{fontSize: 16, marginRight: 12 ,cursor: 'pointer'}} className={DrawerContentStyles.calendarIconNormal}/>
              ):(
                <Icon type="disconnect" style={{fontSize: 16, marginRight: 12 ,cursor: 'pointer'}} className={DrawerContentStyles.calendarIconNormal}/>
              )}
            </div>
            <DatePicker  onChange={this.datePickerChange.bind(this)}  placeholder={'选择截止日期'} style={{opacity: 0,height: 16, width: 16,background: '#000000',position: 'absolute',right: 0,zIndex:2}} />
          </div>
        </div>
      </div>
    )
  }
}
