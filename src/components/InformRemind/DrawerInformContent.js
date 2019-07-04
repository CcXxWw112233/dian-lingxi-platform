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

    /**
     * 点击添加提醒的方法 AddRemind
     * 1. 需要在当前弹框内追加一条信息
     */
    handleAddRemind() {
        // console.log(1111)
        const { dispatch, informRemind } = this.props;
        const { triggerList = [] } = informRemind;
        dispatch({
            type: "informRemind/updateDatas",
            payload: {
                is_add_remind: true,
                defaultTriggerVal: triggerList[0].type_code,
                defaultRemindTimeVal: '',
                defaultTextTermVal: '',
            }
        })
        
    }

    render() {
        return (
            <>
                <div className={infoRemindStyle.add_header} onClick={ () => { this.handleAddRemind() } }>
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                <RenderContent />
            </>
        )
    }
}

export default DrawerInformContent;
