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


    render() {
        return (
            <>
                <div className={infoRemindStyle.add_header}>
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                <RenderContent />
            </>
        )
    }
}

export default DrawerInformContent;
