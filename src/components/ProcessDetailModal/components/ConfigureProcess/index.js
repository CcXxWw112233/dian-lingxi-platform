import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import ConfigureNodeTypeInfo from './ConfigureNodeTypeInfo'
import ConfigureGuide from './ConfigureGuide'
import { processEditDatasItemOneConstant, processEditDatasRecordsItemOneConstant } from '../../constant'
import { Tooltip } from 'antd'

@connect(mapStateToProps)
export default class ConfigureProcess extends Component {
  constructor(props) {
    super(props)
    this.initCanvas = this.initCanvas.bind(this)
    this.state = {
      currentFlowInstanceName: '', // 当前流程实例的名称
      currentFlowInstanceDescription: '', // 当前的实例描述内容
      isEditCurrentFlowInstanceName: true, // 是否正在编辑当前实例的名称
      isEditCurrentFlowInstanceDescription: false, // 是否正在编辑当前实例的描述
    }
  }

  componentDidMount() {
    this.initCanvas()
  }

  initCanvas() {
    const { processInfo = {}, processEditDatas = [] } = this.props
    const { curr_node_sort } = processInfo
    const defaultProps = {
      canvaswidth: 138, // 画布宽度
      canvasheight: 138, // 画布高度
      x0: 102,
      y0: 103,
      r: 69,
      lineWidth: 14,
      strokeStyle: '#ffffff',
      LinearGradientColor1: '#3EECED',
      LinearGradientColor2: '#499BE6'
    }
    const {
      x0, //原点坐标
      y0,
      r, // 半径
      lineWidth, // 画笔宽度
    } = defaultProps
    let ele = document.getElementById("time_graph_canvas")
    let circle = ele.getContext("2d");
    circle.clearRect(0, 0, 138, 138);//清空
    //创建多个圆弧
    const length = processEditDatas.length
    if (length == '0') {
      circle.beginPath();//开始一个新的路径
      circle.save()
      circle.lineWidth = lineWidth;
      let color = 'rgba(0,0,0,0.04)'
      circle.strokeStyle = color; //curr_node_sort
      circle.arc(x0, y0, r, 0.6 * Math.PI, 0.6 * Math.PI + 1.83 * Math.PI, false)
      circle.stroke();//对当前路径进行描边
      circle.restore()
      circle.closePath()
    } else {
      for (let i = 0; i < length; i++) {
        circle.beginPath();//开始一个新的路径
        circle.save()
        circle.lineWidth = lineWidth;
        let color = 'rgba(0,0,0,0.45)'
        if (Number(curr_node_sort) === Number(processEditDatas[i].sort)) {
          color = 'rgba(24,144,255,1)' // 蓝色
        } else if (Number(processEditDatas[i].sort) < Number(curr_node_sort)) {
          color = 'rgba(83,196,26,1)' // 绿色
        } else if (Number(processEditDatas[i].sort) > Number(curr_node_sort)) {
          color = '#f2f2f2'
        }
        circle.strokeStyle = color; //curr_node_sort
        circle.arc(x0, y0, r, 0.6 * Math.PI + i * 1.83 / length * Math.PI, 0.6 * Math.PI + i * 1.83 / length * Math.PI + 1.83 / length * Math.PI - 0.03 * Math.PI, false);///用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
        circle.stroke();//对当前路径进行描边
        circle.restore()
        circle.closePath()
      }
    }

  }

  // 标题失去焦点回调
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    // let reStr = val.trim()
    if (val == "" || val == " " || !val) {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          // isEditCurrentFlowInstanceName: true,
          currentFlowInstanceName: ''
        }
      })
      return
    }
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceName: false,
        currentFlowInstanceName: val
      }
    })
  }
  // 编辑标题
  handleChangeFlowInstanceName = (e) => {
    e && e.stopPropagation()
    // this.setState({
    //   isEditCurrentFlowInstanceName: true
    // })
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceName: true
      }
    })
  }

  // 修改描述事件
  handleChangeFlowInstanceDescription = (e) => {
    e && e.stopPropagation()
    // this.setState({
    //   isEditCurrentFlowInstanceDescription: true
    // })
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceDescription: true
      }
    })
  }

  // 描述失去焦点事件
  descriptionTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    if (val == "" || val == " " || !val) {
      this.props.dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          // isEditCurrentFlowInstanceDescription: false,
          currentFlowInstanceDescription: ''
        }
      })
      return
    }
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        isEditCurrentFlowInstanceDescription: false,
        currentFlowInstanceDescription: val
      }
    })
  }

  // 添加步骤
  handleAddEditStep = (e) => {
    e && e.stopPropagation()
    const { processEditDatasRecords = [], processEditDatas = [], dispatch } = this.props
    const nodeObj = JSON.parse(JSON.stringify(processEditDatasItemOneConstant))
    const recordItemobjs = JSON.parse(JSON.stringify(processEditDatasRecordsItemOneConstant))

    // if (!this.verrificationForm(processEditDatas)) {
    //   return false
    // }
    // processEditDatasRecords.push(recordItemobjs)
    processEditDatas.push(nodeObj)
    new Promise((resolve) => {
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          node_type: '6'
        }
      })
      resolve()
    }).then(res => {
      //正常操作
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          // processEditDatasRecords,
          processEditDatas,
          processCurrentEditStep: (Number(processEditDatas.length) - 1).toString(),
          node_type: '1'
        }
      })

    })
  }

  filterForm = (value, key) => {
    const { node_type } = value
    let container = (<div></div>)
    const invitationType = '8'
    container = <ConfigureNodeTypeInfo itemKey={key} itemValue={value} />
    // switch (node_type) {
    //   case '1':
    //     container = (<ConfigureNodeTypeInfo {...this.props} itemKey={key} itemValue={value} />)
    //     break;
    //   default:
    //     container = (<div></div>)
    //     break
    // }
    return container
  }

  // 渲染添加步骤按钮
  renderAddProcessStep = () => {
    const { processCurrentEditStep, processEditDatas = [] } = this.props
    let { is_confirm } = processEditDatas && processEditDatas[processCurrentEditStep] || {}
    return (
      <div style={{ position: 'relative' }} id="addProcessStep">
        {
          processEditDatas && processEditDatas.length ? (
            is_confirm == '1' ? (
              <div className={`${indexStyles.add_node}`} onClick={(e) => { this.handleAddEditStep(e) }}>
                <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                <ConfigureGuide />
              </div>
            ) : (
                <Tooltip getPopupContainer={() => document.getElementById('addProcessStep')} placement="topLeft" title="完成上一步骤才能添加">
                  <div><div className={`${indexStyles.add_normal}`} onClick={(e) => { this.handleAddEditStep(e) }}>
                    <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                    <ConfigureGuide />
                  </div></div>
                </Tooltip>
              )
          ) : (
              <div className={`${indexStyles.add_node}`} onClick={(e) => { this.handleAddEditStep(e) }}>
                <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                <ConfigureGuide />
              </div>
            )
        }
        {/* <div className={`${processEditDatas.length ? (is_confirm == '1' ? indexStyles.add_node : indexStyles.add_normal) : indexStyles.add_node}`} onClick={(e) => { this.handleAddEditStep(e) }}>
          <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
          <ConfigureGuide />
        </div> */}
      </div>
    )
  }

  render() {
    const { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processEditDatas = [] } = this.props
    // const { currentFlowInstanceName, currentFlowInstanceDescription } = this.state
    const delHtmlTag = (str) => {
      return str.replace(/<[^>]+>/g, "")
    }
    return (
      <div className={indexStyles.configureProcessOut}>
        <div className={indexStyles.configure_top}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <canvas id="time_graph_canvas" width={210} height={210} style={{ float: 'left' }}></canvas>
            {/* <img id="node_img" src={sssimg} style={{position: 'relative', width: 20, height: 20, top: 155, right: 118}}/> */}
            {parseInt(this.props.processCurrentCompleteStep) === parseInt(this.props.processInfo && this.props.processInfo.node_amount) ? <span className={globalStyles.authTheme} style={{ color: '#73D13C', position: 'absolute', top: 155, left: 92 }} >&#xe605;</span> : <span className={globalStyles.authTheme} style={{ color: '#D9D9D9', position: 'absolute', top: 155, left: 92 }} >&#xe605;</span>}
            <span style={{
              position: 'absolute',
              top: '70px',
              left: '85px',
              height: 17,
              fontSize: 20,
              fontFamily: 'PingFangSC-Regular',
              fontWeight: 400,
              color: 'rgba(140,140,140,1)',
              lineHeight: '17px'
            }}>{this.props.processCurrentEditStep ? Number(this.props.processCurrentEditStep) + 1 : 0}/{this.props.processCurrentEditStep ? Number(this.props.processCurrentEditStep) + 1 : 0}</span>
            <span style={{
              position: 'absolute',
              top: '110px',
              left: '72px',
              height: 30,
              fontSize: 14,
              fontFamily: 'PingFangSC-Regular',
              fontWeight: 400,
              color: 'rgba(89,89,89,1)',
              lineHeight: '30px'
            }}>新建{this.props.processCurrentEditStep ? Number(this.props.processCurrentEditStep) + 1 : 0}步</span>
            <div style={{ paddingTop: '32px', paddingRight: '32px', flex: 1, float: 'left', width: '977px', height: '210px' }}>
              {/* 显示流程名称 */}
              <div style={{ marginBottom: '12px' }}>
                {
                  !isEditCurrentFlowInstanceName ? (
                    <div onClick={this.handleChangeFlowInstanceName} className={`${indexStyles.flow_name}`}>
                      <span style={{ wordBreak: 'break-all' }}>{currentFlowInstanceName}</span>
                    </div>
                  ) : (
                      <NameChangeInput
                        autosize
                        onBlur={this.titleTextAreaChangeBlur}
                        onPressEnter={this.titleTextAreaChangeBlur}
                        // onClick={this.setTitleEdit}
                        setIsEdit={this.setTitleEdit}
                        autoFocus={true}
                        goldName={''}
                        placeholder={'流程名称(必填)'}
                        maxLength={101}
                        nodeName={'input'}
                        style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                      />
                    )
                }
              </div>
              {/* 添加描述 */}
              <div>
                {
                  !isEditCurrentFlowInstanceDescription ? (
                    <div className={indexStyles.flow_description} onClick={this.handleChangeFlowInstanceDescription}>
                      {currentFlowInstanceDescription != '' ? currentFlowInstanceDescription : '添加描述'}
                    </div>
                  ) : (
                      <NameChangeInput
                        onBlur={this.descriptionTextAreaChangeBlur}
                        autosize
                        autoFocus={true}
                        goldName={''}
                        placeholder={'添加描述'}
                        maxLength={1000}
                        nodeName={'textarea'}
                        style={{ display: 'block', fontSize: 14, color: '#262626', resize: 'none', minHeight: '92px', maxHeight: '92px', height: '92px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                      />
                    )
                }
              </div>
              {/* <div style={{ color: '#262626', fontSize: '20px' }}>{this.props.processInfo && this.props.processInfo.name}</div>
              <div style={{
                fontSize: '12px',
                fontFamily: 'PingFangSC-Regular',
                fontWeight: '400',
                color: 'rgba(89,89,89,1)'
              }}>{this.props.processInfo && this.props.processInfo.description ? delHtmlTag(this.props.processInfo && this.props.processInfo.description) : '暂无描述'}</div> */}
            </div>
          </div>
        </div>
        <div className={indexStyles.configure_bottom}>
          {/* <ConfigureNodeTypeInfo {...this.props}/> */}
          {processEditDatas.map((value, key) => {
            return (
              <><ConfigureNodeTypeInfo itemKey={key} itemValue={value} /></>
            )
          })}
          {this.renderAddProcessStep()}
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processPageFlagStep, processDoingList = [], processEditDatas = [], processEditDatasRecords = [], processInfo = {}, processCurrentCompleteStep, node_type, processCurrentEditStep } }) {
  return { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processPageFlagStep, processDoingList, processEditDatas, processEditDatasRecords, processInfo, processCurrentCompleteStep, node_type, processCurrentEditStep }
}
