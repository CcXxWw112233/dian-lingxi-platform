import React, { Component } from 'react'
import { Table } from 'antd';

export default class FlowTables extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }
    componentDidMount() {
        this.setTabledata(this.props.list_type)
    }
    componentWillReceiveProps(nextProps) {
        this.setTabledata(nextProps.list_type)
    }
    setTabledata = (list_type) => {
        const dataSource = []
        for (let i = 0; i < 100; i++) {
            dataSource.push({
                key: i,
                name: `流程${i}流程${i}流程${i}流程${i}`,
                state: '进行中进行中进行中进行中进行中',
                time: '15863107911586310791158631079115863107911586310791',
                originator: '吴彦祖吴彦祖吴彦祖吴彦祖吴彦祖吴彦祖',
            })
        }

        const columns = [
            {
                title: '流程名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
                width: 164
            },
            {
                title: this.renderTitle(list_type).state_title,
                dataIndex: 'state',
                key: 'state',
                ellipsis: true,
                width: 164
            },
            {
                title: this.renderTitle(list_type).time_title,
                dataIndex: 'time',
                key: 'time',
                ellipsis: true,
                width: 164
            },
            {
                title: '发起人',
                dataIndex: 'originator',
                key: 'originator',
                ellipsis: true,
                width: 164
            },
        ];
        this.setState({
            columns,
            dataSource
        })
    }
    renderTitle = (list_type) => {
        let time_title = '步骤完成期限'
        let state_title = '流程状态'
        switch (list_type) {
            case '1':
                time_title = '步骤完成期限'
                state_title = '当前步骤'
                break
            case '2':
                time_title = '流程中止时间'
                break
            case '3':
                time_title = '流程完成时间'
                break
            case '0':
                time_title = '流程开始时间'
                break
            default: break
        }
        return {
            time_title,
            state_title
        }
    }
    renderListHandle = (item) => {
        const { list_type } = this.props
        const name = ''
        const state = ''
        const time = ''
        switch (list_type) {
            case '1':
                state = (
                    <span style={{ color: '#1890FF' }}>当前步骤名称（1/3）</span>
                )
                break
            case '2':
                break
            case '3':
                break
            case '0':
                break
            default: break
        }
        return {
            name,
            state,
            time,
        }
    }
    render() {
        const { dataSource, columns } = this.state
        return (
            <div>
                <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ y: 600, }} />
            </div>
        )
    }
}
