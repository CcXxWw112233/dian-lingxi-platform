import React, { Component } from 'react'
import { Tooltip, Modal } from 'antd'
import { connect } from 'dva'
import globalStyles from '@/globalset/css/globalClassName.less'
import DrawInformRemindModal from './DrawInformRemindModal'
import DrawerInformContent from './DrawerInformContent'
import infoRemindStyle from './index.less'

@connect(({informRemind = []}) => ({
    informRemind,
}))
export default class index extends Component {

    state = {
        visible: '',
        title: '通知提醒',
    }

    // 通知提醒的点击事件
    handleInformRemind() {
        const { dispatch, rela_type } = this.props;
        dispatch({
            type: "informRemind/getTriggerList",
            payload: {
                rela_type
            }
        })
        this.setState({
            visible: true
        })
    }

    // 点击遮罩层或右上角叉或取消按钮的回调
    onCancel() {
        this.setState({
            visible: false,
        })
    }

    // 点击确定时的回调
    onOk() {
        this.setState({
            visible: false,
        })
    }

    render() {
        // console.log(this.props)
        const { visible, title, } =this.state;
        const { rela_type } = this.props
        return (
            <>
                <Tooltip placement="top" title="通知提醒" arrowPointAtCenter>
                    <span 
                        className={`${globalStyles.authTheme} ${globalStyles.inform_remind}`}
                        onClick={ () => { this.handleInformRemind() } }
                    >
                        &#xe637;
                    </span>
                </Tooltip>
                <div className={infoRemindStyle.wrapperInfo}>
                    <DrawInformRemindModal
                        title={title}
                        visible={visible}
                        width={560}
                        zIndex={1007}
                        maskClosable={false}
                        destroyOnClose
                        mask={true}
                        onOk={this.onOk.bind(this)}
                        onCancel={this.onCancel.bind(this)}
                        overInner={<DrawerInformContent  rela_type={rela_type}/>}
                    />
                </div>
            </>
        )
    }
}
