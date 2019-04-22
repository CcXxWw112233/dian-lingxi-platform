import React from 'react'
import { Icon, Layout, Menu, Dropdown} from 'antd';
import indexStyles from './index.less'
import glabalStyles from '../../../globalset/css/globalClassName.less'
import linxiLogo from '../../../assets/library/lingxi_logo.png'
import {checkIsHasPermission, currentNounPlanFilterName} from "../../../utils/businessFunction";
import {
  DASHBOARD, MEMBERS, ORG_UPMS_ORGANIZATION_EDIT, ORG_UPMS_ORGANIZATION_ROLE_CREATE,
  ORG_UPMS_ORGANIZATION_ROLE_EDIT, ORG_UPMS_ORGANIZATION_ROLE_DELETE, ORG_UPMS_ORGANIZATION_MEMBER_ADD,
  ORGANIZATION, PROJECTS, ORG_UPMS_ORGANIZATION_MEMBER_QUERY, MESSAGE_DURATION_TIME, NOT_HAS_PERMISION_COMFIRN
} from "../../../globalset/js/constant";
import Cookies from 'js-cookie'
import CreateOrganizationModal from '../components/HeaderNav/CreateOrganizationModal'
import ShowAddMenberModal from '../components/OrganizationMember/ShowAddMenberModal'
import {color_4} from "../../../globalset/js/styles";
import {message} from "antd/lib/index";

const { Sider } = Layout;

export default class SiderLeft extends React.Component {
  state={
    collapsed: true,
    createOrganizationVisable: false,
    ShowAddMenberModalVisibile: false,
  }
  componentDidMount() {
    // this.props.getMenuList()
  }
  setCollapsed(collapsed) {
    this.setState({
      collapsed: collapsed
    })
  }
  routingJump(route) {
    this.props.routingJump(route)
  }
  menuClick(key) {
    this.props.updateDatas({
      naviHeadTabIndex: key
    })
    let route
    switch (key) {
      case 0:
        route = 'workbench'
        break
      case 1:
        route = 'project'
        break
      case 2:
        window.open('https://www.di-an.com/zhichengshe')
        return
        break
      case 3:
        window.open('https://www.di-an.com/xiaocezhi')
        return
        break
      case 4:
        route='teamShow/teamList'
        break
      case 5:
        return
        break
      default:
        break
    }

    this.props.routingJump(`/technological/${route}`)
  }

  //创建或加入组织
  setCreateOrgnizationOModalVisable() {
    this.setState({
      createOrganizationVisable: !this.state.createOrganizationVisable
    })
  }

  //添加组织成员操作
  setShowAddMenberModalVisibile() {
    if(!checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    }
    this.setState({
      ShowAddMenberModalVisibile: !this.state.ShowAddMenberModalVisibile
    })
  }
  addMembers(data) {
    const { users } = data
    const { datas = {} } = this.props.model
    const { currentSelectOrganize = {} } = datas
    const { id } = currentSelectOrganize
    this.props.inviteJoinOrganization({
      members: users,
      org_id: id
    })
  }

  setCreateOrgnizationOModalVisable() {
    this.setState({
      createOrganizationVisable: !this.state.createOrganizationVisable
    })
  }
  handleOrgListMenuClick = (e) => {
    const { key } = e
    if('10' == key) {
      this.setCreateOrgnizationOModalVisable()
      return
    }
    const { datas: {currentUserOrganizes = []}} = this.props.model
    for(let val of currentUserOrganizes) {
      if(key === val['id']){
        Cookies.set('org_id', val.id, {expires: 30, path: ''})
        localStorage.setItem('currentSelectOrganize', JSON.stringify(val))
        this.props.updateDatas({currentSelectOrganize: val})
        this.props.changeCurrentOrg({org_id: val.id})
        break
      }
    }
  }

  //设置全局搜索
  setGlobalSearchModalVisible() {
    const { dispatch } = this.props
    dispatch({
      type: 'globalSearch/updateDatas',
      payload: {
        globalSearchModalVisible: true
      }
    })
  }
  render() {
    let temp = []
    this.props.model.datas.menuList && this.props.model.datas.menuList.forEach((item) => {
      if(item.status === '1') {
        temp.push(item)
      } 
    })
    let res = temp.reduce((r, c) => {
      let _c
      switch(c.name) {
        case '优秀案例':
          _c = {...c, theme: '&#xe65a;'}
          break
        case '政策法规':
          _c = { ...c, theme: '&#xe6c9;' }
          break
        case '我的展示':
          _c = {...c, theme: '&#xe60b;'}
          break
        case '投资地图':
          _c = { ...c,  theme: '&#xe676;'}
        default: 
          break
      }
      return [
        ...r,
        _c
      ]
    }, [])

    const { collapsed } = this.state
    const navArray = [
      {
        theme: '&#xe6f7;',
        name: currentNounPlanFilterName(DASHBOARD)
      },
      {
        theme: '&#xe60a;',
        name: currentNounPlanFilterName(PROJECTS)
      },
      ...res
    ]

    const { datas = {} } = this.props.model
    const { naviHeadTabIndex = {}, currentUserOrganizes = [], currentSelectOrganize = {} } = datas //currentUserOrganizes currentSelectOrganize组织列表和当前组织
    const { current_org={}, } = localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo')): {}
    const { identity_type } = current_org //是否访客 1不是 0是
    const orgnizationName = currentSelectOrganize.name || currentNounPlanFilterName(ORGANIZATION)
    const { logo } = currentSelectOrganize

    const orgListMenu = (
      <Menu onClick={this.handleOrgListMenuClick.bind(this)} selectable={true} style={{marginTop: -20}} >
        {currentUserOrganizes.map((value, key) => {
          const { name, id, identity_type } = value
          return (
            <Menu.Item key={id} >
              {name}
              {identity_type == '0'? (<span style={{display: 'inline-block', backgroundColor:'#e5e5e5', padding:'0 4px', borderRadius:40, marginLeft: 6}}>访客</span>) : ('')}
            </Menu.Item>
          )
        })}
        <Menu.Item key="10" >
          <div className={indexStyles.itemDiv} style={{ color: color_4}}>
            <Icon type="plus-circle" theme="outlined" style={{margin: 0, fontSize: 16}}/> 创建或加入新{currentNounPlanFilterName(ORGANIZATION)}
          </div>
        </Menu.Item>
      </Menu>
    )

    //是否拥有管理后台入口
    const isHasManagerBack = () => {
      let flag = false
      if(
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_EDIT) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_CREATE) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_EDIT) ||
        checkIsHasPermission(ORG_UPMS_ORGANIZATION_ROLE_DELETE)
      ) {
        flag = true
      }
      return flag
    }

    //是否拥有查看成员入口
    const isHasMemberView = () => {
      return checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_QUERY)
    }

    return (
      <Sider
        trigger={null}
        collapsible
        onMouseOver={this.setCollapsed.bind(this, false)}
        onMouseOut={this.setCollapsed.bind(this, true)}
        className={`${indexStyles.siderLeft} ${collapsed?indexStyles.siderLeft_state_min:indexStyles.siderLeft_state_exp}`} collapsedWidth={64} width={260} theme={'light'} collapsed={collapsed}
      >
        <div className={indexStyles.contain_1}>
          <div className={indexStyles.left}>
            <img src={logo || linxiLogo} className={indexStyles.left_img}/>
          </div>
          <div className={indexStyles.middle}>
            <div className={indexStyles.middle_top}>{orgnizationName}</div>
            {identity_type == '1'? (
              <div className={indexStyles.middle_bott}>
                {isHasMemberView() && (
                  <div onClick={this.routingJump.bind(this, '/technological/organizationMember')}>{currentNounPlanFilterName(MEMBERS)}</div>
                )}
                {isHasManagerBack() && (
                  <div onClick={this.routingJump.bind(this, `/organization?nextpath=${window.location.hash.replace('#', '')}`)} >管理后台</div>
                )}
                {checkIsHasPermission(ORG_UPMS_ORGANIZATION_MEMBER_ADD) && <div onClick={this.setShowAddMenberModalVisibile.bind(this)}>邀请加入</div>}
            </div>
            ) : (
              identity_type=='0'?(
                <div className={indexStyles.middle_bott}>
                  访客
                </div>
                ):('')
            )}

          </div>
          <Dropdown overlay={orgListMenu}>
          <div className={`${indexStyles.right} ${glabalStyles.link_mouse}`}>
            切换
          </div>
          </Dropdown>
        </div>

        <div className={indexStyles.contain_2}>
          <div className={`${indexStyles.navItem}`} onClick={this.setGlobalSearchModalVisible.bind(this)} >
            <div className={`${glabalStyles.authTheme} ${indexStyles.navItem_left}`}>&#xe611;</div>
            <div className={indexStyles.navItem_right}> 搜索</div>
          </div>
        </div>

        <div className={indexStyles.contain_2}>
          {navArray.map((value, key) => {
            const { theme, name } = value
            return (
              <div key={key} className={`${indexStyles.navItem} ${key== naviHeadTabIndex?indexStyles.navItemSelected: ''}`} onClick={this.menuClick.bind(this, key)}>
                <div className={`${glabalStyles.authTheme} ${indexStyles.navItem_left}`} dangerouslySetInnerHTML={{__html: theme}}></div>
                <div className={indexStyles.navItem_right}> {name}</div>
              </div>
            )
          })}
        </div>

        <CreateOrganizationModal {...this.props} createOrganizationVisable={this.state.createOrganizationVisable} setCreateOrgnizationOModalVisable={this.setCreateOrgnizationOModalVisable.bind(this)}/>

        <ShowAddMenberModal {...this.props} addMembers={this.addMembers.bind(this)} modalVisible={this.state.ShowAddMenberModalVisibile} setShowAddMenberModalVisibile={this.setShowAddMenberModalVisibile.bind(this)}/>


      </Sider>

    )
  }
}
