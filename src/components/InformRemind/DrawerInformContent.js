import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, Select } from 'antd'
import RenderContent from './Component'
import infoRemindStyle from './index.less'

const { Option } = Select;

@connect(({informRemind: { triggerList, diff_text_term, diff_remind_time,  historyList}}) => ({
    triggerList, diff_text_term, diff_remind_time, historyList
  }))
class DrawerInformContent extends Component {

    /**
     * 添加提醒的方法
     */
    addInformRemind() {
        console.log(1111, 'sss')
        const { dispatch } = this.props;
        dispatch({
            type: 'informRemind/updateDatas',
            payload: {
                is_add_remind: true,
            }
        })
        
    }

    render() {
        const { rela_id } = this.props;
        return (
            <>
                <div className={infoRemindStyle.add_header}
                     onClick={ () => { this.addInformRemind() } }
                >
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                <RenderContent rela_id={rela_id} />
            </>
        )
    }
}

export default DrawerInformContent;
