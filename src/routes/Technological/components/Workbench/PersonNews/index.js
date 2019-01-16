import React from 'react'
import indexStyles from './index.less'
import { Avatar, Modal, Menu, Dropdown, Icon} from 'antd'
import {color_4, min_page_width} from '../../../../../globalset/js/styles'
import {currentNounPlanFilterName} from "../../../../../utils/businessFunction";
import {ORGANIZATION} from "../../../../../globalset/js/constant";
import Cookies from 'js-cookie'
import CreateOrganizationModal from '../../HeaderNav/CreateOrganizationModal'

export default class PersonNews extends React.Component {

  state = {
    createOrganizationVisable: false,
    width: document.getElementById('technologicalOut').clientWidth - 20
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY.bind(this,'person_news_out'))
  }
  resizeTTY(type) {
    const width = document.getElementById('technologicalOut').clientWidth;//获取页面可见高度
    this.setState({
      width
    })
  }

  routingJump(route) {
    this.props.routingJump('')
  }
  logout(e) {
    e.stopPropagation()
    const that = this;
    Modal.confirm({
      title: '确定退出登录？',
      okText: '确认',
      zIndex: 2000,
      onOk: that.props.logout,
      cancelText: '取消',
    });

  }

  //创建或加入组织
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
        Cookies.set('org_id',val.id,{expires: 30, path: ''})
        localStorage.setItem('currentSelectOrganize', JSON.stringify(val))
        this.props.updateDatas({currentSelectOrganize: val})
        this.props.changeCurrentOrg({org_id: val.id})
        break
      }
    }
  }
  render(){
    const { width } = this.state
    const transWidth = width < min_page_width ? min_page_width : width
    const avatar = 'http://dian-lingxi-public.oss-cn-beijing.aliyuncs.com/2018-11-13/172f2c924443a267cea532150e76d344.jpg'

    const { datas = {} } = this.props.model
    const {  currentUserOrganizes = [] , currentSelectOrganize = {} } = datas //currentUserOrganizes currentSelectOrganize组织列表和当前组织
    const { current_org={},name} = Cookies.get('userInfo')? JSON.parse(Cookies.get('userInfo')): {}
    const { identity_type } = current_org //是否访客 1不是 0是
    const orgnizationName = currentSelectOrganize.name || currentNounPlanFilterName(ORGANIZATION)

    const orgListMenu = (
      <Menu onClick={this.handleOrgListMenuClick.bind(this)} selectable={true} >
        {currentUserOrganizes.map((value, key) => {
          const { name, id } = value
          return (
            <Menu.Item key={id} >
              {name}
            </Menu.Item>
          )
        })}
        <Menu.Item key="10" >
          <div className={indexStyles.itemDiv} style={{ color: color_4}}>
            <Icon type="plus-circle" theme="outlined"  style={{margin: 0, fontSize: 16}}/> 创建或加入新{currentNounPlanFilterName(ORGANIZATION)}
          </div>
        </Menu.Item>
      </Menu>
    )

    return (
      <div className={indexStyles.person_news_out} style={{width: transWidth}}>
        <div className={indexStyles.contain1}>
          <div className={indexStyles.contain1_one}>
            <Avatar size={32} src={avatar}>u</Avatar>
          </div>
          <Dropdown overlay={orgListMenu}>
          <div className={indexStyles.contain1_one}>
            您好,{orgnizationName}
          </div>
          </Dropdown>
          <div className={indexStyles.contain1_one} onClick={() => { this.props.routingJump('/technological/accoutSet')}}>
            {name}
          </div>
          <div className={indexStyles.contain1_one} onClick={this.logout.bind(this)}>
            退出
          </div>
        </div>
        <CreateOrganizationModal {...this.props} createOrganizationVisable={this.state.createOrganizationVisable} setCreateOrgnizationOModalVisable={this.setCreateOrgnizationOModalVisable.bind(this)}/>

      </div>
    )
  }



}
