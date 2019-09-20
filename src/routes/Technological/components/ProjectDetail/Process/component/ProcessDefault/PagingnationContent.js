import React from 'react'
import indexStyles from '../../index.less'
import { Avatar, message } from 'antd'
import {
  PROJECT_FLOW_FLOW_ACCESS,
  NOT_HAS_PERMISION_COMFIRN,
  MESSAGE_DURATION_TIME
} from "../../../../../../../globalset/js/constant";
import {
  checkIsHasPermissionInBoard,
} from "../../../../../../../utils/businessFunction";
import { Collapse } from 'antd';
import { getProcessListByType } from "../../../../../../../services/technological/process";
import nodataImg from '../../../../../../../assets/projectDetail/process/Empty@2x.png'
import FlowsInstanceItem from './FlowsInstanceItem'
import { connect } from 'dva';
import ProcessDetailModalContainer from './ProcessDetailModalContainer'
const Panel = Collapse.Panel;

@connect(mapStateToProps)
export default class PagingnationContent extends React.Component {
  state = {
    previewProccessModalVisibile: this.props.processDetailModalVisible,
    page_number: 1,
    page_size: 20,
    loadMoreDisplay: 'none',
    scrollBlock: true, //滚动加载锁，true可以加载，false不执行滚动操作
  }

  componentDidMount() {
    this.getProcessListByType()
  }
  componentWillUnmount() {

  }
  //分页逻辑
  async getProcessListByType() {
    const { board_id, processDoingList = [], processStopedList = [], processComepletedList = [] } = this.props
    const { page_number, page_size, } = this.state
    const { listData = [], status, dispatch } = this.props
    const obj = {
      // page_number,
      // page_size,
      status,
      board_id
    }
    this.setState({
      loadMoreText: '加载中...'
    })
    const res = await getProcessListByType(obj)
    // console.log('this is getProcessListByType s result:', res)
    if (res.code === '0') {
      const data = res.data
      let listName
      let selectList = []
      switch (status) {
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

      dispatch({
        type: 'projectDetailProcess/updateDatas',
        payload: {
          [listName]: page_number == 1 ? data : [].concat(listData, data)
        }
      })
      this.setState({
        scrollBlock: !(data.length < page_size),
      }, () => {
        this.setState({
          loadMoreDisplay: listData.length ? 'block' : 'none',
          loadMoreText: (data.length < page_size) ? '暂无更多数据' : '加载更多',
        })
      })
    }
  }

  contentBodyScroll(e) {
    if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 20) {
      const { scrollBlock } = this.state
      if (!scrollBlock) {
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
    const { dispatch } = this.props
    dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        processDetailModalVisible: false
      }
    })
  }
  //getProcessListByType
  async processItemClick(obj) {
    if (!checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS)) {
      message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
      return false
    }
    const { dispatch } = this.props
    await dispatch({
      type: 'projectDetailProcess/getWorkFlowComment',
      payload: {
        flow_instance_id: obj.flow
      }
    })
    await dispatch({
      type: 'projectDetailProcess/getProcessInfo',
      payload: {
        id: obj.flow
      }
    })
    await dispatch({
      type: 'projectDetailProcess/getWorkFlowComment',
      payload: {
        flow_instance_id: obj.flow
      }
    })

    dispatch({
      type: 'projectDetailProcess/updateDatas',
      payload: {
        currentProcessInstanceId: obj.flow,
        totalId: obj
      }
    })

    dispatch({
      type: 'workbenchTaskDetail/projectDetailInfo',
      payload: {
        id: obj.board
      }
    })

    await this.setState({
      previewProccessModalVisibile: !this.state.previewProccessModalVisibile
    });
  }


  render() {
    const { processDoingList = [], processStopedList = [], processComepletedList = [], dispatch } = this.props
    const { clientHeight, listData = [], status } = this.props
    const maxContentHeight = clientHeight - 108 - 150
    const allStep = []
    for (let i = 0; i < 20; i++) {
      allStep.push(i)
    }

    return (
      <div
        className={indexStyles.paginationContent}
        style={{ maxHeight: maxContentHeight }}
        onScroll={this.contentBodyScroll.bind(this)}>
        <Collapse
          bordered={false}
          style={{ backgroundColor: '#f5f5f5', marginTop: 4 }}>
          {listData.map((value, key) => {
            const { id } = value
            return (
              <Panel key={id}
                style={customPanelStyle}
                header={
                  <FlowsInstanceItem
                    itemValue={value}
                    status={status}
                    dispatch={dispatch}
                    listDataObj={{
                      processDoingList,
                      processStopedList,
                      processComepletedList
                    }}
                    processItemClick={this.processItemClick.bind(this)} />} />
            )
          })}
        </Collapse>
        {/*{listData.map((value, key) => {*/}
        {/*return (*/}
        {/*<FlowsInstanceItem itemValue={value} processItemClick={this.processItemClick.bind(this)}/>*/}
        {/*)*/}
        {/*})}*/}
        {!listData.length || !listData ? (
          <div className={indexStyles.nodata} style={{ height: maxContentHeight - 30 }} >
            <div className={indexStyles.nodata_inner}>
              <img src={nodataImg} />
              <div>暂无数据</div>
            </div>
          </div>
        ) : ('')}
        {/* <div className={indexStyles.Loading} style={{display: loadMoreDisplay }}>{loadMoreText}</div> */}
        <ProcessDetailModalContainer
          status={status}
          getProcessListByType={this.getProcessListByType.bind(this)}
          close={this.close.bind(this)}
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
function mapStateToProps({
  projectDetailProcess: {
    datas: {
      processTemplateList = [],
      processDoingList = [],
      processStopedList = [],
      processComepletedList = [],
      processDetailModalVisible
    }
  },
  projectDetail: {
    datas: {
      board_id
    }
  },

}) {
  return {
    processDetailModalVisible,
    processTemplateList,
    processDoingList,
    processStopedList,
    processComepletedList,
    board_id
  }
}