import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Tag, Input, Dropdown, Menu,DatePicker, Checkbox  } from 'antd'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import DCAddChirdrenTask from './DCAddChirdrenTask'
import DCMenuItemOne from './DCMenuItemOne'
import {Modal} from "antd/lib/index";
import Comment from './Comment'
import Cookies from 'js-cookie'
import { timestampToTimeNormal, timeToTimestamp } from '../../../../../utils/util'

import { deepClone } from '../../../../../utils/util'

const TextArea = Input.TextArea
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

let that
export default class DrawContent extends React.Component {
  state = {
    title: '',
    titleIsEdit: false,
    isInEdit: false,
    isInAddTag: false,
    // 第二行状态
    isSetedAlarm: false,
    alarmTime: '',
  }

  //firstLine -------start
  //分组状态选择
  projectGroupMenuClick(e) {
    const pathArr = e.keyPath
    const parentKey = Number(pathArr[1])
    const childKey = Number(pathArr[0])

    const { datas:{ drawContent = {}, projectDetailInfoData = {}, projectGoupList = [] } } = this.props.model
    const { card_id } = drawContent
    const list_id = projectGoupList[parentKey].list_data[childKey].list_id
    const board_id = projectGoupList[parentKey].board_id
    const requestObj = {
      card_id,
      list_id,
      board_id,
    }
    const indexObj = {
      taskGroupListIndex: childKey,
      taskGroupListIndex_index: 0
    }
    this.props.changeTaskType({requestObj, indexObj})
  }
  topRightMenuClick({key}) {
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    if(key === '1') {
      this.props.archivedTask({
        card_id,
        is_archived: '1'
      })
    }else if(key === '2') {
      this.confirm(card_id)
    }
  }
  confirm(card_id) {
    const that = this
    Modal.confirm({
      title: '确认删除该任务吗？',
      okText: '确认',
      cancelText: '取消',
      zIndex: 2000,
      onOk()  {
        that.props.setDrawerVisibleClose()
        that.props.deleteTask(card_id)
      }
    });
  }
  //firstLine----------end

  //标题-------start
  setIsCheck() {
    const { datas:{ drawContent = {}, projectDetailInfoData = {} } } = this.props.model
    const { is_realize = '0', card_id } = drawContent
    const obj = {
      card_id,
      is_realize: is_realize === '1' ? '0' : '1'
    }
    this.props.completeTask(obj)
    drawContent['is_realize'] = is_realize === '1' ? '0' : '1'
    this.props.updateDatas({drawContent})
  }
  titleTextAreaChangeBlur(e) {
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id, description, due_time, start_time } = drawContent
    drawContent['card_name'] = e.target.value
    const updateObj ={
      card_id,
      name: e.target.value,
      card_name: e.target.value,
    }
    // const newDrawContent = {...drawContent,card_name: e.target.value,}
    this.props.updateTask({updateObj})
    this.props.updateDatas({drawContent})
  }
  setTitleIsEdit(titleIsEdit, e) {
    e.stopPropagation();
    this.setState({
      titleIsEdit: titleIsEdit
    })
  }
  //标题-------end

  //第二行状态栏编辑------------------start
    //设置任务负责人组件---------------start
  setList(id) {
    const { datas:{ projectDetailInfoData = {} } } = this.props.model
    const { board_id } = projectDetailInfoData
    this.props.removeProjectMenbers({board_id, user_id: id})
  }
  chirldrenTaskChargeChange({ user_id, full_name, avatar }) {
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id, executors=[] } = drawContent
    executors[0] = {
      user_id,
      user_name: full_name,
      avatar: avatar
    }
    this.props.addTaskExecutor({
      card_id,
      users: user_id
    })
  }
  setChargeManIsSelf() {
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id, executors=[] } = drawContent
    const userInfo = JSON.parse(Cookies.get('userInfo'))
    const { id, full_name,fullName, email, mobile, avatar } = userInfo
    executors[0] = {
      user_id: id,
      user_name: full_name || fullName || mobile || email,
      avatar: avatar
    }
    this.props.addTaskExecutor({
      card_id,
      users: id
    })
  }
    //设置任务负责人组件---------------end
    //设置提醒
  alarmMenuClick({key}) {
    let alarmTime
    switch (key) {
      case '1':
        alarmTime = '15分钟后'
        break
      case '2':
        alarmTime = '30分钟后'
        break
      case '3':
        alarmTime = '1小时后'
        break
      case '4':
        alarmTime = '1天后'
        break
      case '5':
        alarmTime = '任务开始时'
        break
      case '6':
        alarmTime = '任务结束时'
        break
      default:
        break
    }
    this.setState({
      isSetedAlarm: true,
      alarmTime
    })
  }
    //开始时间
  startDatePickerChange(e, timeString) {
    console.log(e, timeString)
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    drawContent['start_time'] = timeToTimestamp(timeString)
    const updateObj ={
      card_id,
      start_time: timeString,
    }
    this.props.updateTask({updateObj})
    this.props.updateDatas({drawContent})
  }
    //截止时间
  endDatePickerChange(e, timeString) {

    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id } = drawContent
    drawContent['due_time'] = timeToTimestamp(timeString)
    const updateObj ={
      card_id,
      due_time: timeString,
    }
    this.props.updateTask({updateObj})
    this.props.updateDatas({drawContent})
  }
  //第二行状态栏编辑------------------end

  //有关于富文本编辑---------------start
  editWrapClick(e) {
    e.stopPropagation();
  }
  goEdit(e) {
    e.stopPropagation();
    this.setState({
      isInEdit: true
    })
  }
  drawerContentOutClick(e) {
    if(this.state.isInEdit){
      const { datas:{ drawContent = {} } } = this.props.model
      const { card_id, description, due_time, start_time, card_name } = drawContent
      const updateObj ={
        card_id,
        description,
      }
      this.props.updateTask({updateObj})
    }
    this.setState({
      isInEdit: false,
      titleIsEdit: false,
    })
  }
  //有关于富文本编辑---------------end

  //标签-------------start
  randomColorArray() {
    const colorArr = ['magenta','red','volcano','orange','gold','lime','green','cyan','blue','geekblue','purple']
    const n =  Math.floor(Math.random() * colorArr.length + 1)-1;
    return colorArr[n]
  }
  tagClose({ label_id, label_name, key}) {
    const { datas:{ drawContent = {}} } = this.props.model
    const { card_id } = drawContent
    drawContent['label_data'].splice(key, 1)
    const keyCode = label_id? 'label_id':'label_name'
    this.props.removeTaskTag({
      card_id,
      [keyCode]: label_id || label_name,
    })
    this.props.updateDatas({drawContent})
  }
  addTag() {
    this.setState({
      isInAddTag: true
    })
  }
  tagAddComplete(e) {
    this.setState({
      isInAddTag: false
    })
    if(! e.target.value) {
      return false
    }
    const { datas:{ drawContent = {},  projectDetailInfoData = {} } } = this.props.model
    const { card_id, label_data = [] } = drawContent
    const { board_id } = projectDetailInfoData
    label_data.push({label_name: e.target.value})
    this.props.addTaskTag({
      card_id,
      board_id,
      name: e.target.value,
      label_name: e.target.value,
      length: label_data.length
    })
  }
  //标签-------------end

  render() {
    that = this
    const { titleIsEdit, isInEdit, isInAddTag,  isSetedAlarm, alarmTime} = this.state

    //drawContent  是从taskGroupList点击出来设置当前项的数据。taskGroupList是任务列表，taskGroupListIndex表示当前点击的是哪个任务列表
    const { datas:{ drawContent = {}, projectDetailInfoData = {}, projectGoupList = [], taskGroupList = [], taskGroupListIndex = 0 } } = this.props.model

    const { data = [], board_name } = projectDetailInfoData //任务执行人列表
    const { list_name } = taskGroupList[taskGroupListIndex]

    let { card_id, card_name, child_data = [], start_time, due_time, description, label_data = [], is_realize = '0', executors = [] } = drawContent

    let executor = {//任务执行人信息
      user_id: '',
      user_name: '',
      avatar: '',
    }
    if(executors.length) {
      executor = executors[0]
    }
    label_data = label_data || []
    description = description || '<p style="font-size: 14px;color: #595959; cursor: pointer ">编辑描述</p>'

    const editorProps = {
      height: 0,
      contentFormat: 'html',
      initialContent: description,
      onHTMLChange:(e) => {
        const { datas:{ drawContent = {} } } = this.props.model
        drawContent['description'] = e
        this.props.updateDatas({drawContent})
      },
      fontSizes: [14],
      controls: [
        'text-color', 'bold', 'italic', 'underline', 'strike-through',
        'text-align', 'list_ul',
        'list_ol', 'blockquote', 'code', 'split', 'media'
      ]
    }
    const alarmMenu = (
      <Menu onClick={this.alarmMenuClick.bind(this)}>
        <Menu.Item key="1">15分钟后</Menu.Item>
        <Menu.Item key="2">30分钟后</Menu.Item>
        <Menu.Item key="3">1小时后</Menu.Item>
        <Menu.Item key="4">1天后</Menu.Item>
        <Menu.Item key="5" disabled>任务开始时</Menu.Item>
        <Menu.Item key="6" disabled>任务结束时</Menu.Item>

      </Menu>
    )

    const projectGroupMenu = (
      <Menu onClick={this.projectGroupMenuClick.bind(this)} mode="vertical">
        {projectGoupList.map((value, key) => {
          const { list_data } = value
          return (
            <SubMenu key={key} title={<span>{value.board_name}</span>}>
              {list_data.map((value2, key2) => {
                return (<Menu.Item key={key2}>{ value2.list_name }</Menu.Item>)
              })}
            </SubMenu>
            )
        })}
      </Menu>
    )

    const topRightMenu = (
      <Menu onClick={this.topRightMenuClick.bind(this)}>
        <Menu.Item key={'1'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={DrawerContentStyles.elseProjectMemu}>
            归档任务
          </div>
        </Menu.Item>
        <Menu.Item key={'2'}  style={{textAlign: 'center',padding:0,margin: 0}}>
          <div className={DrawerContentStyles.elseProjectDangerMenu}>
            删除任务
          </div>
        </Menu.Item>
      </Menu>
    );

    return(
      <div className={DrawerContentStyles.DrawerContentOut} onClick={this.drawerContentOutClick.bind(this)}>
        {/*项目挪动*/}
        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_1}>
            <Dropdown overlay={projectGroupMenu}>
              <div className={DrawerContentStyles.left}>
                <span>{board_name} </span> <Icon type="right" /> <span>{list_name}</span>
              </div>
            </Dropdown>
            <Dropdown overlay={topRightMenu}>
              <div className={DrawerContentStyles.right}>
                <Icon type="ellipsis" style={{fontSize: 20,marginTop:2}} />
              </div>
            </Dropdown>
          </div>
        </div>

        {/*标题*/}
        <div className={DrawerContentStyles.divContent_2}>
           <div className={DrawerContentStyles.contain_2}>
             <div onClick={this.setIsCheck.bind(this)} className={is_realize === '1' ? DrawerContentStyles.nomalCheckBoxActive: DrawerContentStyles.nomalCheckBox} style={{width: 24, height: 24}}>
               <Icon type="check" style={{color: '#FFFFFF',fontSize:16, fontWeight:'bold',marginTop: 2}}/>
             </div>
             {!titleIsEdit ? (
               <div className={DrawerContentStyles.contain_2_title} onClick={this.setTitleIsEdit.bind(this, true)}>{card_name}</div>
             ) : (
               <TextArea defaultValue={card_name} autosize
                         onBlur={this.titleTextAreaChangeBlur.bind(this)}
                         onClick={this.setTitleIsEdit.bind(this, true)}
                         style={{display: 'block',fontSize: 20, color: '#262626',resize:'none', marginLeft: -4, padding: '0 4px'}}/>
             )}
           </div>
        </div>

        {/*第三行设置*/}
        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_3}>
            <div>
              {!executor.user_id ? (
                 <div>
                   <span onClick={this.setChargeManIsSelf.bind(this)}>认领</span>&nbsp;<span style={{color: '#bfbfbf'}}>或</span>&nbsp;
                   <Dropdown overlay={<DCMenuItemOne execusorList={data} setList={this.setList.bind(this)} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                     <span>指派负责人</span>
                   </Dropdown>
                 </div>
                ) : (
                <Dropdown overlay={<DCMenuItemOne execusorList={data} setList={this.setList.bind(this)} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    {executor.avatar? (
                      <img style={{ width: 20, height: 20, borderRadius: 20, marginRight: 8}} src={executor.avatar} />
                    ) : (
                      <div style={{width: 20, height: 20, display: 'flex', alignItems: 'center',justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', marginRight: 8, }}>
                        <Icon type={'user'} style={{fontSize: 12, color: '#8c8c8c'}}/>
                      </div>
                    )}
                    <div  style={{overflow: 'hidden',verticalAlign:' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 80}}>{executor.user_name || '佚名'}</div>
                  </div>
                </Dropdown>
                )}
            </div>
            <div>
              <span style={{color: '#bfbfbf'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            </div>
            <div>
              {start_time && due_time ? (''): (<span style={{color: '#bfbfbf'}}>设置</span>)}
              <span style={{position: 'relative', cursor: 'pointer'}}>&nbsp;{start_time ? timestampToTimeNormal(start_time) : '开始' }
                <DatePicker
                  onChange={this.startDatePickerChange.bind(this)}
                  placeholder={'开始时间'}
                  style={{opacity: 0, width: !start_time? 16 : 70, height: 20,background: '#000000', cursor: 'pointer', position: 'absolute',right:  !start_time? 8 : 0,zIndex:1}} />
              </span>
               &nbsp;
              {start_time && due_time ?(<span style={{color: '#bfbfbf'}}>-</span>) : (<span style={{color: '#bfbfbf'}}>或</span>)}
              &nbsp;
              <span style={{position: 'relative'}}>{due_time ? timestampToTimeNormal(due_time) : '截止时间'}
                <DatePicker
                  placeholder={'截止时间'}
                  onChange={this.endDatePickerChange.bind(this)}
                  style={{opacity: 0, width: !due_time? 50 : 70, cursor: 'pointer', height: 20,background: '#000000',position: 'absolute',right: 0,zIndex:1}} />
              </span>
            </div>
            <div>
              <span style={{color: '#bfbfbf'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            </div>
            <div>
              {!isSetedAlarm ? (
                <Dropdown overlay={alarmMenu}>
                  <span>设置提醒</span>
                </Dropdown>
              ) : (
                <Dropdown overlay={alarmMenu}>
                   <span>{alarmTime}</span>
                </Dropdown>
              )}
            </div>
          </div>
        </div>

        {/*富文本*/}
        {!isInEdit ? (
          <div className={DrawerContentStyles.divContent_1} >
            <div className={DrawerContentStyles.contain_4} onClick={this.goEdit.bind(this)}>
              <div style={{cursor: 'pointer'}} dangerouslySetInnerHTML={{__html: description}}></div>
            </div>
          </div>
        ) : (
          <div className={DrawerContentStyles.editorWraper} onClick={this.editWrapClick.bind(this)}>
            <BraftEditor {...editorProps} style={{fontSize:12}}/>
          </div>
        ) }

        {/*关联*/}
        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_6}>
            <div className={DrawerContentStyles.contain_6_add} onClick={this.addTag.bind(this)}>
              <Icon type="plus" style={{marginRight: 4}}/>关联内容
            </div>
          </div>
        </div>

        {/*标签*/}
        <div className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.contain_5}>
            {label_data.map((value, key) => {
              return(
                <Tag closable onClose={this.tagClose.bind(this, {label_id: value.label_id, label_name: value.label_name, key})} key={key} color={this.randomColorArray()}>{value.label_name}</Tag>
              )
            })}
            <div>
              {!isInAddTag ? (
                <div className={DrawerContentStyles.contain_5_add} onClick={this.addTag.bind(this)}>
                  <Icon type="plus" style={{marginRight: 4}}/>标签
                </div>
              ) : (
                <Input placeholder={'标签'} style={{height: 22, fontSize: 14, color: '#8c8c8c',minWidth: 62, maxWidth: 100}} onPressEnter={this.tagAddComplete.bind(this)} onBlur={this.tagAddComplete.bind(this)}/>
              ) }
            </div>

          </div>
        </div>
        {child_data.length?(
          <div  className={DrawerContentStyles.divContent_1}>
            <div className={DrawerContentStyles.spaceLine}></div>
          </div>
        ):('')}


        {/*添加子任务*/}
        <DCAddChirdrenTask {...this.props}/>

        <div  className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.spaceLine} ></div>
        </div>

        {/*评论*/}
        <div className={DrawerContentStyles.divContent_2} style={{marginTop: 20}}>
          <Comment {...this.props} leftSpaceDivWH={26}></Comment>
        </div>
        <div style={{height: 100}}></div>
      </div>
    )
  }

}

