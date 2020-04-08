import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import { Tooltip, Button, Popconfirm } from 'antd'
import { connect } from 'dva'
import { checkIsHasPermissionInBoard } from '../../../../../utils/businessFunction'
import { PROJECT_FLOWS_FLOW_TEMPLATE, PROJECT_FLOWS_FLOW_CREATE } from '../../../../../globalset/js/constant'
import ProcessDetailModal from '../../../../../components/ProcessDetailModal'

@connect(mapStateToProps)
export default class Templates extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    componentDidMount() {
        this.getTemplateList(this.props.simplemodeCurrentProject)
    }
    componentWillReceiveProps(nextProps) {
        const { board_id } = this.props.simplemodeCurrentProject
        const { board_id: next_board_id } = nextProps.simplemodeCurrentProject
        if (board_id != next_board_id) { //切换项目时做请求
            this.getTemplateList(nextProps.simplemodeCurrentProject)
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
        const { id, template_no } = item
        const { dispatch } = this.props
        dispatch({
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
        const { dispatch } = this.props
        const { id } = item
        dispatch({
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
        const { id, board_id } = item
        const { dispatch } = this.props
        dispatch({
            type: 'publicProcessDetailModal/deleteProcessTemplete',
            payload: {
                id,
                board_id
            }
        })
    }

    renderTemplateList = () => {
        const { processTemplateList = [] } = this.props
        return (
            processTemplateList.map(value => {
                const { id, name, board_id } = value
                return (
                    <div className={styles.template_item} key={id}>
                        <div className={styles.template_item_top}>
                            <div className={`${globalStyles.authTheme} ${styles.template_logo}`}>
                                &#xe682;
                            </div>
                            <div className={`${globalStyles.authTheme} ${styles.template_dec}`}>
                                <div className={`${styles.template_dec_title}`}>
                                    <span className={`${styles.template_dec_title_instance} `}>{name}</span>
                                    {
                                        localStorage.getItem('OrganizationId') == '0' && (
                                            <span className={`${styles.template_dec_title_org}`}>#组织名称真的很长很长，长到我也不知道么搞了</span>
                                        )
                                    }
                                </div>
                                <div className={`${styles.template_dec_step}`}>共3步</div>
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
                    <Button type="primary" style={{ width: 182 }} ghost onClick={this.handleAddTemplate}>新建模板</Button>
                </div>
            </div>
        )
    }
    request_flows_templates_params = () => {
        const { board_id } = this.props.simplemodeCurrentProject
        return {
            request_board_id: board_id || '0',
            _organization_id: localStorage.getItem('OrganizationId')
        }
    }
    render() {
        const { processTemplateList = [], process_detail_modal_visible } = this.props
        return (
            <>
                <div className={styles.templates_top}>
                    <div className={`${styles.templates_top_title}`}>流程模板</div>
                    <div className={`${globalStyles.authTheme} ${styles.templates_top_add}`} onClick={this.handleAddTemplate}>&#xe8fe;</div>
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
                {
                    process_detail_modal_visible && (
                        <ProcessDetailModal process_detail_modal_visible={process_detail_modal_visible} request_template_flows_params={this.request_flows_templates_params()} />
                    )
                }
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
        process_detail_modal_visible
    }
}
