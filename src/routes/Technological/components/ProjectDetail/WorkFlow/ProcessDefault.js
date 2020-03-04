import React, { Component } from 'react'
import indexStyles from './index.less'
import TemplateContent from './component/TemplateContent'
import PagingnationContent from './component/PagingnationContent'
import { Tabs } from 'antd';

const changeClientHeight = () => {
  const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
  return clientHeight
}
const TabPane = Tabs.TabPane
export default class ProcessDefault extends Component {
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

  renderFlowTabs = () => {
    const { clientHeight } = this.state
    const { processDoingList = [], processStopedList = [], processComepletedList = [] } = this.props
    return (
      <Tabs defaultActiveKey="1" onChange={this.tabsChange} tabBarStyle={{ width: '100%', paddingTop: 0, fontSize: 16, background: 'rgba(216,216,216,0)' }}>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>进行中的流程 </div>} key="1">{<PagingnationContent listData={processDoingList} status={'1'} clientHeight={clientHeight} />}</TabPane>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>已中止的流程 </div>} key="2">{<PagingnationContent listData={processStopedList} status={'2'} clientHeight={clientHeight} />}</TabPane>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>已完成的流程 </div>} key="3">{<PagingnationContent listData={processComepletedList} status={'3'} clientHeight={clientHeight} />}</TabPane>
        <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>未开始的流程 </div>} key="4">{<PagingnationContent listData={processComepletedList} status={'3'} clientHeight={clientHeight} />}</TabPane>
      </Tabs>
    )
  }

  render() {
    const { clientHeight } = this.state
    return (
      <div className={indexStyles.processDefautOut}>
        <div className={indexStyles.processDefautOut_top}>
          <div className={indexStyles.title}>模板:</div>
          <TemplateContent />
        </div>
        {/*右方流程*/}
        <div className={indexStyles.processDefautOut_bottom}>
          {this.renderFlowTabs()}
        </div>
      </div>
    )
  }
}
