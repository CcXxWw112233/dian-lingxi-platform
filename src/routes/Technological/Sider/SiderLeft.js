import React from 'react'
import { Icon, Layout, Menu, Dropdown} from 'antd';
import indexStyles from './index.less'
import glabalStyles from '../../../globalset/css/globalClassName.less'
import linxiLogo from '../../../assets/library/lingxi_logo.png'
import { currentNounPlanFilterName } from "../../../utils/businessFunction";
import {
  DASHBOARD, MEMBERS,
  ORGANIZATION, PROJECTS
} from "../../../globalset/js/constant";
import Cookies from 'js-cookie'
import CreateOrganizationModal from '../components/HeaderNav/CreateOrganizationModal'
import ShowAddMenberModal from '../components/OrganizationMember/ShowAddMenberModal'
import {color_4} from "../../../globalset/js/styles";

const { Sider } = Layout;

export default class SiderLeft extends React.Component {
  state={
    collapsed: true,
    createOrganizationVisable: false,
    ShowAddMenberModalVisibile: false,
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


  render() {
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
      {
        theme: '&#xe65a;',
        name: '优秀案例'
      },
      {
        theme: '&#xe6c9;',
        name: '政策法规'
      },
      {
        theme: '&#xe60b;',
        name: '我的展示'
      },
      {
        theme: '&#xe676;',
        name: '投资地图'
      },
    ]

    const { datas = {} } = this.props.model
    const { naviHeadTabIndex = {}, currentUserOrganizes = [], currentSelectOrganize = {} } = datas //currentUserOrganizes currentSelectOrganize组织列表和当前组织
    const { current_org={}, } = Cookies.get('userInfo')? JSON.parse(Cookies.get('userInfo')): {}
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
              <div onClick={this.routingJump.bind(this, '/technological/organizationMember')}>{currentNounPlanFilterName(MEMBERS)}</div>
              <div onClick={this.routingJump.bind(this, `/organization?nextpath=${window.location.hash.replace('#', '')}`)} >管理后台</div>
              <div onClick={this.setShowAddMenberModalVisibile.bind(this)}>邀请加入</div>
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
