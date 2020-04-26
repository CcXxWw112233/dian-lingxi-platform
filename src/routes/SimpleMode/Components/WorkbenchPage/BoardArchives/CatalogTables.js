import React, { Component } from 'react'
import { Table } from 'antd';
import { timestampToTimeNormal } from '../../../../../utils/util';
import { connect } from 'dva';
import { getOrgNameWithOrgIdFilter } from '../../../../../utils/businessFunction';
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less';

@connect(mapStateToProps)
export default class CatalogTables extends Component {
    constructor(props) {
        super(props)
        this.state = {
            columns: [],
            dataSource: []
        }
    }
    componentDidMount() {
        this.setTableData()
    }
    tableRowClick = () => {

    }
    setTableData = () => {
        const dataSource = [
            {
                name: '档案1',
                originator: '吴彦祖',
                updateTime: '1587894708',
                operate: ''
            },
            {
                name: '档案2',
                originator: '金城武',
                updateTime: '1587894708',
                operate: ''
            }
        ]
        const columns = [
            {
                title: '档案名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                width: 230,
                render: (text, item) => {
                    return this.renderKeyName(item)
                }
            },
            {
                title: '上传人',
                dataIndex: 'originator',
                key: 'originator',
                ellipsis: true,
                width: 230,
            },
            {
                title: '更新时间',
                dataIndex: 'updateTime',
                key: 'updateTime',
                ellipsis: true,
                width: 230,
                render: (text) => {
                    return (
                        timestampToTimeNormal(text)
                    )
                }
            },
            {
                title: this.renderTitleOperate(),
                dataIndex: 'operate',
                key: 'operate',
                ellipsis: true,
                width: 230,
                render: (_, item) => {
                    return (
                        this.renderKeyOperate(item)
                    )
                }
            },
        ]
        this.setState({
            columns,
            dataSource
        })
    }

    renderKeyName = (item) => {
        let name_dec = item
        const { name, board_name, org_id, board_id } = item
        const { currentUserOrganizes = [], } = this.props
        const select_org_id = localStorage.getItem('OrganizationId')
        const org_dec = (select_org_id == '0' || !select_org_id) ? `(${getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)})` : ''
        const board_dec = `#${board_name}`
        return (
            <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                <div>
                    <span className={`${globalStyles.authTheme}`} style={{ fontSize: 30, color: '#40A9FF', marginRight: 4 }}>&#xe716;</span>
                </div>
                {
                    select_org_id == '0' ? (
                        <div>
                            <p style={{ marginBottom: 0 }}>
                                <span>{name}</span>
                            </p>
                            <p style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 4 }}>
                                {org_dec}
                            </p>
                        </div>
                    ) : (
                            name
                        )
                }
            </div>
        )
    }
    renderKeyOperate = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
                <div className={`${globalStyles.authTheme}  ${indexStyles.table_operate}`} style={{ marginRight: 16 }}>&#xe717;</div>
                <div className={`${globalStyles.authTheme}  ${indexStyles.table_operate}`} >&#xe7f1;</div>
            </div>
        )
    }
    renderTitleOperate = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div className={`${globalStyles.authTheme}  ${indexStyles.table_operate_2} ${indexStyles.table_operate_2_selected}`} style={{ marginRight: 16 }}>&#xe7f5;</div>
                <div className={`${globalStyles.authTheme}  ${indexStyles.table_operate_2}`} >&#xe6c5;</div>
            </div>
        )
    }
    rowSelection = () => {
        return {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        }
    };
    render() {
        const { workbenchBoxContent_height = 700 } = this.props
        const scroll_height = workbenchBoxContent_height - 200
        const { dataSource = [], columns = [] } = this.state

        return (
            <div>
                <Table
                    onRow={record => {
                        return {
                            onClick: e => this.tableRowClick(record), // 点击行
                        };
                    }}
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    rowSelection={this.rowSelection()}
                    scroll={{ y: scroll_height, }} />
            </div>
        )
    }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
    simplemode: {
        simplemodeCurrentProject = {}
    },
    technological: {
        datas: {
            currentUserOrganizes = [],
        }
    }
}) {
    return {
        simplemodeCurrentProject,
        currentUserOrganizes
    }
}