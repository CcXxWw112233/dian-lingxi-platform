import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, Select } from 'antd'
import RenderContent from './Component'
import infoRemindStyle from './index.less'

@connect(({informRemind: { historyList }}) => ({
    historyList
  }))
class DrawerInformContent extends Component {

    state = {
        is_add_remind: false, // 是否点击了添加操作 默认为false 没有点击
    }

    /**
     * 添加提醒的方法
     */
    addInformRemind() {
        // const { dispatch, historyList = [] } = this.props;
        // // 想要改变historyList中的某一条信息, 所以需要将它解构出来
        // let new_history_list = [...historyList]
        // let temp = [
        //     {
        //         remind_trigger: 'task:start:before',
        //         remind_edit_type: 1,
        //         remind_time_type: 'm',
        //         remind_time_value: '1',
        //     }
        // ];
        // new_history_list = new_history_list.map(item => { 
        //     return new_history_list.concat(temp) 
        // })
        // dispatch({
        //   type: 'informRemind/updateDatas',
        //   payload: {
        //     historyList: new_history_list,
        //   }
        // })
       this.setState({
           is_add_remind: true,
       })
        
    }

    render() {
        const { rela_id } = this.props;
        const { is_add_remind } = this.state;
        return (
            <>
                <div className={infoRemindStyle.add_header}
                     onClick={ () => { this.addInformRemind() } }
                >
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                <RenderContent rela_id={rela_id} is_add_remind={is_add_remind}  />
            </>
        )
    }
}

export default DrawerInformContent;
