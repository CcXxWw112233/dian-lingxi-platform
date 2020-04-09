import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import { Tooltip, Button, Popconfirm } from 'antd'
import { connect } from 'dva'
import { checkIsHasPermissionInBoard, setBoardIdStorage, getOrgNameWithOrgIdFilter } from '../../../../../utils/businessFunction'
import { PROJECT_FLOWS_FLOW_TEMPLATE, PROJECT_FLOWS_FLOW_CREATE } from '../../../../../globalset/js/constant'
import SelectBoardModal from './SelectBoardModal'
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
                        <div className={styles.template_item_bott}>
                            {
                                checkIsHasPermissionInBoard(PROJECT_FLOWS_FLOW_CREATE, board_id) && (
                                    <Tooltip title={'开始流程'}>
                                        <div className={`${globalStyles.authTheme} ${styles.template_operate}`}
                                            onClick={() => this.handleStartProcess(value)}>&#xe796;</div>
                                    </Tooltip>
                                )
                            }

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
            currentSelectOrganize = {}
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
        process_detail_modal_visible
    }
}
