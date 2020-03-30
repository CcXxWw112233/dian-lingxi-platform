import React, { Component } from 'react'
import indexStyles from './index.less'
import TemplateContent from './component/TemplateContent'
import PagingnationContent from './component/PagingnationContent'
import { Tabs } from 'antd';
import { connect } from 'dva'
import ProcessDetailModal from '../../../../../components/ProcessDetailModal'
import { showDeleteTempleteConfirm } from '../../../../../components/ProcessDetailModal/components/handleOperateModal';

const changeClientHeight = () => {
  const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
  return clientHeight
}
const TabPane = Tabs.TabPane
@connect(mapStateToProps)
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

  // 新增模板点击事件
  handleAddTemplate = () => {
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processPageFlagStep: '1',
        process_detail_modal_visible: true
      }
    })
  }

  // 编辑模板的点击事件
  handleEditTemplete = (item) => {
    const { id, template_no } = item
    this.props.dispatch({
      type: 'publicProcessDetailModal/getTemplateInfo',
      payload: {
        id,
        processPageFlagStep: '2',
        currentTempleteIdentifyId: template_no,
        process_detail_modal_visible: true
      }
    })
  }

  // 启动流程的点击事件
  handleStartProcess = (item) => {
    const { id } = item
    this.props.dispatch({
      type: 'publicProcessDetailModal/getTemplateInfo',
      payload: {
        id,
        processPageFlagStep: '3',
        process_detail_modal_visible: true
      }
    })
  }

  // 删除流程模板的点击事件
  handleDelteTemplete = (item) => {
    const { projectDetailInfoData: { board_id } } = this.props
    const { id } = item
    const processTempleteDelete = async () => {
      await this.props.dispatch({
        type: 'publicProcessDetailModal/deleteProcessTemplete',
        payload: {
          id,
          board_id
        }
      })
    }
    showDeleteTempleteConfirm(processTempleteDelete)
  }

  // 流程实例的点击事件
  handleProcessInfo = (id) => {
    let that = this
    this.props.dispatch({
      type: 'publicProcessDetailModal/getProcessInfo',
      payload: {
        id,
        calback: () => {
          that.props.dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              processPageFlagStep: '4',
              process_detail_modal_visible: true,
            }
          })
        }
      }
    })
  }

  tabsChange = (key) => {
    const { projectDetailInfoData: { board_id } } = this.props
    // this.props.dispatch({
    //   type: 'publicProcessDetailModal/getProcessListByType',
    //   payload: {
    //     status: key,
    //     board_id
    //   }
    // })
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        currentFlowTabsStatus: key
      }
    })
  }

  renderFlowTabs = () => {
    const { clientHeight } = this.state
    const { processDoingList = [], processStopedList = [], processComepletedList = [], processNotBeginningList = [] } = this.props
    return (
      <div>
        <Tabs defaultActiveKey="1" onChange={this.tabsChange} tabBarStyle={{ width: '100%', paddingTop: 0, fontSize: 16, background: 'rgba(216,216,216,0)', border: '1px solid #e8e8e8', padding: '0 46px 0 50px' }}>
          <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>进行中的流程 </div>} key="1">{<PagingnationContent handleProcessInfo={this.handleProcessInfo} listData={processDoingList} status={'1'} clientHeight={clientHeight} />}</TabPane>
          <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>已中止的流程 </div>} key="2">{<PagingnationContent handleProcessInfo={this.handleProcessInfo} listData={processStopedList} status={'2'} clientHeight={clientHeight} />}</TabPane>
          <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>已完成的流程 </div>} key="3">{<PagingnationContent handleProcessInfo={this.handleProcessInfo} listData={processComepletedList} status={'3'} clientHeight={clientHeight} />}</TabPane>
          <TabPane tab={<div style={{ padding: 0, fontSize: 16 }}>未开始的流程 </div>} key="0">{<PagingnationContent handleProcessInfo={this.handleProcessInfo} listData={processNotBeginningList} status={'0'} clientHeight={clientHeight} />}</TabPane>
        </Tabs>
      </div>
    )
  }

  render() {
    const { process_detail_modal_visible } = this.props
    const { clientHeight } = this.state
    return (
      <>
        <div className={indexStyles.processDefautOut}>
          <div className={indexStyles.processDefautOut_top}>
            <div className={indexStyles.title}>模板:</div>
            <TemplateContent
              handleAddTemplate={this.handleAddTemplate}
              handleEditTemplete={this.handleEditTemplete}
              handleStartProcess={this.handleStartProcess}
              handleDelteTemplete={this.handleDelteTemplete}
            />
          </div>
          {/*右方流程*/}
          <div className={indexStyles.processDefautOut_bottom}>
            {this.renderFlowTabs()}
          </div>
        </div>
        {
          process_detail_modal_visible && (
            <ProcessDetailModal process_detail_modal_visible={process_detail_modal_visible} />
          )
        }
      </>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    process_detail_modal_visible,
    processDoingList = [],
    processStopedList = [],
    processComepletedList = [],
    processNotBeginningList = []
  },
  projectDetail: { datas: { projectDetailInfoData = {} } }
}) {
  return {
    process_detail_modal_visible,
    processDoingList,
    processStopedList,
    processComepletedList,
    processNotBeginningList,
    projectDetailInfoData
  }
}