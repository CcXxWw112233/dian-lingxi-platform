import React from 'react'
import indexStyles from './index.less'
import { Button, Icon, Input, Dropdown, Menu, Avatar, Tabs } from 'antd'
import MenuSearchStyles from '../../TecPublic/MenuSearch.less'
import MenuSearchTemplate from './MenuSearchTemplate'
import {ORGANIZATION, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP} from "../../../../../globalset/js/constant";
import {currentNounPlanFilterName} from "../../../../../utils/businessFunction";
import globalStyles from '../../../../../globalset/css/globalClassName.less'
import PagingnationContent from './component/ProcessDefault/PagingnationContent'
import TemplateContent from './component/ProcessDefault/TemplateContent'
import { Collapse } from 'antd';
const Panel = Collapse.Panel;
const TabPane = Tabs.TabPane

const changeClientHeight = () => {
  const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
  return clientHeight
}

export default class ProcessDefault extends React.Component {
  state = {
    clientHeight: changeClientHeight()
  }
  constructor() {
    super()
    this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }
  resizeTTY = () => {
    const clientHeight = changeClientHeight();//获取页面可见高度
    this.setState({
      clientHeight
    })
  }
  handleMenuReallyClick = (e) => {
    const { key } = e
    if(!key) {
      return false
    }
    const { datas: { processTemplateList = [] } } = this.props.model
    const { template_name, template_id, template_no } = processTemplateList[Number(key)]
    //此处为启动流程界面查询逻辑(查询模板信息)
    this.props.getTemplateInfo && this.props.getTemplateInfo(template_id)
  }
  startEdit() {
    this.props.updateDatasProcess({
      processPageFlagStep: '2'
    })
  }
  tabsChange() {

  }

  render() {
    const { clientHeight } = this.state
    const data = [1, 2, 3, 4]
    const allStep = new Array(20)
    const flowTabs = () => {
      return (
        <Tabs defaultActiveKey="1" onChange={this.tabsChange.bind(this)} tabBarStyle={{marginLeft: 26, width: '100%', maxWidth: 1100}}>
          <TabPane tab="进行中 12" key="1">{<PagingnationContent clientHeight={clientHeight}/>}</TabPane>
          <TabPane tab="已终止 12" key="2">{1}</TabPane>
          <TabPane tab="已完成 12" key="3">{2}</TabPane>
        </Tabs>

      )
    }
    const PanelHeader = (value) => {
      return (
        <div className={indexStyles.panelHead}>
          <div className={`${indexStyles.panelHead_l} ${globalStyles.authTheme}`}>&#xe605;</div>
          <div className={indexStyles.panelHead_m}>
            <div className={indexStyles.panelHead_m_l}>流程实例名称</div>
            <div className={indexStyles.panelHead_m_r}>当前步骤名称</div>
          </div>
          <div className={indexStyles.panelHead_r}>
            <div className={indexStyles.panelHead_r_l}>||||||||||||||||||||</div>
            <div className={indexStyles.panelHead_r_m}>30%</div>
            <div className={indexStyles.panelHead_r_r}>
              <Avatar size="small" icon="user" />
            </div>
          </div>
        </div>
      )
    }
    const RightCollapse = (
      <Collapse
        bordered={false}
        style={{backgroundColor: '#f5f5f5', marginTop: 4}}
      >
        {data.map((value, key) => {
          return (
            <Panel header={PanelHeader()} key={key} style={customPanelStyle}></Panel>
          )
        })}
      </Collapse>
    )

    return (
      <div className={indexStyles.processDefautOut}>
        <div className={indexStyles.processDefautOut_left}>
          <div className={indexStyles.title}>模板</div>
          <TemplateContent clientHeight = {clientHeight}/>
        </div>
        {/*右方流程*/}
        <div className={indexStyles.processDefautOut_right}>
          {/*<div className={indexStyles.title}>进行中<span className={indexStyles.count}>12</span></div>*/}
          {flowTabs()}
          {/*{RightCollapse}*/}
        </div>
      </div>
    )
  }
}
const customPanelStyle = {
  background: '#f5f5f5',
  borderRadius: 4,
  fontSize: 16,
  border: 0,
  marginLeft: 10,
  overflow: 'hidden',
};
