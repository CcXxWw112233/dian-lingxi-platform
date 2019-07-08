import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, Select } from 'antd'
import RenderContent from './Component'
import infoRemindStyle from './index.less'

@connect(({informRemind: { historyList = [], setInfoRemindList = [], is_add_remind }}) => ({
    historyList, setInfoRemindList, is_add_remind
  }))
class DrawerInformContent extends Component {

    /**
     * 添加提醒的方法
     * 需要把关联的id以及type类型传入
     */
    addInformRemind() {
        const { dispatch, rela_id, rela_type, setInfoRemindList = [] } = this.props;
        let new_setInfoRemindList = [...setInfoRemindList];
        
        new_setInfoRemindList = new_setInfoRemindList.map(item => {
            let new_item = item
            new_item = {...new_item, rela_id: rela_id, rela_type: rela_type}
            return new_item
        })
        console.log(new_setInfoRemindList, 'sss')

       dispatch({
           type: 'informRemind/updateDatas',
           payload: {
               setInfoRemindList: new_setInfoRemindList,
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
                <RenderContent rela_id={rela_id}  />
            </>
        )
    }
}

export default DrawerInformContent;
