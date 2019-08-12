import React from 'react'
import DrawDetailInfoStyle from './DrawDetailInfo.less'
import { Icon, Menu, Dropdown, Tooltip, Modal, Checkbox, Card, Progress, Input, Button, message } from 'antd'
import ShowAddMenberModal from '../../Project/ShowAddMenberModal'
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_BOARD_EDIT, PROJECT_TEAM_BOARD_MEMBER
} from "../../../../../globalset/js/constant";
import {checkIsHasPermissionInBoard, isHasOrgMemberQueryPermission} from "../../../../../utils/businessFunction";
import NoPermissionUserCard from './../../../../../components/NoPermissionUserCard/index'
import UserCard from './../../../../../components/UserCard/index'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import DynamicContain from './component/DynamicContain'

const TextArea = Input.TextArea


// const detaiDescription = '欢迎使用灵犀，为了帮助你更好的上手使用好灵犀，我们为你提前预置了这个项目并放置一些帮助你理解每项功能特性的任务卡片。不会耽误你特别多时间，只需要抽空点开卡片并跟随里面的内容提示进行简单操作，即可上手使用。此处显示的文字为项目的介绍信息，旨在帮助参与项目的成员快速了解项目的基本概况，点击可编辑。如果使用中需要问题，可以随时联系我们进行交流或反馈：https://lingxi.di-an.com'
const detaiDescription = '添加简介'
let timer;

export default class DrawDetailInfo extends React.Component {

  constructor(props) {
    super(props)
    this.onScroll = this.onScroll.bind(this)
  }

  state = {
    isSoundsEvrybody: false, //confirm是否通知项目所有人
    isSoundsEvrybody_2: false, //edit是否通知项目所有人
    editDetaiDescription: false, //是否处于编辑状态
    detaiDescriptionValue: detaiDescription,
    defaultDescriptionVal: detaiDescription, // 默认的描述数据
    ShowAddMenberModalVisibile: false, 
    dynamic_header_sticky: false, // 项目动态是否固定, 默认为false, 不固定
    textArea_val: '', // 用来判断是否有用户输入
    is_show_dot: true, // 是否显示点点点, 默认为true 显示
    is_dynamic_scroll: false, // 判断项目动态列表是否在滚动, 默认为false
    is_show_more: false, // 是否显示没有更多了, 默认为false

  }

  // 子组件调用父组件的方法
  getDispatchDynamicList = (board_id) => {
    // console.log('进来了', 'sssss')
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetail/getProjectDynamicsList',
      payload: {
        next_id: '0',
        board_id
      }
    })
  }

  // 监听滚动事件
  onScroll(e, board_id) {
    window.addEventListener('scroll', this.dynamicScroll(e, board_id))
  }

  // 动态的滚动事件
  dynamicScroll = (e, board_id) => {
    const {datas: { p_next_id } } = this.props.model
    const { is_dynamic_scroll } = this.state
    const { dispatch } = this.props
    let infoTop = e && e.target.scrollTop // 滚动的距离
    let manImageListTop = this.refs.manImageList.offsetTop // 获取成员列表的距离
    if (infoTop > manImageListTop) {
      this.setState({
        dynamic_header_sticky: true,
      })
    } else {
      this.setState({
        dynamic_header_sticky: false,
      })
    }
    // 距离底部20的时候触发加载
    if(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20) {
      console.log('ssssss', 'tobottom')
        if(timer) {
          clearTimeout(timer)
        }
        this.setState({
          is_dynamic_scroll: true
        })
        timer = setTimeout(() => {
          this.setState({
            is_dynamic_scroll: false
          })
        }, 500)
        if (!p_next_id) {
          this.setState({
            is_show_more: true
          })
        }
        if (is_dynamic_scroll && p_next_id) {
          dispatch({
            type: 'projectDetail/getProjectDynamicsList',
            payload: {
              board_id,
              next_id: p_next_id
            }
          })
        }
    }
      
    // }
  }

  // 销毁滚动事件
  componentWillUnmount() {
    window.removeEventListener('scroll', this.dynamicScroll)
  }

  handleSetRoleMenuClick(props, { key }) {
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const {datas: { projectDetailInfoData = {} } } = this.props.model
    const { board_id } = projectDetailInfoData //data是参与人列表
    const { user_id } = props
    if(/^role_\w+/.test(key)) {
      this.props.setMemberRoleInProject({board_id, user_id, role_id: key.replace('role_', '')}) //设置角色
      return false
    }
    switch (key) {
      case 'removeMember':
        this.confirm({board_id, user_id})
        break
      default:
        break
    }
  }
  //出现confirm-------------start
  setIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm(data) {
    const that = this
    Modal.confirm({
      title: '确认将他移出项目吗？',
      zIndex: 2000,
      content: <div style={{color: 'rgba(0,0,0, .8)', fontSize: 14}}>
        <span >退出后将无法获取该项目的相关动态</span>
        {/*<div style={{marginTop:20,}}>*/}
        {/*<Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>*/}
        {/*</div>*/}
      </div>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        that.props.removeMenbers(data)
      }
    });
  }
  //出现confirm-------------end

  //点击区域描述可编辑区域-----------start
  setEditDetaiDescriptionShow() {
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_EDIT)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      editDetaiDescription: true
    })
  }
  setEditIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody_2: e.target.checked
    })
  }
  // 简介文本的输入框事件
  textAreaChange(e) {
    this.setState({
      detaiDescriptionValue: e.target.value || detaiDescription,
      textArea_val: e.target.value
    })
    const {datas: { projectDetailInfoData = {} } } = this.props.model
    projectDetailInfoData['description'] = e.target.value
  }
  // 点击保存按钮
  // editSave(board_id, e) {
  //   const {datas: { projectDetailInfoData = {} } } = this.props.model

  //   const obj = {
  //     isSoundsEvrybody_2: this.state.isSoundsEvrybody_2,
  //     description: projectDetailInfoData['description'],
  //     board_id
  //   }
  //   this.props.updateProject(obj)
  //   this.setState({
  //     editDetaiDescription: false
  //   })
  // }
  //点击区域描述可编辑区域-----------end

  //点击添加成员操作
  setShowAddMenberModalVisibile() {
    if(!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  // 修改文本框的事件
  setTextAreaDescription(board_id) {
    const {datas: { projectDetailInfoData = {} } } = this.props.model
      const obj = {
        isSoundsEvrybody_2: this.state.isSoundsEvrybody_2,
        description: projectDetailInfoData['description'],
        board_id
      }
      this.props.updateProject(obj)
      this.setState({
        editDetaiDescription: false,
        textArea_val: ''
      })
  }

  // 获取文本域的键盘事件
  handleKeyDown(e, board_id) {
    const { textArea_val } = this.state
    let code = e.keyCode
    if (code == '13') {
      if (textArea_val != '') {
        this.setTextAreaDescription(board_id)
      } else {
        this.setState({
          editDetaiDescription: false,
          textArea_val: ''
        })
      }
      
    }
  }

  // 获取文本框失去焦点的事件
  handleOnBlur(e, board_id) {
    const { textArea_val } = this.state
    if (textArea_val != '') {
      this.setTextAreaDescription(board_id)
    } else {
      this.setState({
        editDetaiDescription: false,
        textArea_val: ''
      })
    }
  }

  // 是否显示全部成员
  handdleTriggerModal() {
    this.setState({
      is_show_dot: false,
    })
    this.props.handleTriggetModalTitle()
  }

  render() {
    const { editDetaiDescription, detaiDescriptionValue, defaultDescriptionVal, dynamic_header_sticky, is_show_dot, is_show_more } = this.state
    const {datas: { projectInfoDisplay, isInitEntry, projectDetailInfoData = {}, projectRoles = [] } } = this.props.model
    let { board_id, board_name, data = [], description, residue_quantity, realize_quantity } = projectDetailInfoData //data是参与人列表
    data = data || []
    const avatarList = data.concat([1])//[1,2,3,4,5,6,7,8,9]//长度再加一
    const manImageDropdown = (props) => {
      const { role_id, role_name='...', name, email='...', avatar, mobile='...', user_id, organization='...', we_chat='...'} = props
      if(!isHasOrgMemberQueryPermission()) {
        return <NoPermissionUserCard avatar={avatar} full_name={role_name} />
      }
      // return (<UserCard avatar={avatar} email={email} name={name} mobile={mobile} role_name={''} />)
      return (
        <div className={DrawDetailInfoStyle.manImageDropdown}>
          <div className={DrawDetailInfoStyle.manImageDropdown_top}>
            <div className={DrawDetailInfoStyle.left}>
              {avatar?(
                <img src={avatar} />
              ):(
                <div style={{width: 32, height: 32, borderRadius: 32, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                  <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 9}}/>
                </div>
              )}
            </div>
            <div className={DrawDetailInfoStyle.right}>
              <div className={DrawDetailInfoStyle.name}>{name || '佚名'}</div>
              <Tooltip title="该功能即将上线">
                <div className={DrawDetailInfoStyle.percent}>
                  <div style={{width: '0'}}></div>
                  <div style={{width: '0'}}></div>
                  <div style={{width: '100%'}}></div>
                </div>
              </Tooltip>
            </div>
            {role_id === '3'? ('') : (
              <Dropdown overlay={manOperateMenu(props)}>
                <div className={DrawDetailInfoStyle.manImageDropdown_top_operate}><Icon type="ellipsis" theme="outlined" /></div>
              </Dropdown>
            )}

          </div>
          <div className={DrawDetailInfoStyle.manImageDropdown_middle}>
            <div className={DrawDetailInfoStyle.detailItem}>
              <div>职位：</div>
              <div>{role_name}</div>
            </div>
            {/*<div className={DrawDetailInfoStyle.detailItem}>*/}
              {/*<div>组织：</div>*/}
              {/*<div>{organization}</div>*/}
            {/*</div>*/}
            <div className={DrawDetailInfoStyle.detailItem}>
              <div>邮箱：</div>
              <div>{email}</div>
            </div>
            <div className={DrawDetailInfoStyle.detailItem}>
              <div>手机：</div>
              <div>{mobile}</div>
            </div>
            {/* <div className={DrawDetailInfoStyle.detailItem}>
              <div>微信：</div>
              <div>{we_chat}</div>
            </div> */}
          </div>
          {/*<div className={DrawDetailInfoStyle.manImageDropdown_bott}>*/}
          {/*<img src="" />*/}
          {/*</div>*/}
        </div>
      )
    }
    const manOperateMenu = (props) => {
      const { is_visitor } = props
      return(
        <Menu onClick={this.handleSetRoleMenuClick.bind(this, props)}>
          {is_visitor === '0' && checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER) ? (
            <Menu.SubMenu title="设置角色" key={'setRole'}>
              {projectRoles.map((value, key) => {
                return(
                  <Menu.Item key={`role_${value.id}`} style={{textAlign: 'center', padding: 0, margin: 5}}>
                    <div className={DrawDetailInfoStyle.elseProjectMemu}>
                      {value.name}
                    </div>
                  </Menu.Item>
                )
              })}
            </Menu.SubMenu>
          ):('')}

          {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER) && (
            <Menu.Item key={'removeMember'} style={{textAlign: 'center', padding: 0, margin: 0}}>
              <div className={DrawDetailInfoStyle.elseProjectDangerMenu}>
                移除成员
              </div>
            </Menu.Item>
          )}
        </Menu>
      )
    }
    const EditArea = (
      <div>
        <TextArea
          autoFocus
          onBlur={ (e) => { this.handleOnBlur(e, board_id) } } 
          defaultValue={description || detaiDescriptionValue} 
          autosize={true} 
          onKeyDown={ (e) => { this.handleKeyDown(e, board_id) } } 
          className={DrawDetailInfoStyle.editTextArea} 
          onChange={this.textAreaChange.bind(this)}/>
        {/* <div style={{ textAlign: 'right'}}> */}
          {/*<div>*/}
            {/*<Checkbox style={{color: 'rgba(0,0,0, .8)', fontSize: 14, marginTop: 10 }} onChange={this.setEditIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>*/}
          {/*</div>*/}
          {/* <Button type={'primary'} style={{fontSize: 14, marginTop: 10 }} onClick={this.editSave.bind(this, board_id)}>保存</Button> */}
        {/* </div> */}
      </div>
    )
    return (
      <div ref="detail_wrapper">
        <div className={`${DrawDetailInfoStyle.detailInfoOut} ${globalsetStyles.global_vertical_scrollbar}`} onScrollCapture={(e) => { this.onScroll(e, board_id) }} >
          <div className={DrawDetailInfoStyle.brief}>
            <span className={`${globalsetStyles.authTheme} ${DrawDetailInfoStyle.icon} ${DrawDetailInfoStyle.brief_icon}`}>&#xe7f6;</span>
            <span>项目简介</span>
          </div>
          {!editDetaiDescription?(
              <div className={`${DrawDetailInfoStyle.Bottom} ${ defaultDescriptionVal != description && description != '' && DrawDetailInfoStyle.editColor}`} onClick={this.setEditDetaiDescriptionShow.bind(this)}>
                {description || detaiDescriptionValue}
              </div>
            ) : ( EditArea)}
            <div className={DrawDetailInfoStyle.member}> 
              <span style={{fontSize: 18}} className={`${globalsetStyles.authTheme} ${DrawDetailInfoStyle.icon}`}>&#xe7af;</span>
              <span>项目成员</span>
            </div>
            <div style={{display:'flex'}}>
              <div ref="manImageList" className={DrawDetailInfoStyle.manImageList}>
                {
                  checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_MEMBER) && (
                    <Tooltip title="邀请新成员" placement="top">
                      <div className={DrawDetailInfoStyle.addManImageItem} onClick={this.setShowAddMenberModalVisibile.bind(this)}>
                        <Icon type="plus" style={{color: '#8c8c8c', fontSize: 20, fontWeight: 'bold', marginTop: 8, color: '#40A9FF'}}/>
                      </div>
                    </Tooltip>
                    )
                }
                {
                  avatarList.map((value, key) => {
                    if(key < avatarList.length - 1) {
                      const { avatar, user_id } = value
                      return(
                        <div className={DrawDetailInfoStyle.manImageItem} key={ key }>
                          <Dropdown overlay={manImageDropdown(value)}>
                            {avatar?(<img src={avatar} />): (
                              <div style={{width: 40, height: 40, borderRadius: 40, backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                                <Icon type={'user'} style={{fontSize: 20, color: '#8c8c8c', marginTop: 9}}/>
                              </div>
                            )
                            }
                          </Dropdown>
                        </div>
                      )
                    }
                  })
                }
              </div>
              
              {
                avatarList && avatarList.length > 8 && is_show_dot && (
                  <Tooltip title="全部成员" placement="top">
                    <div 
                      onClick={ () => { this.handdleTriggerModal() } }
                      className={DrawDetailInfoStyle.show_member}></div>
                  </Tooltip>
                )
              }
            </div>
            <div className={DrawDetailInfoStyle.dynamic}>
              <div className={ DrawDetailInfoStyle.dy_title }>
                <div 
                  style={{width: '100%', display: 'flex', alignItems: 'center', display: dynamic_header_sticky ? 'none' : 'block'}} 
                  ref="dynamic_header"
                  className={DrawDetailInfoStyle.dynamic_header}>
                  <span className={`${globalsetStyles.authTheme} ${DrawDetailInfoStyle.icon}`}>&#xe60e;</span>
                  <span>项目动态</span>
                  <Tooltip title="过滤动态" placement="top">
                    <div className={DrawDetailInfoStyle.filter}>
                      <span className={`${globalsetStyles.authTheme} ${DrawDetailInfoStyle.icon}`}>&#xe7c7;</span>
                    </div>
                  </Tooltip>
                </div>
              </div>
              <div className={DrawDetailInfoStyle.dynamic_contain}>
                <DynamicContain {...this.props} board_id={board_id} getDispatchDynamicList={this.getDispatchDynamicList} />
              </div>
              <div style={{ textAlign: 'center', color:'rgba(0,0,0,0.45)', marginBottom: '15', display: is_show_more ? 'block' : 'none' }}>没有更多动态啦~</div>
            </div>
          <ShowAddMenberModal {...this.props} board_id = {board_id} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
        </div>
        <div style={{display: dynamic_header_sticky ? 'block' : 'none'}} className={DrawDetailInfoStyle.shadow}>
          <div 
            style={{width: '100%', display: 'flex', alignItems: 'center'}} 
            ref="dynamic_header"
            className={DrawDetailInfoStyle.dynamic_header}>
            <span className={`${globalsetStyles.authTheme} ${DrawDetailInfoStyle.icon}`}>&#xe60e;</span>
            <span>项目动态</span>
            <Tooltip title="过滤动态" placement="top">
              <div className={DrawDetailInfoStyle.filter}>
                <span className={`${globalsetStyles.authTheme} ${DrawDetailInfoStyle.icon}`}>&#xe7c7;</span>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    )
  }
}

