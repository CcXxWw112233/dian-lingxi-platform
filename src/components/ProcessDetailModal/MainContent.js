import React, { Component } from 'react'
import { connect } from 'dva'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import ConfigureProcess from './components/ConfigureProcess'
import EditProcess from './components/EditProcess'
import ProcessStartConfirm from './components/ProcessStartConfirm'
import BeginningProcess from './components/BeginningProcess'
import ConfigureGuide from './ConfigureGuide'
import { processEditDatasItemOneConstant, processEditDatasRecordsItemOneConstant } from './constant'
import { Tooltip, Button } from 'antd'

let timer
@connect(mapStateToProps)
export default class MainContent extends Component {
  constructor(props) {
    super(props)
    this.initCanvas = this.initCanvas.bind(this)
    this.resizeTTY = this.resizeTTY.bind(this)
    this.state = {
      clientHeight: document.documentElement.clientHeight,
      clientWidth: document.documentElement.clientWidth,
      currentFlowInstanceName: '', // 当前流程实例的名称
      currentFlowInstanceDescription: '', // 当前的实例描述内容
      isEditCurrentFlowInstanceName: true, // 是否正在编辑当前实例的名称
      isEditCurrentFlowInstanceDescription: false, // 是否正在编辑当前实例的描述
      visible: false, // 控制引导窗口的显示隐藏
    }
  }

  componentDidMount() {
    this.initCanvas()
    window.addEventListener('resize', this.resizeTTY)
    window.addEventListener('scroll',this.onScroll)
    // 采用锚点方式对元素进行定位
    let scrollElement = document.getElementById('container_configureProcessOut')
    let currentDoingDataCollectionItem = document.getElementById('currentDataCollectionItem')
    let currentDoingApproveItem = document.getElementById('currentStaticApproveContainer')
    // 表示进行中的资料收集节点
    if (currentDoingDataCollectionItem) {
      scrollElement.scrollTo({
        top: currentDoingDataCollectionItem.offsetTop - 68,
        behavior: 'smooth'
      });
    }
    // 表示进行中的审批节点
    if (currentDoingApproveItem) {
      scrollElement.scrollTo({
        top: currentDoingApproveItem.offsetTop - 68,
        behavior: 'smooth'
      });
    }
    
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeTTY);
    window.removeEventListener('scroll',this.onScroll)
  }
  resizeTTY = () => {
    const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
    const clientWidth = document.documentElement.clientWidth
    this.setState({
      clientHeight,
      clientWidth
    })
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
        let color = 'rgba(0,0,0,0.04)'
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

  // 滚动事件
  onScroll = (e) => {
    let scrollTop = document.getElementById('container_configureProcessOut').scrollTop
    let ele = document.getElementById('suspensionFlowInstansNav')
    // -------------------- 关于资料收集节点定位  ----------------------------
    // 关于资料收集节点的定位
    
    

    // -------------------- 关于审批节点定位  ----------------------------
    // 当前处于悬浮审批状态节点
    // let currentAbsoluteApproveElement = document.getElementById('currentAbsoluteApproveContainer')
    // // 获取当前处于原本位置的审批节点
    // let currentStaticApproveElement = document.getElementById('currentStaticApproveContainer')

    // // 关于审批节点的悬浮
    // if (currentAbsoluteApproveElement && currentStaticApproveElement) {
      
    //   /**
    //    * 设置审批悬浮状态
    //    * 1.获取当前处于悬浮状态的对象(currentAbsoluteApproveElement)的offsetTop
    //    * 2.获取当前滚动的距离 scrollTop  0 ↑
    //    * 3.获取当前处于原本处位置（currentStaticApproveElement）的 offsetTop
    //    * 4.满足条件：当滚动的距离（scrollTop）+ currentAbsoluteApproveElement的top值 大于等于 currentStaticApproveElement的offsetTop的时候进行隐藏，否则就显示
    //    */
    //   if (scrollTop + 478 >= currentStaticApproveElement.offsetTop) {
    //     currentAbsoluteApproveElement.style.display = 'none'
    //     currentAbsoluteApproveElement.style.top = 478 + 'px'
    //   } else {
    //     currentAbsoluteApproveElement.style.top = scrollTop + 478 + 'px'
    //     currentAbsoluteApproveElement.style.display = 'flex'
    //   }
    // }

    if (scrollTop >= 200) {
      ele.style.display = 'block'
      ele.style.position = 'absolute'
      ele.style.top = scrollTop + 'px'
      ele.style.zIndex = 1
    } else {
      ele.style.display = 'none'
    }
  }

  // 返回顶部
  handleBackToTop = (e) => {
    e && e.stopPropagation()
    timer = setInterval(() => {
      let speedTop = 50
      let currentTop = document.getElementById('container_configureProcessOut').scrollTop
      document.getElementById('container_configureProcessOut').scrollTop = currentTop - speedTop
      if (currentTop == 0) {
        clearInterval(timer)
      }
    }, 30)
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
    let that = this
    const { processEditDatas = [], dispatch } = this.props
    const nodeObj = JSON.parse(JSON.stringify(processEditDatasItemOneConstant))
    processEditDatas.length == '0' ? processEditDatas.push(nodeObj) : processEditDatas.push({ name: '' })
    // processEditDatas.push(nodeObj)
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
      that.setState({
        visible: true
      })
    })
  }

  // 渲染添加步骤按钮
  renderAddProcessStep = () => {
    const { processCurrentEditStep, processEditDatas = [] } = this.props
    let { is_edit } = processEditDatas && processEditDatas[processCurrentEditStep] || {}
    const { visible } = this.state
    return (
      <div style={{ position: 'relative' }} id="addProcessStep">
        {
          processEditDatas && processEditDatas.length ? (
            is_edit == '1' ? (
              <div className={`${indexStyles.add_node}`} onClick={(e) => { this.handleAddEditStep(e) }}>
                <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                <ConfigureGuide visible={visible} />
              </div>
            ) : (
                <Tooltip getPopupContainer={() => document.getElementById('addProcessStep')} placement="topLeft" title="完成上一步骤才能添加">
                  <div><div className={`${indexStyles.add_normal}`}>
                    <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                    <ConfigureGuide visible={visible} />
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
      </div>
    )
  }

  // 渲染展示的内容是什么 配置时 | 编辑时 | 启动时 | 进行时
  renderDiffContentProcess = (value, key) => {
    const { processPageFlagStep } = this.props
    const { is_edit, is_confirm } = value
    let container = (<div></div>)
    switch (processPageFlagStep) {
      case '1': // 表示进入配置界面
        if (is_edit == '1') {
          container = <EditProcess itemKey={key} itemValue={value} />
        } else {
          container = <ConfigureProcess itemKey={key} itemValue={value} />
        }
        break;
      case '2':
        if (is_edit == '1') {
          container = <EditProcess itemKey={key} itemValue={value} />
        } else {
          container = <ConfigureProcess itemKey={key} itemValue={value} />
        }
        // container = <EditProcess itemKey={key} itemValue={value}/>
        break
      case '3':
        container = <ProcessStartConfirm itemKey={key} itemValue={value} />
        break
      case '4':
        container = <BeginningProcess itemKey={key} itemValue={value} />
        break
      default:
        break;
    }
    return container
  }

  render() {
    const { clientHeight } = this.state
    const { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processEditDatas = [], processPageFlagStep } = this.props
    let saveTempleteDisabled = currentFlowInstanceName == '' || processEditDatas[processEditDatas.length - 1].is_edit == '0' ? true : false
    return (
      <div id="container_configureProcessOut" className={`${indexStyles.configureProcessOut} ${globalStyles.global_vertical_scrollbar}`} style={{ height: clientHeight - 100 - 54, overflowY: 'auto',position: 'relative' }} onScroll={this.onScroll} >
        <div id="container_configureTop" className={indexStyles.configure_top}>
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
            }}>{processEditDatas && processEditDatas.length ? Number(processEditDatas.length) : 0}/{processEditDatas && processEditDatas.length ? Number(processEditDatas.length) : 0}</span>
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
            }}>新建{processEditDatas && processEditDatas.length ? Number(processEditDatas.length) : 0}步</span>
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
          {/* <ConfigureProcess {...this.props}/> */}
          {processEditDatas.map((value, key) => {
            return (
              <>{this.renderDiffContentProcess(value, key)}</>
            )
          })}
          {(processPageFlagStep == '1' || processPageFlagStep == '2') && this.renderAddProcessStep()}
          {
            processEditDatas.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '32px' }}>
                <Button disabled={saveTempleteDisabled} style={{ marginRight: '24px', height: '40px', color: '#1890FF' }}>开始流程</Button>
                {
                  processPageFlagStep != '3' && (
                    <Button disabled={saveTempleteDisabled} type="primary" style={{ height: '40px' }}>保存模板</Button>
                  )
                }
              </div>
            )
          }
        </div>
        <div id="suspensionFlowInstansNav" className={`${indexStyles.suspensionFlowInstansNav}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: 'rgba(0,0,0,0.85)', fontSize: '16px', fontWeight: 500 }}>投资论证流程 (1/2)</span>
            </div>
            <div>
              <span onClick={this.handleBackToTop} style={{ color: '#1890FF', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe63d; 回到顶部</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processPageFlagStep, processDoingList = [], processEditDatas = [], processEditDatasRecords = [], processInfo = {}, processCurrentCompleteStep, node_type, processCurrentEditStep } }) {
  return { currentFlowInstanceName, currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processPageFlagStep, processDoingList, processEditDatas, processEditDatasRecords, processInfo, processCurrentCompleteStep, node_type, processCurrentEditStep }
}
