// 渲染内容的组件
import React, { Component } from 'react'
import { connect } from 'dva'
import RenderHistory from './RenderHistory'
import infoRemindStyle from '../index.less'


@connect(({informRemind: { historyList }}) => ({
  historyList,
}))
export default class RenderContent extends Component {

    state = {
      is_show_other_select: true, // 是否显示其他选择框 默认为 true 显示
      is_show_data_picker: false, // 是否是自定义时间 显示日历框 默认为 false 不显示
    }

      /**
     * 改变选项的类型切换的方法
     * 如果 `remind_edit_type` 为1 就显示后面两项
     * 如果 `remind_edit_type` 为2 | 3  就不显示后面两项
     * 注意 `remind_edit_type` 为3 的时候,需要显示日历来选择时间 并将结果转换成时间戳
     * @param {String} type 类型
     */ 
    handleTriggerChg(id,type, code) {
      console.log(id, type, code, 'lll')
      const { dispatch } = this.props;
      if (type == 1) {
        this.setState({
          is_show_other_select: true,
          is_show_data_picker: false,
        })
      } else if (type == 2) {
        this.setState({
          is_show_other_select: false,
          is_show_data_picker: false,
        })
      } else if (type == 3) {
        this.setState({
          is_show_other_select: false,
          is_show_data_picker: true,
        })
      }
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          currentId: id,
          is_edit_status: 1, // 更改编辑的状态
          is_icon_status: 4, // 更改小图标的状态
          remind_trigger: code, // 更改选项Option的类型
        }
      })
  }


    // 不同时间的选择
    onDiffRemindTime(value) {
      console.log(value)
      const { dispatch } = this.props;
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          remind_time_value: value
        }
      })
    }

    // 不同的字段选择
    onDiffTextTerm(type) {
      const { dispatch } = this.props;
      dispatch({
        type: 'informRemind/updateDatas',
        payload: {
          remind_time_type: type,
        }
      })
    }

    render() {
      const { historyList = [] } = this.props
        return (
            <div className={infoRemindStyle.content}>
                { historyList.map(value => {
                  const { id } = value
                  return <RenderHistory itemValue={value} key={id} />
                 }) 
                }
            </div>
        )
    }
}
