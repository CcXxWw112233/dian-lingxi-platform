import React, { Component } from 'react'
import { Modal, Select } from 'antd';
import { connect } from 'dva'
import { getOrgNameWithOrgIdFilter, setBoardIdStorage } from '../../../../../utils/businessFunction';
import globalStyles from '@/globalset/css/globalClassName.less'

const { Option } = Select;

@connect(mapStateToProps)
export default class SelectBoardModal extends Component {
    onOk = () => {
        const { modalOkCalback } = this.props
        modalOkCalback && modalOkCalback()
    }
    onCancel = () => {
        const { setBoardSelectVisible } = this.props
        setBoardSelectVisible && setBoardSelectVisible(false)
    }
    handleChange = (value) => {
        const { selectModalBoardIdCalback, projectList = [] } = this.props
        const org_id = (projectList.find(item => value == item.board_id) || {}).org_id
        setBoardIdStorage(value, org_id)
        selectModalBoardIdCalback(value)
    }
    render() {
        const { visible, projectList = [], currentUserOrganizes = [], local_board_id } = this.props
        const target_projectList = projectList.filter(item => //过滤掉没有流程应用的
            item.apps.findIndex(item2 => item2.code == 'Flows') != -1
        )
        return (
            <div>
                <Modal
                    destroyOnClose
                    title={<div style={{ textAlign: 'center' }}>选择路径</div>}
                    visible={visible}
                    onOk={this.onOk}
                    style={{ width: 480 }}
                    onCancel={this.onCancel}
                    okButtonProps={{
                        disabled: !local_board_id || local_board_id == '0'
                    }}
                >
                    <Select
                        placeholder={'选择项目'}
                        size={'large'}
                        style={{ width: '100%' }}
                        value={(!local_board_id || local_board_id == '0') ? undefined : local_board_id} onChange={this.handleChange}>
                        {
                            target_projectList.map(item => {
                                const { board_id, board_name, org_id } = item
                                return (
                                    <Option key={board_id} >
                                        <span className={globalStyles.global_ellipsis} style={{ maxWidth: 210 }}>
                                            {board_name}
                                        </span>
                                        {
                                            localStorage.getItem('OrganizationId') == '0' && (
                                                <span className={globalStyles.global_ellipsis}
                                                    style={{ marginLeft: 6, maxWidth: 210, fontSize: 12, color: 'rgba(0,0,0,.45)' }}>
                                                    #{getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)}
                                                </span>
                                            )
                                        }
                                    </Option>
                                )
                            })
                        }
                    </Select>
                    <div style={{ height: 10 }}></div>
                </Modal>
            </div>
        )
    }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    workbench: {
        datas: {
            projectList = []
        }
    },
    technological: {
        datas: { currentUserOrganizes }
    }
}) {
    return {
        projectList,
        currentUserOrganizes
    }
}