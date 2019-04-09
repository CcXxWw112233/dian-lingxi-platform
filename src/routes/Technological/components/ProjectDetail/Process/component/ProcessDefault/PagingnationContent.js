import React from 'react'
import indexStyles from '../../index.less'
import { Avatar, message } from 'antd'
import {
  PROJECT_FLOW_FLOW_ACCESS, TASKS, FLOWS, DASHBOARD, PROJECTS, FILES, MEMBERS, CATCH_UP,
  NOT_HAS_PERMISION_COMFIRN, ORG_TEAM_BOARD_QUERY, MESSAGE_DURATION_TIME
} from "../../../../../../../globalset/js/constant";
import {
  currentNounPlanFilterName, checkIsHasPermissionInBoard,
  checkIsHasPermission, setStorage
} from "../../../../../../../utils/businessFunction";
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'
import { Collapse } from 'antd';
import {getProcessListByType} from "../../../../../../../services/technological/process";
import {
  selectProcessComepletedList, selectProcessDoingList,
  selectProcessStopedList
} from "../../../../../../../models/technological/select";
import nodataImg from '../../../../../../../assets/projectDetail/process/Empty@2x.png'
import ProccessDetailModal from '../../../../Workbench/CardContent/Modal/ProccessDetailModal'

const Panel = Collapse.Panel;

export default class PagingnationContent extends React.Component {
  state = {
    previewProccessModalVisibile: this.props.model.datas.processDetailModalVisible,
    page_number: 1,
    page_size: 20,
    loadMoreDisplay: 'none',
    scrollBlock: true, //滚动加载锁，true可以加载，false不执行滚动操作
  }

  componentDidMount() {
    this.getProcessListByType()
  }
  componentWillUnmount() {
    const { status } = this.props
    let listName
    switch (status ) {
      case '1':
        listName = 'processDoingList'
        break
      case '2':
        listName = 'processStopedList'
        break
      case '3':
        listName = 'processComepletedList'
        break
      default:
        listName = 'processDoingList'
        break
    }
    this.props.updateDatasProcess({
      [listName]: [],
    })
  }
    //分页逻辑
  async getProcessListByType() {
    const { datas: { board_id, processDoingList = [], processStopedList = [], processComepletedList = [] } } = this.props.model
    const { page_number, page_size, } = this.state
    const { listData = [], status, } = this.props

    const obj = {
      page_number,
      page_size,
      status,
      board_id
    }
    this.setState({
      loadMoreText: '加载中...'
    })
    const res = await getProcessListByType(obj)
    // console.log('this is getProcessListByType s result:', res)
    if(res.code === '0') {
      const data = res.data
      let listName
      let selectList = []
      switch (status ) {
        case '1':
          listName = 'processDoingList'
          selectList = processDoingList
          break
        case '2':
          listName = 'processStopedList'
          selectList = processStopedList
          break
        case '3':
          listName = 'processComepletedList'
          selectList = processComepletedList
          break
        default:
          listName = 'processDoingList'
          selectList = processDoingList
          break
      }
      this.props.updateDatasProcess({
        [listName]: data
      })
      this.setState({
        scrollBlock: !(data.length < page_size),
        loadMoreText: (data.length < page_size)?'暂无更多数据': '加载更多',
      }, () => {
        this.setState({
          loadMoreDisplay: listData.length ? 'block' : 'none',
        })
      })
    }
  }

  contentBodyScroll(e) {
    if(e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20) {
      const { scrollBlock } = this.state
      if(!scrollBlock) {
        return false
      }
      this.setState({
        page_number: ++this.state.page_number,
        scrollBlock: false
      }, () => {
        this.getProcessListByType()
      })
    }
  }
  close() {
    this.setState({
      previewProccessModalVisibile: false
    })
    this.props.updateDatas({
      processDetailModalVisible: false
    })
  }
  //getProcessListByType
  async processItemClick(obj) {
    if (!checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }

    await this.props.getWorkFlowComment({flow_instance_id: obj.flow})

    await this.props.dispatch({
      type: 'projectDetailProcess/getProcessInfo',
      payload: {
        id: obj.flow
      }
    })

    this.props.updateDatasProcess && this.props.updateDatasProcess({
      currentProcessInstanceId: obj.flow
    })

    await this.props.updateDatas({
      totalId: obj
    })

    await this.props.getProjectDetailInfo({id: obj.board})


    await this.setState({
      previewProccessModalVisibile: !this.state.previewProccessModalVisibile
    });
  }
  render() {
    const { clientHeight, listData = [], status } = this.props
    const { loadMoreDisplay, loadMoreText } = this.state
    const maxContentHeight = clientHeight - 108 - 150
    const allStep = []
    for(let i = 0; i < 20; i ++) {
      allStep.push(i)
    }
    const filterProgress = (status, completed_node_num, total_node_num) => {
      let ele = `（${completed_node_num}/${total_node_num}）`
      switch (status) {
        case '1':
          ele = `（${completed_node_num}/${total_node_num}）`
          break
        case '2':
          ele = `已终止`
          break
        case '3':
          ele = ``
          break
        default:
          ele = `（${completed_node_num}/${total_node_num}）`
          break
      }
      return ele
    }
    const PanelHeader = (value) => {
      const { name, curr_node_name, id, board_id, percentage = '100%', completed_node_num, total_node_num } = value
      let obj = {
        flow: id,
        board: board_id
      }
      return (
        <div className={indexStyles.panelHead} onClick={this.processItemClick.bind(this, obj)}>
          <div className={`${indexStyles.panelHead_l} ${globalStyles.authTheme}`}>&#xe605;</div>
          <div className={indexStyles.panelHead_m}>
            <div className={indexStyles.panelHead_m_l}>{name}{filterProgress(status, completed_node_num, total_node_num)}</div>
            <div className={indexStyles.panelHead_m_r}>{curr_node_name}</div>
          </div>
          {/*<div className={indexStyles.panelHead_r}>*/}
            {/*<div className={indexStyles.panelHead_r_l}>*/}
              {/*{status == '2'?(*/}
                {/*<span style={{color: '#8c8c8c'}}>已终止</span>*/}
              {/*) : (*/}
                {/*allStep.map((value, key) => (*/}
                    {/*<span key={key} style={{color: key < areadyStep? '#262626': '#8c8c8c'}}>|</span>*/}
                  {/*)*/}
                {/*)*/}
              {/*)}*/}

            {/*</div>*/}
            {/*<div className={indexStyles.panelHead_r_m}>{status != '2' && percentage}</div>*/}
            {/*/!*<div className={indexStyles.panelHead_r_r}>*!/*/}
              {/*/!*<Avatar size="small" icon="user" />*!/*/}
            {/*/!*</div>*!/*/}
          {/*</div>*/}
        </div>
      )
    }
    const { processDetailModalVisible } = this.props.model.datas

    return (
      <div
        className={indexStyles.paginationContent}
        style={{maxHeight: maxContentHeight}}
        onScroll={this.contentBodyScroll.bind(this)}>
        <Collapse
            bordered={false}
            style={{backgroundColor: '#f5f5f5', marginTop: 4}}>
            {listData.map((value, key) => {
              return (
                <Panel header={PanelHeader(value)} key={key} style={customPanelStyle} />
              )
            })}
          </Collapse>
        {!listData.length || !listData?(
          <div className={indexStyles.nodata} style={{height: maxContentHeight - 30}} >
            <div className={indexStyles.nodata_inner}>
              <img src={nodataImg} />
              <div>暂无数据</div>
            </div>
          </div>
        ): ('')}
        <div className={indexStyles.Loading} style={{display: loadMoreDisplay }}>{loadMoreText}</div>
        <ProccessDetailModal
          {...this.props}
          status = {this.props.status}
          getProcessListByType = {this.getProcessListByType.bind(this)}
          close = {this.close.bind(this)}
          modalVisible={this.state.previewProccessModalVisibile}
        />
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
