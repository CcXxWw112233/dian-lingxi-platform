import React, { Component } from 'react'
import { Input, Dropdown, Menu, Icon, Tooltip, Select, Spin, Modal } from 'antd'
import DrawDetailInfoStyle from './DrawDetailInfo.less'
import {checkIsHasPermissionInBoard, isHasOrgMemberQueryPermission} from "@/utils/businessFunction";
import NoPermissionUserCard from '@/components/NoPermissionUserCard/index'
import {
  MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN,
  PROJECT_TEAM_BOARD_EDIT, PROJECT_TEAM_BOARD_MEMBER
} from "@/globalset/js/constant";
import ShowAddMenberModal from '../../Project/ShowAddMenberModal'

export default class DetailMember extends Component {

   constructor(props) {
     super(props)
     this.state = {
       inputVal: '', 
       fetching: false,
       ShowAddMenberModalVisibile: false, 
     }
   }

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

  // 设置成员角色
  handleSetRoleMenuClick(props, { key }) {
    console.log(this.props, 'ssssss')
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

  // 出现移除的confirm
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

   // 输入框搜索
   handleChange(value) {
    this.setState({
      inputVal: value,
      fetching: true
    })
   }


  render() {
    const { inputVal, fetching } = this.state
    const {datas: { projectDetailInfoData = {} } } = this.props.model
    let { board_id, board_name, data = [], projectRoles = []} = projectDetailInfoData //data是参与人列表
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
            <div className={DrawDetailInfoStyle.detailItem}>
              <div>邮箱：</div>
              <div>{email}</div>
            </div>
            <div className={DrawDetailInfoStyle.detailItem}>
              <div>手机：</div>
              <div>{mobile}</div>
            </div>
          </div>
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

    return (
      <div style={{minHeight: 600}}>
        <div className={DrawDetailInfoStyle.input_search}>
          {/* <span className={DrawDetailInfoStyle.search_icon}><Icon type="search" /></span> */}
          <Select
            className={DrawDetailInfoStyle.select_search}
            placeholder="搜索成员"
            showArrow={false}
            showSearch={true}
            // value={inputVal}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={(value) => { this.handleChange(value) } }
            // onChange={ (value) => { this.handleChange(value) } }
            style={{ width: '100%', position: 'relative', cursor:'pointer'}}
          >
          </Select>
        </div>
        <div className={`${DrawDetailInfoStyle.manImageList} ${DrawDetailInfoStyle.detail_member}`}>
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
                  <div className={`${DrawDetailInfoStyle.manImageItem}`} key={ key }>
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
        <ShowAddMenberModal {...this.props} board_id = {board_id} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>
      </div>
    )
  }
}
