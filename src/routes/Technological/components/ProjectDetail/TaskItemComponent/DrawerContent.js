import React from 'react'
import DrawerContentStyles from './DrawerContent.less'
import { Icon, Tag, Input, Dropdown, Menu,DatePicker, Checkbox  } from 'antd'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/braft.css'
import DCAddChirdrenTask from './DCAddChirdrenTask'
import DCMenuItemOne from './DCMenuItemOne'
import {Modal} from "antd/lib/index";
import Comment from '../../NewsDynamic/Comment'
import { deepClone } from '../../../../../utils/util'

const TextArea = Input.TextArea
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

let that
export default class DrawContent extends React.Component {
  state = {
    isCheck: true,
    title: '',
    titleIsEdit: false,
    isInEdit: false,
    tagArray: [122,111,555,888],
    isInAddTag: false,
    // 第二行状态
    isSetedChargeMan: false,
    isSetedStartTime: false,
    isSetedEndTime: false,
    isSetedAlarm: false,
    List: ['子任务子任务子任务子任务子任务子任务',2,3,4],
    alarmTime: '',
    startTime: '',
    endTime: '',
  }

  //firstLine -------start
  //分组状态选择
  projectGroupMenuClick(e) {
    console.log(e)
  }
  topRightMenuClick({key}) {
    if(key === '2') {
      this.confirm()
    }
  }
  confirm() {
    Modal.confirm({
      title: '确认删除该任务吗？',
      okText: '确认',
      cancelText: '取消',
      onOk()  {
      }
    });
  }
  //firstLine----------end

  //标题-------start
  setIsCheck() {
    this.setState({
      isCheck: !this.state.isCheck
    })
  }
  titleTextAreaChangeBlur(e) {
    const { datas:{ drawContent = {} } } = this.props.model
    const { card_id, description, due_time, start_time } = drawContent
    drawContent['card_name'] = e.target.value
    const updateObj ={
      card_id,
      name: e.target.value,
      card_name: e.target.value,
      due_time,
      description,
      start_time,
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
  setList(arr) {
    this.setState({
      List: arr
    })
  }
  chirldrenTaskChargeChange() {
    this.setState({
      isSetedChargeMan: true
    })
  }
  setChargeManIsSelf() {
    this.setState({
      isSetedChargeMan: true
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
    this.setState({
      isSetedStartTime: true,
      startTime: timeString
    })
  }
    //截止时间
  endDatePickerChange(e, timeString) {
    this.setState({
      isSetedEndTime: true,
      endTime: timeString
    })
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
        card_name,
        due_time,
        start_time,
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
  tagClose(e) {
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
  }
  //标签-------------end

  render() {
    that = this
    const { isCheck, titleIsEdit, isInEdit, tagArray, isInAddTag, isSetedChargeMan, isSetedStartTime, isSetedEndTime, isSetedAlarm, List, alarmTime, startTime, endTime} = this.state

    const { datas:{ drawContent = {} } } = this.props.model
    let { card_id, card_name, chirl_data=[], start_time, due_time, description } = drawContent
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
        <SubMenu key="sub1" title={<span>Navigation One</span>}>
            <Menu.Item key="1">Option 1</Menu.Item>
            <Menu.Item key="2">Option 2</Menu.Item>
            <Menu.Item key="3">Option 3</Menu.Item>
            <Menu.Item key="4">Option 4</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span>Navigation Two</span>}>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title={<span>Navigation Three</span>}>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <Menu.Item key="11">Option 11</Menu.Item>
          <Menu.Item key="12">Option 12</Menu.Item>
        </SubMenu>
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
                <span>项目实例 </span> <Icon type="right" /> <span>任务看板形态</span>
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
             <div onClick={this.setIsCheck.bind(this)} className={isCheck? DrawerContentStyles.nomalCheckBoxActive: DrawerContentStyles.nomalCheckBox} style={{width: 24, height: 24}}>
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
              {!isSetedChargeMan ? (
                 <div>
                   <span onClick={this.setChargeManIsSelf.bind(this)}>认领</span>&nbsp;<span style={{color: '#bfbfbf'}}>或</span>&nbsp;
                   <Dropdown overlay={<DCMenuItemOne List={List} setList={this.setList.bind(this)} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange.bind(this)}/>}>
                     <span>指派负责人</span>
                   </Dropdown>
                 </div>
                ) : (
                  <div>
                    <img style={{ width: 20, height: 20, borderRadius: 20, marginRight: 8}} />
                    <span  style={{overflow: 'hidden',verticalAlign:' middle', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: 80}}>我是啊啊sssss啊</span>
                  </div>
                )}
            </div>
            <div>
              <span style={{color: '#bfbfbf'}}>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
            </div>
            <div>
              {isSetedStartTime && isSetedEndTime ? (''): (<span style={{color: '#bfbfbf'}}>设置</span>)}
              <span style={{position: 'relative', cursor: 'pointer'}}>&nbsp;{!isSetedStartTime ? '开始' : startTime}
                <DatePicker
                  onChange={this.startDatePickerChange.bind(this)}
                  placeholder={'开始时间'}
                  style={{opacity: 0, width: !isSetedStartTime? 16 : 70, height: 20,background: '#000000', cursor: 'pointer', position: 'absolute',right:  !isSetedStartTime? 8 : 0,zIndex:1}} />
              </span>
               &nbsp;
              {isSetedStartTime && isSetedEndTime ?(<span style={{color: '#bfbfbf'}}>-</span>) : (<span style={{color: '#bfbfbf'}}>或</span>)}
              &nbsp;
              <span style={{position: 'relative'}}>{!isSetedEndTime ? '截止时间' : endTime}
                <DatePicker
                  placeholder={'截止时间'}
                  onChange={this.endDatePickerChange.bind(this)}
                  style={{opacity: 0, width: !isSetedEndTime? 50 : 70, cursor: 'pointer', height: 20,background: '#000000',position: 'absolute',right: 0,zIndex:1}} />
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
            {tagArray.map((value, key) => {
              return(
                <Tag closable onClose={this.tagClose.bind(this)} key={key} color={this.randomColorArray()}>{value}</Tag>
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

        <div  className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.spaceLine}></div>
        </div>

        {/*添加子任务*/}
        <DCAddChirdrenTask />

        <div  className={DrawerContentStyles.divContent_1}>
          <div className={DrawerContentStyles.spaceLine} ></div>
        </div>

        {/*评论*/}
        <div className={DrawerContentStyles.divContent_2} style={{marginTop: 20}}>
          <Comment leftSpaceDivWH={26}></Comment>
        </div>

      </div>
    )
  }

}

