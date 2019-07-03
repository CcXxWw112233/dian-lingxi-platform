import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, Select, Dropdown, Button, Menu, Tooltip } from 'antd'
import RenderContent from './Component'
import infoRemindStyle from './index.less'

const { Option } = Select;

@connect(({informRemind = []}) => ({
    informRemind,
}))
class DrawerInformContent extends Component {

    state = {
        
    }

    // 点击添加提醒的事件
    handleAdd() {
        // console.log(1111)
        const { dispatch, informRemind } = this.props;
        const { is_history } = informRemind;
        dispatch({
            type: 'informRemind/updateDatas',
            payload: {
                is_history: !is_history
            }
        })
    }

    render() {
        const { dispatch, informRemind } = this.props;
        return (
            <>
                <div className={infoRemindStyle.add_header} onClick={ () => { this.handleAdd() } }>
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                <RenderContent { ...informRemind } />
            </>
        )
    }
}

export default DrawerInformContent;
