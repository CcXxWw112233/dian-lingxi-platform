import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, Select } from 'antd'
import RenderContent from './Component'
import infoRemindStyle from './index.less'

@connect(({informRemind: { historyList = [], setInfoRemindList = [], is_add_remind, triggerList }}) => ({
    historyList, setInfoRemindList, is_add_remind, triggerList
  }))
class DrawerInformContent extends Component {

    /**
     * 添加提醒的方法
     * 需要把关联的id以及type类型传入
     */
    addInformRemind() {
        const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {}
        const { avatar, email, name, id, mobile } = userInfo
        console.log(userInfo, 'sss')
        const { dispatch, rela_id, rela_type, setInfoRemindList = [], triggerList = [] } = this.props;
        let new_setInfoRemindList = [...setInfoRemindList];
        // 默认点击添加之后, 修改仓库的关联id`rela_id`以及事件类型, 并提供默认的选中提醒的触发器
        new_setInfoRemindList = new_setInfoRemindList.map(item => {
            let new_item = item
            new_item = {...new_item, rela_id: rela_id, rela_type: rela_type, remind_trigger: triggerList[0].type_code}
            return new_item
        })

       dispatch({
           type: 'informRemind/updateDatas',
           payload: {
               setInfoRemindList: new_setInfoRemindList,
               is_add_remind: true,
               message_consumers: []
           }
       })
        
    }

    render() {
        const { rela_id, user_remind_info } = this.props;
        return (
            <>
                <div className={infoRemindStyle.add_header}
                     onClick={ () => { this.addInformRemind() } }
                >
                    <Icon className={infoRemindStyle.icon} type="plus-circle" />
                    <span className={infoRemindStyle.text}>添加提醒</span>
                </div>
                <RenderContent rela_id={rela_id} user_remind_info={user_remind_info}  />
            </>
        )
    }
}

export default DrawerInformContent;
