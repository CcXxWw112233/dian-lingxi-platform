import React, { Component } from 'react'
import { Tooltip, Modal } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import DrawInformRemindModal from './DrawInformRemindModal'
import DrawerInformContent from './DrawerInformContent'
import infoRemindStyle from './index.less'

export default class index extends Component {

    state = {
        visible: true,
        title: '通知提醒',
    }

    // 通知提醒的点击事件
    handleInformRemind() {
        console.log(11111)
    }

    render() {
        const { visible, title } =this.state;
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
                        footer={null}
                        mask={true}
                        // onCancel={this.onCancel.bind(this)}
                        overInner={<DrawerInformContent />}
                    />
                </div>
            </>
        )
    }
}
