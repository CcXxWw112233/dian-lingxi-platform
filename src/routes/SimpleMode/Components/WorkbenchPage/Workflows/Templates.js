import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import { Tooltip, Button, Popconfirm, message, DatePicker, Popover } from 'antd'
import { connect } from 'dva'
import { checkIsHasPermissionInBoard, setBoardIdStorage, getOrgNameWithOrgIdFilter, getGlobalData } from '../../../../../utils/businessFunction'
import { PROJECT_FLOWS_FLOW_TEMPLATE, PROJECT_FLOWS_FLOW_CREATE, NOT_HAS_PERMISION_COMFIRN } from '../../../../../globalset/js/constant'
import SelectBoardModal from './SelectBoardModal'
import { timeToTimestamp } from '../../../../../utils/util'
import moment from 'moment'
import { isApiResponseOk } from "../../../../../utils/handleResponseData";
@connect(mapStateToProps)
export default class Templates extends Component {
    constructor(props) {
        super(props)
        this.state = {
            local_board_id: '', //用于做流程模板创建的board_id,当全部项目场景下会用到
            board_select_visible: false,//全项目下
        }
    }
    componentDidMount() {
        const { simplemodeCurrentProject = {} } = this.props
        const { board_id } = simplemodeCurrentProject
        this.getTemplateList(simplemodeCurrentProject)
        this.setLocalBoardId(board_id)
    }
    componentWillReceiveProps(nextProps) {
        const { board_id } = this.props.simplemodeCurrentProject
        const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
        if (board_id != next_board_id) { //切换项目时做请求
            this.getTemplateList(nextProps.simplemodeCurrentProject)
            this.setLocalBoardId(next_board_id)
        }
    }
    // 获取流程列表
    getTemplateList = (simplemodeCurrentProject = {}) => {
        const { dispatch, currentSelectOrganize } = this.props
        const { board_id } = simplemodeCurrentProject
        const { id } = currentSelectOrganize
        dispatch({
            type: 'publicProcessDetailModal/getProcessTemplateList',
            payload: {
                id: board_id || '0',
                board_id: board_id || '0',
                _organization_id: id || '0'
            }
        })
    }

    // 和创建模板想关-----------start
    setLocalBoardId = (board_id) => {
        this.setState({
            local_board_id: board_id
        })
    }
    // 弹窗选择项目id回调
    selectModalBoardIdCalback = (board_id) => {
        const { dispatch } = this.props
        this.setLocalBoardId(board_id)
        dispatch({
            type: 'projectDetail/projectDetailInfo',
            payload: {
                id: board_id
            }
        })
    }
    // 
    setBoardSelectVisible = (visible) => {
        this.setState({
            board_select_visible: visible,
        })
        this.setLocalBoardId('0')
    }
    modalOkCalback = () => { //确认回调
        this.setBoardSelectVisible(false)
        this.handleAddTemplate()
    }
    // 新增模板点击的确认
    beforeAddTemplateConfirm = () => {
        const { local_board_id } = this.state
        if (local_board_id == '0' || !local_board_id) {
            this.setBoardSelectVisible(true)
        } else {
            if (
                !checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_CREATE, local_board_id) &&
                !checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_TEMPLATE, local_board_id)
            ) {
                message.warn(NOT_HAS_PERMISION_COMFIRN)
                return false
            }
            this.handleAddTemplate()
        }
    }
    // 和创建模板想关-----------end

    // 新增模板点击事件
    handleAddTemplate = () => {
        const { dispatch } = this.props
        dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
                processPageFlagStep: '1',
                process_detail_modal_visible: true
            }
        })
    }
    // 编辑模板的点击事件
    handleEditTemplete = (item) => {
        const { id, template_no, board_id } = item
        const { dispatch } = this.props
        setBoardIdStorage(board_id)
        dispatch({
            type: 'projectDetail/projectDetailInfo',
            payload: {
                id: board_id
            }
        }).then(res => {
            dispatch({
                type: 'publicProcessDetailModal/getTemplateInfo',
                payload: {
                    id,
                    processPageFlagStep: '2',
                    currentTempleteIdentifyId: template_no,
                    process_detail_modal_visible: true
                }
            })
        })
    }
    // 启动流程的点击事件
    handleStartProcess = (item) => {
        const { dispatch } = this.props
        const { id, board_id } = item
        setBoardIdStorage(board_id)
        dispatch({
            type: 'projectDetail/projectDetailInfo',
            payload: {
                id: board_id
            }
        }).then(res => {
            dispatch({
                type: 'publicProcessDetailModal/getTemplateInfo',
                payload: {
                    id,
                    processPageFlagStep: '3',
                    process_detail_modal_visible: true
                }
            })
        })

    }
    // 删除流程模板的点击事件
    handleDelteTemplete = (item) => {
        const { id, board_id } = item
        const { dispatch, updateParentProcessTempleteList } = this.props
        setBoardIdStorage(board_id)
        dispatch({
            type: 'publicProcessDetailModal/deleteProcessTemplete',
            payload: {
                id,
                board_id,
                calback: function () {
                    updateParentProcessTempleteList && updateParentProcessTempleteList()
                }
            }
        })
    }
    handleOperateStartConfirmProcess = (e,item,start_time) => {
        e && e.stopPropagation()
        let that = this
        const { id, board_id, org_id } = item
        const { dispatch, request_flows_params = {} } = this.props
        let BOARD_ID = request_flows_params && request_flows_params.request_board_id || board_id
        let REAUEST_BOARD_ID = getGlobalData('storageCurrentOperateBoardId') || board_id
        return
        Promise.resolve(
          dispatch({
            type: 'publicProcessDetailModal/createProcess',
            payload: {
              start_up_type: start_time ? '2' : '1',
              plan_start_time: start_time ? start_time : '',
              flow_template_id: id,
              board_id: REAUEST_BOARD_ID
            }
          })
        ).then(res => {
          if (isApiResponseOk(res)) {
            that.props.dispatch({
              type: 'publicProcessDetailModal/getProcessListByType',
              payload: {
                status: start_time ? '0' : '1',
                board_id: BOARD_ID,
                _organization_id: request_flows_params._organization_id || org_id
              }
            })
          } else {
          }
        })
      }
     // 开始时间气泡弹窗显示
    handleProcessStartConfirmVisible = (visible) => {
        if (!visible) {
        const { startOpen } = this.state
        if (!startOpen) return
        this.setState({
            startOpen: false
        })
        }
    }

    // 预约开始时间
    startDatePickerChange = (timeString, item) => {
        this.setState({
        start_time: timeToTimestamp(timeString)
        }, () => {
        this.handleStartOpenChange(false)
        this.handleOperateStartConfirmProcess('', item,timeToTimestamp(timeString))
        })

    }
    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
          result.push(i);
        }
        return result;
      }
    // 禁用的时间段
    disabledStartTime = (current) => {
        return current && current < moment().endOf('day')
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
     // 渲染开始流程的气泡框
    renderProcessStartConfirm = (value) => {
        // 禁用开始流程的按钮逻辑 1.判断流程名称是否输入 ==> 2. 是否有步骤 并且步骤都不是配置的样子 ==> 3. 并且上一个节点有选择类型 都是或者的关系 只要有一个不满足返回 true 表示 禁用 false 表示不禁用
        return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '248px', height: '112px', justifyContent: 'space-around' }}>
            <Button onClick={(e) => { this.handleOperateStartConfirmProcess(e,value) }} type="primary">立即开始</Button>
            <div>
            <span style={{ position: 'relative', zIndex: 1, minWidth: '80px', lineHeight: '38px', width: '100%', display: 'inline-block', textAlign: 'center' }}>
                <Button style={{ color: '#1890FF', width: '100%' }}>预约开始时间</Button>
                <DatePicker
                    disabledDate={this.disabledStartTime}
                    onOk={(e) => { this.startDatePickerChange(e, value) }}
                    onChange={this.handleStartDatePickerChange}
                    onOpenChange={this.handleStartOpenChange}
                    open={this.state.startOpen}
                    getPopupContainer={() => document.getElementById('template_item_bott')}
                    placeholder={'开始时间'}
                    format="YYYY/MM/DD HH:mm"
                    showTime={{ format: 'HH:mm' }}
                    style={{ opacity: 0, zIndex: 1, background: '#000000', position: 'absolute', left: 0, width: '100%' }} />
            </span>
            </div>
        </div>
        )
    }
    renderTemplateList = () => {
        const { processTemplateList = [] } = this.props

        const { currentUserOrganizes = [], simplemodeCurrentProject = {} } = this.props
        const { board_id: select_board_id } = simplemodeCurrentProject
        const select_org_id = localStorage.getItem('OrganizationId')


        return (
            processTemplateList.map(value => {
                const { id, name, board_id, org_id, board_name, node_num } = value
                const org_dec = (select_org_id == '0' || !select_org_id) ? `(${getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)})` : ''
                const board_dec = (select_board_id == '0' || !select_board_id) ? `#${board_name}` : ''
                return (
                    <div className={styles.template_item} key={id}>
                        <div className={styles.template_item_top}>
                            <div className={`${globalStyles.authTheme} ${styles.template_logo}`}>
                                &#xe682;
                            </div>
                            <div className={`${globalStyles.authTheme} ${styles.template_dec}`}>
                                <div className={`${styles.template_dec_title}`}>
                                    <span className={`${styles.template_dec_title_instance} `} title={name}>
                                        {name.length > 10 ? name.substr(0, 7) + '...' : name}
                                    </span>
                                    {
                                        (select_board_id == '0' || !select_board_id) && (
                                            <span className={`${styles.template_dec_title_org}`} title={`${board_dec}${org_dec}`}>
                                                {board_dec}
                                                {org_dec}
                                            </span>
                                        )
                                    }
                                </div>
                                <div className={`${styles.template_dec_step}`}>共{node_num}步</div>
                            </div>
                        </div>
                        <div id={'template_item_bott'} className={styles.template_item_bott}>
                            {
                                checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_CREATE, board_id) && (
                                    <Tooltip title={'开始流程'}>
                                        <div className={`${globalStyles.authTheme} ${styles.template_operate}`}
                                            onClick={() => this.handleStartProcess(value)}>&#xe796;</div>
                                    </Tooltip>
                                )
                            }
                            {/* <Tooltip title="开始流程">
                                <Popover trigger="click" title={null} onVisibleChange={this.handleProcessStartConfirmVisible} content={this.renderProcessStartConfirm(value)} icon={<></>} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                    <div className={`${globalStyles.authTheme} ${styles.template_operate}`}>&#xe796;</div>
                                </Popover>
                            </Tooltip> */}

                            {
                                checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_TEMPLATE, board_id) && (
                                    <Tooltip title={'编辑模板'}>
                                        <div className={`${globalStyles.authTheme} ${styles.template_operate} ${styles.template_operate_split}`}
                                            onClick={() => this.handleEditTemplete(value)}
                                        >&#xe7e1;</div>
                                    </Tooltip>
                                )
                            }

                            {
                                checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_TEMPLATE, board_id) && (
                                    <Popconfirm
                                        title="确认删除该模板？"
                                        onConfirm={() => this.handleDelteTemplete(value)}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Tooltip title={'删除模板'}>
                                            <div className={`${globalStyles.authTheme} ${styles.template_operate}`}>&#xe7c3;</div>
                                        </Tooltip>
                                    </Popconfirm>
                                )
                            }
                        </div>
                    </div >
                )
            })
        )
    }
    renderNodata = () => {
        return (
            <div className={styles.tempalte_nodata}>
                <div className={`${globalStyles.authTheme} ${styles.tempalte_nodata_logo}`} >&#xe703;</div>
                <div className={styles.tempalte_nodata_dec}>还没有模版，赶快新建一个吧</div>
                <div className={styles.tempalte_nodata_operate}>
                    <Button type="primary" style={{ width: 182 }} ghost onClick={this.beforeAddTemplateConfirm}>新建模板</Button>
                </div>
            </div>
        )
    }

    render() {
        const { processTemplateList = [] } = this.props
        const { local_board_id, board_select_visible } = this.state
        return (
            <>
                <div className={styles.templates_top}>
                    <div className={`${styles.templates_top_title}`}>流程模板</div>
                    <div className={`${globalStyles.authTheme} ${styles.templates_top_add}`} onClick={this.beforeAddTemplateConfirm}>&#xe8fe;</div>
                </div>
                <div className={`${styles.templates_contain} ${globalStyles.global_vertical_scrollbar}`}>
                    {
                        processTemplateList.length ? (
                            this.renderTemplateList()
                        ) : (
                                this.renderNodata()
                            )
                    }
                </div>
                <SelectBoardModal
                    selectModalBoardIdCalback={this.selectModalBoardIdCalback}
                    setBoardSelectVisible={this.setBoardSelectVisible}
                    modalOkCalback={this.modalOkCalback}
                    visible={board_select_visible}
                    local_board_id={local_board_id}
                />
            </>
        )
    }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    publicProcessDetailModal: {
        processTemplateList
    },
    simplemode: {
        simplemodeCurrentProject = {}
    },
    technological: {
        datas: {
            currentUserOrganizes = [],
            currentSelectOrganize = {},
            userBoardPermissions = []
        }
    },
    publicProcessDetailModal: {
        process_detail_modal_visible
    }
}) {
    return {
        processTemplateList,
        simplemodeCurrentProject,
        currentSelectOrganize,
        currentUserOrganizes,
        userBoardPermissions,
        process_detail_modal_visible
    }
}
