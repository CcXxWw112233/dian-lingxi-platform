import React from 'react'
import indexStyles from './index.less'
import { Card, Input, Icon, DatePicker, Dropdown, Button, Tooltip } from 'antd'
import MenuSearchMultiple  from '../ProcessStartConfirm/MenuSearchMultiple'
import OpinionModal from './OpinionModal'
import {timeToTimestamp, timestampToTimeNormal} from "../../../../../../utils/util";

const { RangePicker } = DatePicker;

//里程碑确认信息
export default class DetailConfirmInfoOne extends React.Component {
  state = {
    opinionModalVisible: false,
    due_time: '',
    isShowBottDetail: false, //是否显示底部详情
  }
  datePickerChange(date, dateString) {
    this.setState({
      due_time:dateString
    })
    console.log(timeToTimestamp(dateString))
    const { datas: { processEditDatas = [], projectDetailInfoData = [] } } = this.props.model
    const { itemKey  } = this.props
    processEditDatas[itemKey]['deadline_value'] = timeToTimestamp(dateString)
    this.props.updateDatas({
      processEditDatas
    })

  }
  setAssignees(data) {
    const { datas: { processEditDatas = [], projectDetailInfoData = [] } } = this.props.model
    const { itemKey  } = this.props
    //从项目详情拿到推进人
    let assigneesArray = []
    const users = projectDetailInfoData.data
    for(let i = 0; i < users.length; i++) {
      assigneesArray.push(users[i].user_id)
    }
    //设置推进人
    let willSetAssigneesArray = []
    for(let i=0; i < data.length; i++) {
      willSetAssigneesArray.push(assigneesArray[data[i]])
    }
    const str = willSetAssigneesArray.join(',')
    processEditDatas[itemKey]['assignees'] = str
    this.props.updateDatas({
      processEditDatas
    })
  }
  setIsShowBottDetail() {
    this.setState({
      isShowBottDetail: !this.state.isShowBottDetail
    },function () {
      this.funTransitionHeight(element, 500,  this.state.isShowBottDetail)
    })
    const element = document.getElementById('ConfirmInfoOut_1_bott')
  }
  funTransitionHeight = function(element, time, type) { // time, 数值，可缺省
    if (typeof window.getComputedStyle == "undefined") return;
    const height = window.getComputedStyle(element).height;
    element.style.transition = "none";    // 本行2015-05-20新增，mac Safari下，貌似auto也会触发transition, 故要none下~
    element.style.height = "auto";
    const targetHeight = window.getComputedStyle(element).height;
    element.style.height = height;
    element.offsetWidth;
    if (time) element.style.transition = "height "+ time +"ms";
    element.style.height = type ? targetHeight : 0;
  };

  setOpinionModalVisible() {
    this.setState({
      opinionModalVisible: !this.state.opinionModalVisible
    })
  }

  render() {
    const { due_time, isShowBottDetail } = this.state
    const { datas: { processEditDatas, projectDetailInfoData = [], processInfo = {} } } = this.props.model
    const { itemKey } = this.props //所属列表位置
    const { curr_node_sort } = processInfo //当前节点
    const { name, description, assignees = [], assignee_type, deadline_type, deadline_value, is_workday, sort } = processEditDatas[itemKey]
    console.log( processEditDatas[itemKey])
    //推进人来源
    let usersArray = []
    const users = projectDetailInfoData.data
    for(let i = 0; i < users.length; i++) {
      usersArray.push(users[i].full_name || users[i].email || users[i].mobile)
    }
    //推进人
    const assigneesArray = assignees || []
    const imgOrAvatar = (img) => {
      return  img ? (
        <div>
          <img src={img} style={{width: 18, height: 18,marginRight:8,borderRadius: 16, margin:'0 8px'}} />
        </div>
      ):(
        <div style={{lineHeight: '18px',height:18,width: 16,borderRadius:18,backgroundColor:'#e8e8e8',marginRight:8,textAlign: 'center',margin:'0 8px',marginTop: 2,}}>
          <Icon type={'user'} style={{fontSize:10,color: '#8c8c8c',}}/>
        </div>
      )
    }
    const filterAssignee = (assignee_type) => {
      let container = (<div></div>)
      switch (assignee_type) {
        case '1':
          container = (<div style={{color: '#595959'}}>任何人</div>)
          break
        case '2':
          container = (
              <div  style={{display: 'flex'}}>
                {assigneesArray.map((value, key)=>{
                  const { avatar, name } = value
                  if (key <= 6)
                    return(
                      <Tooltip  key={key} placement="top" title={name || '佚名'}>
                        <div>{imgOrAvatar(avatar)}</div>
                      </Tooltip>
                    )
                })}
                {assigneesArray.length >6?(<span style={{color: '#595959'}}>{`等${assigneesArray.length}人`}</span>): ('') }
              </div>)
          break
        case '3':
          container = (
            <div  style={{display: 'flex'}}>
              {assigneesArray.map((value, key)=>{
                const { avatar, name } = value
                if (key <= 6)
                  return(
                    <Tooltip  key={key} placement="top" title={name || '佚名'}>
                      <div>{imgOrAvatar(avatar)}</div>
                    </Tooltip>
                  )
              })}
              {assigneesArray.length >6?(<span style={{color: '#595959'}}>{`等${assigneesArray.length}人`}</span>): ('') }
            </div>)
          break
        default:
          container = (<div></div>)
          break
      }
      return container
    }
    const filterDueTime = (deadline_type) => {
      let container = (<div></div>)
      switch (deadline_type) {
        case '1':
          container = (<div style={{color: '#595959'}}>无限期</div>)
          break
        case '2':
          container = (
            <div style={{position: 'relative' }}  style={{color: '#595959'}}>
              {timestampToTimeNormal(deadline_value, '-',true)}
            </div>
          )
          break
        case '3':
          container = (<div style={{color: '#595959'}}>{`${is_workday === '0'? '固定': '工作日'}${deadline_value}天`}</div>)
          break
        default:
          container = (<div></div>)
          break
      }
      return container
    }

    return (
      <div className={indexStyles.ConfirmInfoOut_1}>
        <Card style={{width: '100%',backgroundColor: '#f5f5f5'}}>
          <div className={indexStyles.ConfirmInfoOut_1_top}>
            <div className={indexStyles.ConfirmInfoOut_1_top_left}>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_left}>{itemKey + 1}</div>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_right}>
                <div>{name}</div>
                <div>里程碑</div>
              </div>
            </div>
            <div className={indexStyles.ConfirmInfoOut_1_top_right}>
              {filterAssignee(assignee_type)}
              {filterDueTime(deadline_type)}
              <div className={isShowBottDetail ? indexStyles.upDown_up: indexStyles.upDown_down}><Icon  onClick={this.setIsShowBottDetail.bind(this)} type="down" theme="outlined" style={{color: '#595959'}}/></div>
            </div>
          </div>
          <div className={isShowBottDetail? indexStyles.ConfirmInfoOut_1_bottShow : indexStyles.ConfirmInfoOut_1_bottNormal} id={'ConfirmInfoOut_1_bott'} >
            <div className={indexStyles.ConfirmInfoOut_1_bott_left}></div>
            <div className={indexStyles.ConfirmInfoOut_1_bott_right} >
              <div className={indexStyles.ConfirmInfoOut_1_bott_right_dec}>{description}</div>
              <div className={indexStyles.ConfirmInfoOut_1_bott_right_operate}>
                <div>重新指派推进人</div>
                <Button type={'primary'}>完成</Button>
              </div>
            </div>
          </div>
        </Card>
        <OpinionModal {...this.props} setOpinionModalVisible={this.setOpinionModalVisible.bind(this)} opinionModalVisible = {this.state.opinionModalVisible}/>

      </div>
    )
  }
}
