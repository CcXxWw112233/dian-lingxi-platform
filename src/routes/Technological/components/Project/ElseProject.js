import React from 'react'
import indexStyle from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Icon, Menu, Dropdown, Tooltip, Collapse, Card, Modal, Checkbox, Form, message } from 'antd'
import detailInfoStyle from '../ProjectDetail/DetailInfo/DetailInfo.less'
import ShowAddMenberModal from './ShowAddMenberModal'
import SearchTreeModal from './components/SearchTreeModal'
import NoPermissionUserCard from './../../../../components/NoPermissionUserCard/index'
import Cookies from 'js-cookie'
import {connect} from 'dva'
import {
  checkIsHasPermission, checkIsHasPermissionInBoard,
  currentNounPlanFilterName, setStorage,
  isHasOrgMemberQueryPermission
} from "../../../../utils/businessFunction";
import {
  MEMBERS,
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  ORG_TEAM_BOARD_QUERY, PROJECTS, TASKS, PROJECT_TEAM_BOARD_DELETE
} from "../../../../globalset/js/constant";


let is_starinit = null

@connect(({}) => ({}))
class ElseProject extends React.Component{
  state = {
    ShowAddMenberModalVisibile: false,
    starOpacity: 0.6,
    isInitEntry: true,
    isCollection: false,
    isSoundsEvrybody: false,
    ellipsisShow: false, //是否出现...菜单
    dropdownVisibleChangeValue: false, //是否出现...菜单辅助判断标志
    removePojectToGroupModalVisible: false,
  }

  //出现confirm-------------start
  setIsSoundsEvrybody(e){
    this.setState({
      isSoundsEvrybody: e.target.checked
    })
  }
  confirm(board_id ) {
    const that = this
    Modal.confirm({
      title: `确认要退出该${currentNounPlanFilterName(PROJECTS)}吗？`,
      content: <div style={{color: 'rgba(0,0,0, .8)', fontSize: 14}}>
                  <span >退出后将无法获取该{currentNounPlanFilterName(PROJECTS)}的相关动态</span>
                  {/*<div style={{marginTop:20,}}>*/}
                    {/*<Checkbox style={{color:'rgba(0,0,0, .8)',fontSize: 14, }} onChange={this.setIsSoundsEvrybody.bind(this)}>通知项目所有参与人</Checkbox>*/}
                  {/*</div>*/}
               </div>,
      okText: '确认',
      cancelText: '取消',
      onOk() {
         that.props.quitProject({board_id})
      }
    });
  }
  confirm_2(board_id, type) {
    const that = this
    let defineNoun = '操作'
    switch (type){
      case '0':
        if(!checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_DELETE)){
          message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
          return false
        }
        defineNoun='删除'
        break
      case '1':
        defineNoun='归档'
        break
      default:
        break
    }
    Modal.confirm({
      title: `确认要${defineNoun}该${currentNounPlanFilterName(PROJECTS)}吗？`,
      zIndex: 2000,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        if(type ==='1'){
          that.props.archivedProject({board_id, is_archived: '1'})
        }else if(type === '0') {
          that.props.deleteProject(board_id)
        }
      }
    });
  }

  //出现confirm-------------end
  //添加项目组成员操作
  setShowAddMenberModalVisibile() {
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }

  //菜单按钮点击
  handleMenuClick(board_id, e ) {
    e.domEvent.stopPropagation();
    if(!checkIsHasPermission(ORG_TEAM_BOARD_QUERY)){
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    this.setState({
      ellipsisShow: false,
      dropdownVisibleChangeValue: false
    })
    const { key } = e
    switch (key) {
      case '1':
        this.setShowAddMenberModalVisibile()
        break
      case '2':
        this.props.archivedProject({board_id, is_archived: '1'})
        break
      case '3':
        this.confirm_2(board_id, '0')
        // this.props.deleteProject(board_id)
        break
      case '4':
        this.confirm(board_id )
        break
      case 'remove':
        this.handleToggleRemoveProjectModalVisible(true)
        break
      default:
        return
    }
  }

  //项目列表点击---------------------
  //星星样式变化start----------------
  starMouseOver() {
    if(this.state.starType === 'star'){
      return false
    }
    this.setState({
      starType: 'star-o',
      starOpacity: 1
    })
  }
  starMouseLeave() {
    if(this.state.starType === 'star'){
      return false
    }
    this.setState({
      starType: 'star-o',
      starOpacity: 0.6
    })
  }
  starClick(id, e) {
    e.stopPropagation();
    const { itemDetailInfo = {}, dispatch} = this.props
    const { is_star } = itemDetailInfo
    this.setState({
      isInitEntry: false,
    }, function () {
      this.setState({
        isCollection: is_starinit === '1' ? false : this.state.isInitEntry ? false : !this.state.isCollection,
        starOpacity: 1
      }, function () {
        if(this.state.isCollection) {
          this.props.collectionProject(id)
        }else{
          this.props.cancelCollection(id)
        }
      })
    })
  }
  starClickNew(id, type, e) {

  }
  //星星样式变化end--------------

  //...菜单变化点击
  ellipsisClick(e) {
    e.stopPropagation();
  }
  setEllipsisShow() {
    this.setState({
      ellipsisShow: true
    })
  }
  setEllipsisHide() {
    this.setState({
      ellipsisShow: false
    })
  }
  onDropdownVisibleChange(visible){
    const { itemDetailInfo = {}} = this.props
    const { board_id} = itemDetailInfo
    setStorage('board_id', board_id)
    this.setState({
      dropdownVisibleChangeValue: visible,
    })
  }
  projectListItemClick(route, board_id, a) {
    //暂时去掉访客限制
    // if(!checkIsHasPermission(ORG_TEAM_BOARD_QUERY)){
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return false
    // }
    Cookies.set('board_id', board_id, {expires: 30, path: ''})
    this.props.routingJump(`${route}?board_id=${board_id}`)
  }
  handleRemoveProjectToGroupModalCancel = () => {
    this.shutRemoveProjectToGroupModal()
  }
  shutRemoveProjectToGroupModal = () => {
    this.setState({
      removePojectToGroupModalVisible: false
    })
  }
  handleRemoveProjectToGroupModalOk = group_id => {
    const { itemDetailInfo: {board_id = null} = {}} = this.props
    if(!board_id) {
      message.error('没有获取到当前项目的 id')
      return
    }
    const {dispatch} = this.props
    Promise.resolve(dispatch({
      type: 'project/moveProjectToProjectGroup',
      payload: {
        board_id,
        group_id
      }
    })).then(res => {
      if(res === 'error') {
        message.error('移动项目失败')
        return
      }
      message.success('移动项目成功')
      this.shutRemoveProjectToGroupModal()
    })
  }
  handleOpenRemoveProjectModal = () => {
    const {dispatch} = this.props
    Promise.resolve(dispatch({
      type: 'project/fetchProjectGroupSearchTree'
    })).then(res => {
      if(res === 'error') {
        message.error('获取项目分组信息失败')
        return
      }
      this.setState({
        removePojectToGroupModalVisible: true,
      })
    })
  }
  handleToggleRemoveProjectModalVisible = (flag) => {

    //如果是打开移动项目 modal
    if(flag) {
      return this.handleOpenRemoveProjectModal()
    }
    this.setState({
      removePojectToGroupModalVisible: flag,
    })
  }
  render() {

    const { starType, starOpacity, ellipsisShow, dropdownVisibleChangeValue, isInitEntry, isCollection, removePojectToGroupModalVisible, ShowAddMenberModalVisibile } = this.state
    const { itemDetailInfo = {}} = this.props
    const { data = [], board_id, board_name, is_star, user_count, is_create, residue_quantity, realize_quantity } = itemDetailInfo // data为项目参与人信息

    is_starinit = is_star

    const userInfo = localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo')): {}
    const user_id = userInfo['id']
    let cunrentUserIsInThisBoard = false //当前用户是否在当前项目里
    for(let val of data) {
      if(user_id == val['user_id']) {
        cunrentUserIsInThisBoard = true
        break
      }
    }

    const menu = (board_id) => {
      return (
        <Menu onClick={this.handleMenuClick.bind(this, board_id)}>
          {cunrentUserIsInThisBoard && (
            <Menu.Item key={'1'} style={{textAlign: 'center', padding: 0, margin: 0}}>
              <div className={indexStyle.elseProjectMemu}>
                邀请{currentNounPlanFilterName(MEMBERS)}加入
              </div>
           </Menu.Item>)}

          <Menu.Item key={'remove'} style={{textAlign: 'center', padding: 0, margin: 0}}>
          <div className={indexStyle.elseProjectMemu}>
              移动到
            </div>
          </Menu.Item>
          {/*<Menu.Item key={'2'} style={{textAlign: 'center',padding:0,margin: 0}}>*/}
            {/*<div className={indexStyle.elseProjectMemu}>*/}
              {/*{currentNounPlanFilterName(PROJECTS)}归档*/}
            {/*</div>*/}
          {/*</Menu.Item>*/}
          {checkIsHasPermissionInBoard(PROJECT_TEAM_BOARD_DELETE) && (
            <Menu.Item key={'3'} style={{textAlign: 'center', padding: 0, margin: 0}}>
              <div className={indexStyle.elseProjectMemu}>
                删除{currentNounPlanFilterName(PROJECTS)}
              </div>
            </Menu.Item>
          )}
          {is_create !== '1' && cunrentUserIsInThisBoard? (
            <Menu.Item key={'4'} style={{textAlign: 'center', padding: 0, margin: 0}}>
              <div className={indexStyle.elseProjectDangerMenu}>
                退出{currentNounPlanFilterName(PROJECTS)}
              </div>
            </Menu.Item>
          ) : ('')}
        </Menu>
      );
    }
    const manImageDropdown = (props) =>{
      const { avatar, email, name: full_name, mobile, role_name, user_id, user_name, we_chat = '无' } = props
      if(!isHasOrgMemberQueryPermission()) {
        return <NoPermissionUserCard avatar={avatar} full_name={full_name} />
      }
      return (
        <div className={detailInfoStyle.manImageDropdown}>
          <div className={detailInfoStyle.manImageDropdown_top}>
            <div className={detailInfoStyle.left}>
              {avatar ? (<img src={avatar} alt='' />) : (
                <div style={{backgroundColor: '#f2f2f2', textAlign: 'center', width: 32, height: 32, borderRadius: 32}}>
                  <Icon type={'user'} style={{color: '#8c8c8c', fontSize: 20, marginTop: 6}}/>
                </div>
              )}
            </div>
            <div className={detailInfoStyle.right}>
              <div className={detailInfoStyle.name}>{full_name || '佚名'}</div>
              <Tooltip title="该功能即将上线">
                <div className={detailInfoStyle.percent}>
                  <div style={{width: '0'}}></div>
                  <div style={{width: '0'}}></div>
                  <div style={{width: '100%'}}></div>
                </div>
              </Tooltip>
            </div>
          </div>
          <div className={detailInfoStyle.manImageDropdown_middle}>
            {/* <div className={detailInfoStyle.detailItem}>
              <div>姓名：</div>
              <div>{full_name}</div>
            </div> */}
            <div className={detailInfoStyle.detailItem}>
              <div>职位：</div>
              <div>{role_name ? role_name : '无'}</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>邮箱：</div>
              <div>{email}</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>手机：</div>
              <div>{mobile}</div>
            </div>
            <div className={detailInfoStyle.detailItem}>
              <div>微信：</div>
              <div>{we_chat || '无'}</div>
            </div>
          </div>
          {/*<div className={detailInfoStyle.manImageDropdown_bott}>*/}
            {/*<img src="" />*/}
          {/*</div>*/}
        </div>
      )
    }

    const cancelStarProjet = (
      <i className={globalStyles.authTheme}
         onMouseOver={this.starMouseOver.bind(this)}
         onMouseLeave={this.starMouseLeave.bind(this)}
         onClick={this.starClick.bind(this, board_id)}
         style={{margin: '0 0 0 8px', opacity: starOpacity, color: '#FAAD14 ', fontSize: 16}}>&#xe70e;</i>
    )
    const starProject = (
      <i className={globalStyles.authTheme}
         onMouseOver={this.starMouseOver.bind(this)}
         onMouseLeave={this.starMouseLeave.bind(this)}
         onClick={this.starClick.bind(this, board_id)}
         style={{margin: '0 0 0 8px', opacity: starOpacity, color: '#FAAD14 ', fontSize: 16}}>&#xe6f8;</i>
    )
    return (
      <div>
        <Card style={{position: 'relative', height: 'auto', marginTop: 20}}>
          <div className={indexStyle.listOutmask}></div>
          <div className={indexStyle.listOut} onClick={this.projectListItemClick.bind(this, `/technological/projectDetail`, board_id)}>
            <div className={indexStyle.left}>
              <div className = {indexStyle.top} onMouseLeave={this.setEllipsisHide.bind(this)} onMouseOver={this.setEllipsisShow.bind(this)}>
                <span>{board_name}</span>
                <span className={indexStyle.nameHoverMenu} >
                  {isInitEntry ? (is_star === '1'? (starProject):(cancelStarProjet)):(isCollection? (starProject):(cancelStarProjet))}
                  {/*<Icon className={indexStyle.star}*/}
                        {/*onMouseOver={this.starMouseOver.bind(this)}*/}
                        {/*onMouseLeave={this.starMouseLeave.bind(this)}*/}
                        {/*onClick={this.starClick.bind(this, board_id)}*/}
                        {/*type={isInitEntry ? (is_star === '1'? 'star':'star-o'):(isCollection? 'star':'star-o')} style={{margin: '0 0 0 8px',opacity: starOpacity,color: '#FAAD14 '}} />*/}
                    <Dropdown overlay={menu(board_id)} trigger={['click']} onVisibleChange={this.onDropdownVisibleChange.bind(this)}>
                      <Icon type="ellipsis" style={{ padding: '2px', fontSize: 18, margin: '0 0 0 8px', display: (ellipsisShow || dropdownVisibleChangeValue) ? 'inline-block': 'none'}} onClick={this.ellipsisClick}/>
                    </Dropdown>
                </span>
              </div>
              <div className ={indexStyle.bottom}>
                {data.map((value, key) => {
                  const { avatar, email, full_name, mobile, user_id, user_name } = value
                  if(key < 7) {
                    return (
                      <Dropdown overlay={manImageDropdown(value)} key={key}>
                        {avatar? (
                          <img src={avatar} alt='' key={key} className={indexStyle.taskManImag}></img>
                        ):(
                          <div className={indexStyle.taskManImag} style={{backgroundColor: '#f2f2f2', textAlign: 'center'}}>
                            <Icon type={'user'} style={{color: '#8c8c8c'}}/>
                          </div>
                        )
                        }
                      </Dropdown>
                    )
                  }
                })}
                {data.length > 7? (
                  <div style={{display: 'flex', fontSize: 12}}>
                    <div className={indexStyle.manwrap} ><Icon type="ellipsis" style={{fontSize: 18}}/></div>{user_count}位任务执行人
                  </div>
                ) : ('')}
              </div>
            </div>
            <div className={indexStyle.right}>
              <div className={indexStyle.rightItem}>
                <div>{residue_quantity || '0'}</div>
                <div>剩余{currentNounPlanFilterName(TASKS)}</div>
              </div>
              <div className={indexStyle.rightItem}>
                <div style={{color: '#8c8c8c'}}>{realize_quantity || '0'}</div>
                <div>已完成</div>
              </div>
              {/*<div className={indexStyle.rightItem}>*/}
                {/*<div >0</div>*/}
                {/*<div>距离下一节点</div>*/}
              {/*</div>*/}
            </div>
          </div>
        </Card>
        {ShowAddMenberModalVisibile && <ShowAddMenberModal {...this.props} board_id = {board_id} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>}
        {removePojectToGroupModalVisible && (
          <SearchTreeModal
            visible={removePojectToGroupModalVisible}
            onOk={this.handleRemoveProjectToGroupModalOk}
            onCancel={this.handleRemoveProjectToGroupModalCancel}
          />
        )}
      </div>
    )
  }
}

export default ElseProject
