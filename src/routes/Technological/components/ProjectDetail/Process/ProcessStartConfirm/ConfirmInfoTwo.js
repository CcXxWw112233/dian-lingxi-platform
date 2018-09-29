import React from 'react'
import indexStyles from './index.less'
import { Card, Input, Icon, DatePicker, Dropdown, Button, Upload, message, Tooltip } from 'antd'
import MenuSearchMultiple  from './MenuSearchMultiple'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import {timeToTimestamp} from "../../../../../../utils/util";

const { RangePicker } = DatePicker;
const Dragger = Upload.Dragger;

//里程碑确认信息
export default class ConfirmInfoTwo extends React.Component {
  state = {
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

  //文件名类型
  judgeFileType(fileName) {
    let themeCode = ''
    const type = fileName.substr(fileName.lastIndexOf(".")).toLowerCase()
    switch (type) {
      case '.xls':
        themeCode = '&#xe6d5;'
        break
      case '.png':
        themeCode = '&#xe6d4;'
        break
      case '.xlsx':
        themeCode = '&#xe6d3;'
        break
      case '.ppt':
        themeCode = '&#xe6d2;'
        break
      case '.gif':
        themeCode = '&#xe6d1;'
        break
      case '.jpeg':
        themeCode = '&#xe6d0;'
        break
      case '.pdf':
        themeCode = '&#xe6cf;'
        break
      case '.docx':
        themeCode = '&#xe6ce;'
        break
      case 'txt':
        themeCode = '&#xe6cd;'
        break
      case '.doc':
        themeCode = '&#xe6cc;'
        break
      case '.jpg':
        themeCode = '&#xe6cb;'
        break
      default:
        themeCode = ''
        break
    }
    return themeCode
  }

  render() {
    const { due_time, isShowBottDetail } = this.state
    const { datas: { processEditDatas = [], projectDetailInfoData = [] } } = this.props.model
    const { itemKey  } = this.props
    const { name, description, assignees, assignee_type, deadline_type, deadline_value, is_workday } = processEditDatas[itemKey]
    //推进人来源
    let usersArray = []
    const users = projectDetailInfoData.data
    for(let i = 0; i < users.length; i++) {
      usersArray.push(users[i].full_name || users[i].email || users[i].mobile)
    }
    //推进人
    const assigneesArray = assignees ? assignees.split(',') : []
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
            <div>
              <Dropdown overlay={<MenuSearchMultiple  usersArray={usersArray} setAssignees={this.setAssignees.bind(this)} />}>
                {assigneesArray.length? (
                  <div  style={{display: 'flex'}}>
                    {assigneesArray.map((value, key)=>{
                      if (key < 6)
                        return(
                          <Tooltip  key={key} placement="top" title={value}>
                            <div>{imgOrAvatar()}</div>
                          </Tooltip>
                        )
                    })}
                    {assigneesArray.length >6?(<span style={{color: '#595959'}}>{`等${assigneesArray.length}人`}</span>): ('') }
                  </div>
                ) : (
                  <div>
                    设置推进人
                  </div>
                )}
              </Dropdown>
            </div>)
          break
        case '3':
          container = (
            <div style={{display: 'flex'}}>
              {assigneesArray.map((value, key)=>{
                if (key < 6)
                  return(
                    <Tooltip  key={key} placement="top" title={value}>
                      <div>{imgOrAvatar()}</div>
                    </Tooltip>
                  )
              })}
              {assigneesArray.length >6?(<span style={{color: '#595959'}}>{`等${assigneesArray.length}人`}</span>): ('') }
            </div>
          )
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
            <div style={{position: 'relative' }}>
              {due_time || '设置截止时间'}
              <DatePicker  onChange={this.datePickerChange.bind(this)}
                           placeholder={'选择截止时间'}
                           showTime
                           format="YYYY-MM-DD HH:mm"
                           style={{opacity: 0,height: 16, width: 70,background: '#000000',position: 'absolute',right: 0,zIndex:2,cursor:'pointer'}} />
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

    const that = this
    const dragProps = {
      name: 'file',
      multiple: true,
      withCredentials:true,
      action: '//jsonplaceholder.typicode.com/posts/',
      beforeUpload() {

      },
      onChange(info) {
        const status = info.file.status;
        const element = document.getElementById('ConfirmInfoOut_1_bott')
        that.funTransitionHeight(element, 500,  true)
        if (status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (status === 'done') {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    }

    return (
      <div className={indexStyles.ConfirmInfoOut_1}>
        <Card style={{width: '100%',backgroundColor: '#f5f5f5'}}>
          <div className={indexStyles.ConfirmInfoOut_1_top}>
            <div className={indexStyles.ConfirmInfoOut_1_top_left}>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_left}>{itemKey +1}</div>
              <div className={indexStyles.ConfirmInfoOut_1_top_left_right}>
                <div>{name}</div>
                <div>上传</div>
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
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
