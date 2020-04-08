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
import { processEditDatasItemOneConstant } from './constant'
import { Tooltip, Button, message, Popover, DatePicker } from 'antd'
import { timeToTimestamp } from '../../utils/util'
import moment from 'moment'
import { MESSAGE_DURATION_TIME, FLOWS } from '../../globalset/js/constant'
import { saveProcessTemplate, getTemplateInfo, createProcess } from '../../services/technological/workFlow'
import { isApiResponseOk } from '../../utils/handleResponseData'
import { currentNounPlanFilterName } from "@/utils/businessFunction";
const { LingxiIm, Im } = global.constants
@connect(mapStateToProps)
export default class MainContent extends Component {
  constructor(props) {
    super(props)
    this.initCanvas = this.initCanvas.bind(this)
    this.resizeTTY = this.resizeTTY.bind(this)
    this.state = {
      clientHeight: document.documentElement.clientHeight,
      clientWidth: document.documentElement.clientWidth,
      currentFlowInstanceName: props.currentFlowInstanceName ? props.currentFlowInstanceName : '', // 当前流程实例的名称
      currentFlowInstanceDescription: '', // 当前的实例描述内容
      isEditCurrentFlowInstanceName: true, // 是否正在编辑当前实例的名称
      isEditCurrentFlowInstanceDescription: false, // 是否正在编辑当前实例的描述
    }
    this.timer = null
  }

  linkImWithFlow = (data) => {
    const { user_set = {} } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    const { is_simple_model } = user_set;
    if (!data) {
      global.constants.lx_utils && global.constants.lx_utils.setCommentData(null) 
      return false
    }
    global.constants.lx_utils && global.constants.lx_utils.setCommentData({...data})
    // if (is_simple_model == '1') {
    //   this.props.dispatch({
    //     type: 'simplemode/updateDatas',
    //     payload: {
    //       chatImVisiable: true
    //     }
    //   })
    // }
  }

  // 圈子动态消息
  handleDynamicComment = (e) => {
    e && e.stopPropagation()
    const { processInfo: { id, name, board_id } } = this.props
    this.linkImWithFlow({name: name, type: 'flow', board_id: board_id, id: id})
  }

  componentDidMount() {
    this.initCanvas()
    window.addEventListener('resize', this.resizeTTY)
    window.addEventListener('scroll', this.onScroll)
    // 采用锚点方式对元素进行定位
    let scrollElement = document.getElementById('container_configureProcessOut')
    let currentDoingDataCollectionItem = document.getElementById('currentDataCollectionItem')
    let currentDoingApproveItem = document.getElementById('currentStaticApproveContainer')
    // 表示进行中的资料收集节点
    if (currentDoingDataCollectionItem) {
      if (scrollElement.scrollTo) {
        scrollElement.scrollTo({
          top: currentDoingDataCollectionItem.offsetTop - 68,
          behavior: 'smooth'
        });
      }
    }
    // 表示进行中的审批节点
    if (currentDoingApproveItem) {
      if (scrollElement.scrollTo) {
        scrollElement.scrollTo({
          top: currentDoingApproveItem.offsetTop - 68,
          behavior: 'smooth'
        });
      }
    }

    const { processPageFlagStep } = this.props
    if (processPageFlagStep == '1' || processPageFlagStep == '2') {
      this.props.dispatch({
        type: 'publicProcessDetailModal/configurePorcessGuide',
        payload: {
          flow_template_node: '',
          flow_template_form: ''
        }
      })
    }

  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeTTY);
    window.removeEventListener('scroll', this.onScroll)
  }
  resizeTTY = () => {
    const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
    const clientWidth = document.documentElement.clientWidth
    this.setState({
      clientHeight,
      clientWidth
    })
  }
  // 用来更新canvas中的步骤
  componentWillReceiveProps(nextProps) {
    const { processInfo: { curr_node_sort } } = nextProps
    const { processInfo: { curr_node_sort: old_curr_node_sort } } = this.props
    if (old_curr_node_sort && curr_node_sort) {
      if (curr_node_sort != old_curr_node_sort) {
        setTimeout(() => {
          this.initCanvas()
        },50)
      }
    }
  }

  initCanvas() {
    const { processInfo = {}, processEditDatas = [] } = this.props
    const { curr_node_sort, status: parentStatus } = processInfo
    const defaultProps = {
      canvaswidth: 140, // 画布宽度
      canvasheight: 140, // 画布高度
      x0: 102,
      y0: 103,
      r: 69,
      lineWidth: 8,
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
    circle.clearRect(0, 0, 210, 210);//清空
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
        // if (Number(curr_node_sort) === Number(processEditDatas[i].sort)) {
        //   color = 'rgba(0,0,0,0.04)'
        // } else if (Number(processEditDatas[i].sort) < Number(curr_node_sort)) {
        //   color = 'rgba(24,144,255,1)' // 蓝色
        // } else if (Number(processEditDatas[i].sort) > Number(curr_node_sort)) {
        //   color = 'rgba(0,0,0,0.04)'
        // }
        if (parentStatus == '2') { // 表示中止时
          if (processEditDatas[i].status == '2') {// 表示完成
            color = 'rgba(0,0,0,0.25)'
          } else if (processEditDatas[i].status == '1') { // 表示进行中
            color = 'rgba(0,0,0,0.04)'
          } else if (processEditDatas[i].status == '0') { // 表示未开始
            color = 'rgba(0,0,0,0.04)'
          }
        } else if (parentStatus == '0') { // 表示未开始
          color = 'rgba(0,0,0,0.04)'
        } else {
          if (processEditDatas[i].status == '2') {// 表示完成
            color = 'rgba(24,144,255,1)' // 蓝色
          } else if (processEditDatas[i].status == '1') { // 表示进行中
            color = 'rgba(0,0,0,0.04)'
          } else if (processEditDatas[i].status == '0') { // 表示未开始
            color = 'rgba(0,0,0,0.04)'
          }
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

    const { processPageFlagStep } = this.props
    if (processPageFlagStep == '4') {
      let dynamic_ele = document.getElementById('dynamic_comment')
      dynamic_ele.style.bottom = 40 - scrollTop + 'px'
    }
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
    this.timer = setInterval(() => {
      let speedTop = 50
      let currentTop = document.getElementById('container_configureProcessOut').scrollTop
      document.getElementById('container_configureProcessOut').scrollTop = currentTop - speedTop
      if (currentTop == 0) {
        clearInterval(this.timer)
      }
    }, 30)
  }

  titleInputValueChange = (e) => {
    if (e.target.value.trimLR() == '') {
      this.setState({
        currentFlowInstanceName: ''
      })
      // this.props.dispatch({
      //   type: 'publicProcessDetailModal/updateDatas',
      //   payload: {
      //     // isEditCurrentFlowInstanceName: true,
      //     currentFlowInstanceName: ''
      //   }
      // })
      return
    }
    // this.setState({
    //   currentFlowInstanceName: e.target.value
    // })
    // // this.props.dispatch({
    // //   type: 'publicProcessDetailModal/updateDatas',
    // //   payload: {
    // //     // isEditCurrentFlowInstanceName: true,
    // //     currentFlowInstanceName: e.target.value
    // //   }
    // // })
  }

  // 标题失去焦点回调
  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    // let reStr = val.trim()
    if (val == "" || val == " " || !val) {
      this.setState({
        currentFlowInstanceName: ''
      })
      // this.props.dispatch({
      //   type: 'publicProcessDetailModal/updateDatas',
      //   payload: {
      //     isEditCurrentFlowInstanceName: true,
      //     currentFlowInstanceName: ''
      //   }
      // })
      return
    }
    this.setState({
      currentFlowInstanceName: val
    })
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
    const { processEditDatas = [], dispatch, not_show_create_node_guide } = this.props
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
      // 更新引导
      if (not_show_create_node_guide != '1') {
        dispatch({
          type: 'publicProcessDetailModal/configurePorcessGuide',
          payload: {
            flow_template_node: '1'
          }
        })
      }
    })
  }

  // 保存模板的点击事件
  handleSaveProcessTemplate = (e) => {
    e && e.stopPropagation()
    const { processPageFlagStep, currentTempleteIdentifyId, dispatch } = this.props
    if (this.state.isSaveTempleteIng) {
      message.warn('正在保存模板中...')
      return
    }
    this.setState({
      isSaveTempleteIng: true
    })
    const { currentFlowInstanceName } = this.state
    const { projectDetailInfoData: { board_id }, currentFlowInstanceDescription, processEditDatas = [] } = this.props
    if (processPageFlagStep == '1') {// 表示的是新建的时候
      Promise.resolve(
        dispatch({
          type: 'publicProcessDetailModal/saveProcessTemplate',
          payload: {
            board_id,
            name: currentFlowInstanceName,
            description: currentFlowInstanceDescription,
            nodes: processEditDatas,
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success('保存模板成功', MESSAGE_DURATION_TIME)
          }, 200)
          this.setState({
            isSaveTempleteIng: false
          })
          this.props.onCancel && this.props.onCancel()
        } else {
          this.setState({
            isSaveTempleteIng: false
          })
        }
      })
    } else if (processPageFlagStep == '2') {// 表示的是编辑的时候
      Promise.resolve(
        dispatch({
          type: 'publicProcessDetailModal/saveEditProcessTemplete',
          payload: {
            board_id,
            name: currentFlowInstanceName,
            description: currentFlowInstanceDescription,
            nodes: processEditDatas,
            template_no: currentTempleteIdentifyId,
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success(`保存模板成功`,MESSAGE_DURATION_TIME)
          }, 200)
          this.setState({
            isSaveTempleteIng: false
          })
          this.props.onCancel && this.props.onCancel()
        } else {
          this.setState({
            isSaveTempleteIng: false
          })
        }
      })
    }
  }

  // 开始流程的点击事件
  //操作配置时的启动---需要先调用保存模板 (只不过不保存)
  handleOperateConfigureConfirmCalbackProcess = async (start_time) => {
    this.handleOperateConfigureConfirmProcessOne(start_time)
      .then(({id,temp_time}) => this.handleOperateConfigureConfirmProcessTwo({id, temp_time}))
      .then(({payload, temp_time2}) => this.handleOperateConfigureConfirmProcessThree({payload, temp_time2}))
  }
  // 第一步: 先保存模板 ==> 返回模板ID
  handleOperateConfigureConfirmProcessOne = async (start_time) => {
    const { currentFlowInstanceName } = this.state
    const { projectDetailInfoData: { board_id }, currentFlowInstanceDescription, processEditDatas = [] } = this.props
    let res = await saveProcessTemplate({
      board_id,
      name: currentFlowInstanceName,
      description: currentFlowInstanceDescription,
      nodes: processEditDatas,
      is_retain: '0',
    })
    if (!isApiResponseOk(res)) {
      return Promise.resolve([]);
    }
    let id = res.data
    let temp_time = start_time
    return Promise.resolve({id, temp_time})
  }
  // 第二步: 调用模板详情 ==> 返回对应模板信息内容
  handleOperateConfigureConfirmProcessTwo = async ({id, temp_time}) => {    
    let res = await getTemplateInfo({id})
    if (!isApiResponseOk(res)) {
      return Promise.resolve([]);
    }
    let payload = {
      name: res.data.name,
      description: res.data.description,
      nodes: res.data.nodes,
      start_up_type: temp_time ? '2' : '1',
      plan_start_time: temp_time ? temp_time : '',
      flow_template_id: res.data.id,
    }
    let temp_time2 = temp_time
    return Promise.resolve({payload, temp_time2})
  }
  // 第三步: 调用列表并关闭弹窗 ==> 回调
  handleOperateConfigureConfirmProcessThree = async({payload, temp_time2}) => {
    let res = await createProcess(payload)
    if (!isApiResponseOk(res)) {
      return Promise.resolve([]);
    }
    setTimeout(() => {
      message.success(`启动${currentNounPlanFilterName(FLOWS)}成功`)
    },200)
    this.setState({
      isCreateProcessIng: false
    })
    this.props.dispatch({
      type: 'publicProcessDetailModal/getProcessListByType',
      payload: {
        status: temp_time2 ? '0' : '1',
        board_id: res.data.board_id
      }
    })
    this.props.onCancel && this.props.onCancel()
  }

  // 表示是在启动的时候调永立即开始流程
  handleOperateStartConfirmProcess = (start_time) => {
    let that = this
    const { currentFlowInstanceName } = this.state
    const { dispatch, projectDetailInfoData: { board_id }, currentFlowInstanceDescription, processEditDatas = [], templateInfo: { id } } = this.props
    Promise.resolve(
      dispatch({
        type: 'publicProcessDetailModal/createProcess',
        payload: {
          name: currentFlowInstanceName,
          description: currentFlowInstanceDescription,
          nodes: processEditDatas,
          start_up_type: start_time ? '2' : '1',
          plan_start_time: start_time ? start_time : '',
          flow_template_id: id,
        }
      })
    ).then(res => {
      if (isApiResponseOk(res)) {
        that.setState({
          isCreateProcessIng: false
        })
        that.props.dispatch({
          type: 'publicProcessDetailModal/getProcessListByType',
          payload: {
            status: start_time ? '0' : '1',
            board_id: board_id
          }
        })
        that.props.onCancel && that.props.onCancel()
      } else {
        that.setState({
          isCreateProcessIng: false
        })
      }
    })
  }

  // 立即开始
  handleCreateProcess = (e, start_time) => {
    e && e.stopPropagation()
    this.setState({
      isCreateProcessIng: true
    })
    if (this.state.isCreateProcessIng) {
      message.warn('正在启动流程中...')
      return
    }
    const { processPageFlagStep } = this.props
    switch (processPageFlagStep) {
      case '1': // 表示是配置的时候显示的开始流程
        this.handleOperateConfigureConfirmCalbackProcess(start_time)
        break;
      case '3': // 表示是启动的时候显示的开始流程
        this.handleOperateStartConfirmProcess(start_time)
        break
      default:
        break;
    }

  }

  // 预约开始时间
  startDatePickerChange = (timeString) => {
    this.setState({
      start_time: timeToTimestamp(timeString)
    }, () => {
      this.handleStartOpenChange(false)
      this.handleCreateProcess('',timeToTimestamp(timeString))
    })

  }
  // 禁用的时间段
  disabledStartTime = (current) => {
    return current && current < moment().subtract("days")
  }
  // 这是保存一个点击此刻时不让日期面板关闭
  handleStartOpenChange = (open) => {
    // this.setState({ endOpen: true });
    this.setState({
      startOpen: open
    })
  }

  handleStartDatePickerChange = (timeString) => {
    this.setState({
      start_time: timeToTimestamp(timeString)
    }, () => {
      this.handleStartOpenChange(true)
    })
  }

  // 渲染添加步骤按钮
  renderAddProcessStep = () => {
    const { processCurrentEditStep, processEditDatas = [], not_show_create_node_guide } = this.props
    let { is_edit } = processEditDatas && processEditDatas[processCurrentEditStep] || {}
    return (
      <div style={{ position: 'relative' }} id="addProcessStep">
        {
          processEditDatas && processEditDatas.length ? (
            is_edit == '1' ? (
              <div className={`${indexStyles.add_node}`} onClick={(e) => { this.handleAddEditStep(e) }}>
                <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                {not_show_create_node_guide != '1' && <ConfigureGuide />}
              </div>
            ) : (
                <Tooltip getPopupContainer={() => document.getElementById('addProcessStep')} placement="topLeft" title="完成上一步骤才能添加">
                  <div><div className={`${indexStyles.add_normal}`}>
                    <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                    {not_show_create_node_guide != '1' && <ConfigureGuide />}
                  </div></div>
                </Tooltip>
              )
          ) : (
              <div className={`${indexStyles.add_node}`} onClick={(e) => { this.handleAddEditStep(e) }}>
                <span className={`${globalStyles.authTheme}`}>&#xe8fe;</span>
                {not_show_create_node_guide != '1' && <ConfigureGuide />}
              </div>
            )
        }
      </div>
    )
  }

  // 渲染展示的内容是什么 配置时 | 编辑时 | 启动时 | 进行时
  renderDiffContentProcess = (value, key) => {
    const { processPageFlagStep } = this.props
    const { is_edit } = value
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

  // 渲染不同时候对应步骤的状态
  renderDiffStepStatus = () => {
    const { processInfo: { status } } = this.props
    let currentText = ''
    switch (status) {
      case '1':
        currentText = '剩 余'
        break;
      case '2':
        currentText = '已 中 止'
        break
      case '3':
        currentText = '已 完 成'
        break
      case '0':
        currentText = '未开始'
        break
      default:
        break;
    }
    return currentText
  }

  // 渲染当前步骤数量
  renderCurrentStepNumber = () => {
    const { processPageFlagStep, processInfo: { status, nodes = [] }, processEditDatas = [] } = this.props
    let gold_status = ''
    let totalStep = '' // 总步骤
    let currentStep = '' // 表示当前的步骤
    let surplusStep = '' // 剩余步骤
    switch (processPageFlagStep) {
      case '4': // 表示是实例详情中的内容
        switch (status) {
          case '1': // 表示进行中;
          case '2': // 表示中止
            gold_status = Number(nodes.findIndex(item => item.status == '1')) + 1
            currentStep = gold_status
            totalStep = nodes.length
            surplusStep = totalStep - Number(nodes.findIndex(item => item.status == '1'))
            break
          case '3': // 表示已完成
            currentStep = nodes.length
            totalStep = nodes.length
            surplusStep = 0
            break
          case '0': // 表示未开始
            gold_status = Number(nodes.findIndex(item => item.status == '0')) + 1
            currentStep = gold_status
            totalStep = nodes.length
            surplusStep = totalStep - Number(nodes.findIndex(item => item.status == '0'))
            break
          default:
            break;
        }
        break;
      case '1': // 表示配置的页面
        case '2':
          case '3':
        currentStep = (processEditDatas && processEditDatas.length) ? processEditDatas.length : 0
        totalStep = (processEditDatas && processEditDatas.length) ? processEditDatas.length : 0
      break
      default:
        break;
    }
    return { totalStep, currentStep, surplusStep }
  }

  // 渲染开始流程的气泡框
  renderProcessStartConfirm = () => {
    const { currentFlowInstanceName, processEditDatas = [] } = this.props
    // 禁用开始流程的按钮逻辑 1.判断流程名称是否输入 ==> 2. 是否有步骤 并且步骤都不是配置的样子 ==> 3. 并且上一个节点有选择类型 都是或者的关系 只要有一个不满足返回 true 表示 禁用 false 表示不禁用
    let saveTempleteDisabled = currentFlowInstanceName == '' || (processEditDatas && processEditDatas.length) && processEditDatas[processEditDatas.length - 1].is_edit == '0' || (processEditDatas && processEditDatas.length) && !(processEditDatas[processEditDatas.length - 1].node_type) ? true : false
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '248px', height: '112px', justifyContent: 'space-around' }}>
        <Button disabled={saveTempleteDisabled} onClick={this.handleCreateProcess} type="primary">立即开始</Button>
        <div>
          <span style={{ position: 'relative', zIndex: 1, minWidth: '80px', lineHeight: '38px', width: '100%', display: 'inline-block', textAlign: 'center' }}>
            <Button disabled={saveTempleteDisabled} style={{ color: '#1890FF', width: '100%' }}>预约开始时间</Button>
            <DatePicker
              disabled={saveTempleteDisabled}
              disabledDate={this.disabledStartTime.bind(this)}
              onOk={this.startDatePickerChange.bind(this)}
              onChange={this.handleStartDatePickerChange.bind(this)}
              onOpenChange={this.handleStartOpenChange}
              open={this.state.startOpen}
              getPopupContainer={triggerNode => triggerNode.parentNode}
              placeholder={'开始时间'}
              format="YYYY/MM/DD HH:mm"
              showTime={{ format: 'HH:mm' }}
              style={{ opacity: 0, zIndex: 1, background: '#000000', position: 'absolute', left: 0, width: '100%' }} />
          </span>
        </div>
      </div>
    )
  }

  render() {
    const { clientHeight, currentFlowInstanceName } = this.state
    const { currentFlowInstanceDescription, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processEditDatas = [], processPageFlagStep, processInfo: { status } } = this.props
    let saveTempleteDisabled = currentFlowInstanceName == '' || (processEditDatas && processEditDatas.length) && processEditDatas.find(item => item.is_edit == '0') || (processEditDatas && processEditDatas.length) && !(processEditDatas[processEditDatas.length - 1].node_type) ? true : false
    return (
      <div id="container_configureProcessOut" className={`${indexStyles.configureProcessOut} ${globalStyles.global_vertical_scrollbar}`} style={{ height: clientHeight - 100 - 54, overflowY: 'auto', position: 'relative' }} onScroll={this.onScroll} >
        <div id="container_configureTop" className={indexStyles.configure_top}>
          <div style={{ display: 'flex', position: 'relative' }}>
            <div><canvas id="time_graph_canvas" width={210} height={210} style={{ float: 'left' }}></canvas></div>
            <div style={{position: 'absolute',display: 'flex', flexDirection: 'column', width: '210px', height: '210px', alignItems: 'center', justifyContent: 'center'}}>
              <span className={globalStyles.authTheme} style={{ color: '#D9D9D9', position: 'absolute', top: 158, left: 92,fontSize: '14px' }} >&#xe605;</span>
              <span style={{
                // position: 'absolute',
                top: '70px',
                left: processEditDatas && processEditDatas.length > 10 ? '67px' : '80px' ,
                height: 17,
                fontSize: 20,
                fontFamily: 'PingFangSC-Regular',
                fontWeight: 400,
                color: 'rgba(140,140,140,1)',
                lineHeight: '17px'
              }}>{`${this.renderCurrentStepNumber().currentStep} / ${this.renderCurrentStepNumber().totalStep}`}</span>
              <span style={{
                // position: 'absolute',
                top: '110px',
                left: processEditDatas && processEditDatas.length > 10 ? '67px' : '76px',
                height: 30,
                fontSize: 14,
                fontFamily: 'PingFangSC-Regular',
                fontWeight: 400,
                color: 'rgba(89,89,89,1)',
                lineHeight: '30px',
                marginTop: '12px'
              }}>{processPageFlagStep == '4' ? this.renderDiffStepStatus() : '新 建'} {processPageFlagStep == '4' ? status == '1' ? `${this.renderCurrentStepNumber().surplusStep} 步`: '' : `${this.renderCurrentStepNumber().currentStep} 步`}</span>
            </div>
            <div style={{ paddingTop: '32px', paddingRight: '32px', flex: 1, float: 'left', width: '977px', minHeight: '210px' }}>
              {/* 显示流程名称 */}
              <div style={{ marginBottom: '12px' }}>
                {
                  !isEditCurrentFlowInstanceName ? (
                    <div onClick={processPageFlagStep == '4' ? '' : this.handleChangeFlowInstanceName} className={`${processPageFlagStep == '4' ? indexStyles.normal_flow_name : indexStyles.flow_name}`}>
                      <span style={{ wordBreak: 'break-all' }}>{currentFlowInstanceName}</span>
                    </div>
                  ) : (
                      <NameChangeInput
                        autosize
                        onChange={this.titleInputValueChange}
                        onBlur={this.titleTextAreaChangeBlur}
                        onPressEnter={this.titleTextAreaChangeBlur}
                        onClick={(e) => e && e.stopPropagation()}
                        // setIsEdit={this.setTitleEdit}
                        autoFocus={true}
                        goldName={currentFlowInstanceName}
                        placeholder={'流程名称(必填)'}
                        maxLength={50}
                        nodeName={'input'}
                        style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', minHeight: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                      />
                    )
                }
              </div>
              {/* 添加描述 */}
              <div>
                {
                  !isEditCurrentFlowInstanceDescription ? (
                    <div className={processPageFlagStep == '4' ? indexStyles.normal_flow_description  : indexStyles.flow_description} onClick={ processPageFlagStep == '4' ? '' : this.handleChangeFlowInstanceDescription}>
                      {currentFlowInstanceDescription != '' ? currentFlowInstanceDescription : '添加描述'}
                    </div>
                  ) : (
                      <NameChangeInput
                        onBlur={this.descriptionTextAreaChangeBlur}
                        autosize
                        autoFocus={true}
                        onClick={(e) => e.stopPropagation()}
                        goldName={currentFlowInstanceDescription}
                        placeholder={'添加描述'}
                        maxLength={101}
                        nodeName={'textarea'}
                        style={{ display: 'block', fontSize: 14, color: '#262626', resize: 'none', minHeight: '92px', maxHeight: '92px', height: '92px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                      />
                    )
                }
              </div>
            </div>
          </div>
        </div>
        <div className={indexStyles.configure_bottom}>
          {processEditDatas.map((value, key) => {
            return (
              <>{this.renderDiffContentProcess(value, key)}</>
            )
          })}
          {(processPageFlagStep == '1' || processPageFlagStep == '2') && this.renderAddProcessStep()}
          {
            processEditDatas.length >= 2 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '32px', position: 'relative' }}>
                {
                  (processPageFlagStep == '1' || processPageFlagStep == '3') && (
                    <Popover trigger="click" title={null} content={this.renderProcessStartConfirm()} icon={<></>} getPopupContainer={triggerNode => triggerNode.parentNode}>
                      <Button disabled={saveTempleteDisabled} style={{ marginRight: '24px', height: '40px', border: '1px solid rgba(24,144,255,1)', color: '#1890FF' }}>开始流程</Button>
                    </Popover>
                  )
                }
                {
                  (processPageFlagStep == '1' || processPageFlagStep == '2') && (
                    <Button onClick={this.handleSaveProcessTemplate} disabled={saveTempleteDisabled} type="primary" style={{ height: '40px' }}>保存模板</Button>
                  )
                }
              </div>
            )
          }
        </div>
        <div id="suspensionFlowInstansNav" className={`${indexStyles.suspensionFlowInstansNav}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ color: 'rgba(0,0,0,0.85)', fontSize: '16px', fontWeight: 500 }}>{currentFlowInstanceName} ({`${this.renderCurrentStepNumber().currentStep} / ${this.renderCurrentStepNumber().totalStep}`})</span>
            </div>
            <div style={{flexShrink: 0}}>
              <span onClick={this.handleBackToTop} style={{ color: '#1890FF', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe63d; 回到顶部</span>
            </div>
          </div>
        </div>
        {
          processPageFlagStep == '4' && (
            <div onClick={this.handleDynamicComment} id="dynamic_comment" className={indexStyles.dynamic_comment}>
              <Tooltip overlayStyle={{minWidth: '72px'}} placement="top" title="动态消息" getPopupContainer={() => document.getElementById('dynamic_comment')}>
                <span className={globalStyles.authTheme}>&#xe8e8;</span>
              </Tooltip>
            </div>
          )
        }
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { currentFlowInstanceName, currentFlowInstanceDescription, currentTempleteIdentifyId, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processPageFlagStep, processEditDatas = [], processInfo = {}, node_type, processCurrentEditStep, templateInfo = {}, currentFlowTabsStatus, not_show_create_node_guide }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { currentFlowInstanceName, currentFlowInstanceDescription, currentTempleteIdentifyId, isEditCurrentFlowInstanceName, isEditCurrentFlowInstanceDescription, processPageFlagStep, processEditDatas, processInfo, node_type, processCurrentEditStep, templateInfo, currentFlowTabsStatus, not_show_create_node_guide, projectDetailInfoData }
}
