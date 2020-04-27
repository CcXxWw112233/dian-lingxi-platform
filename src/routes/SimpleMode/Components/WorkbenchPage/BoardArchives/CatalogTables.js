import React, { Component } from 'react'
import { Table } from 'antd';
import { timestampToTimeNormal, filterFileFormatType } from '../../../../../utils/util';
import { connect } from 'dva';
import { getOrgNameWithOrgIdFilter, getSubfixName } from '../../../../../utils/businessFunction';
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from './index.less';
const dataSource = [
    {
        name: '档案1',
        originator: '吴彦祖',
        updateTime: '1587894708',
        operate: '',
        type: '0',
    },
    {
        name: '档案2',
        originator: '金城武',
        updateTime: '1587894708',
        operate: '',
        type: '1'
    },
    {
        name: '这是文件.jpg',
        originator: '吴彦祖',
        updateTime: '1587894708',
        operate: '',
        size: '120MB',
        type: '2'
    },
    {
        name: '档案2',
        originator: '金城武',
        updateTime: '1587894708',
        operate: ''
    },
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
    },
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
    },
]
@connect(mapStateToProps)
export default class CatalogTables extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view_type: '0', //0项目视图 1文件列表视图
            columns: [],
            dataSource: [], //{ type: '',} //type 0/1/2表示项目/文件夹/文件
        }
        this.columns = [
            {
                title: this.renderTitleName(),
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                width: 230,
                render: (text, item) => {
                    return this.renderKeyName(item)
                }
            },
            {
                title: this.renderOriginator(),
                dataIndex: 'originator',
                key: 'originator',
                ellipsis: true,
                width: 230,
                render: (_, item) => {
                    const { originator, size, type } = item
                    if (type == '0' || !type) {
                        return originator
                    } else if (type == '1') {
                        return ''
                    } else if (type == '2') {
                        return size
                    } else {

                    }
                }
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

    }
    componentDidMount() {
        this.setTableData()
    }
    tableRowClick = () => {

    }
    setTableData = () => {
        this.setState({
            columns: this.columns,
            dataSource
        })
    }

    // 列表name
    renderKeyName = (item) => {
        let name_dec = item
        const { name, board_name, org_id, board_id, type } = item
        const { currentUserOrganizes = [], } = this.props
        const select_org_id = localStorage.getItem('OrganizationId')
        const org_dec = (select_org_id == '0' || !select_org_id) ? `(${getOrgNameWithOrgIdFilter(org_id, currentUserOrganizes)})` : ''
        const board_dec = `#${board_name}`
        const is_board = type == '0' || !type
        const is_folder = type == '1'
        const is_file = type == '2'

        return (
            <div style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                <>
                    <div style={{ marginRight: 4 }}>
                        {
                            is_board && (
                                <span className={`${globalStyles.authTheme}`} style={{ fontSize: 30, color: '#40A9FF', marginRight: 4 }}>&#xe716;</span>
                            )
                        }
                        {
                            is_folder && (
                                <span className={`${globalStyles.authTheme}`} style={{ fontSize: 24, color: '#40A9FF', marginRight: 4 }}>&#xe6c4;</span>
                            )
                        }
                        {
                            is_file && (
                                <span className={`${globalStyles.authTheme}`}
                                    dangerouslySetInnerHTML={{ __html: filterFileFormatType(getSubfixName(name)) }}
                                    style={{ fontSize: 30, color: '#40A9FF', marginRight: 4 }}
                                >
                                </span>
                            )
                        }
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
                </>
            </div>
        )
    }
    // 表头name
    renderTitleName = (item) => {
        const { view_type } = this.state
        let name = ''
        if (view_type == '0') {
            name = '档案'
        } else if (view_type == '1') {
            name = '文件'
        }
        return `${name}名称`
    }
    // 表头上传人
    renderOriginator = () => {
        const { view_type } = this.state
        if (view_type == '0') {
            return '上传人'
        } else if (view_type == '1') {
            return '大小'
        } else {

        }
    }
    // 列表操作
    renderKeyOperate = (item) => {
        const { type } = item
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: 20 }}>
                {
                    type == '0' && (
                        <div className={`${globalStyles.authTheme}  ${indexStyles.table_operate}`} >&#xe717;</div>
                    )
                }
                {
                    type == '2' && (
                        <div className={`${globalStyles.authTheme}  ${indexStyles.table_operate}`} style={{ marginLeft: 16 }}>&#xe7f1;</div>
                    )
                }
            </div>
        )
    }
    // 表头操作
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