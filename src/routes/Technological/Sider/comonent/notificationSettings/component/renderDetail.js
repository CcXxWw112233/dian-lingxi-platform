import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col } from 'antd'
import styles from '../NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'
import CommonOptions from './CommonOptions'

export default class renderDetail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            show_down_arrow: true, //展示项目向下的箭头 默认为true 显示
        }
    }

    // 改变箭头的状态
    handleArrow = (id, index) => {
        const { show_down_arrow } = this.state
        const { new_notice_list } = this.props
        new_notice_list && new_notice_list.map((item, i) => {
            if (index == i) {
                this.setState({
                    show_down_arrow: !show_down_arrow,
                })
            }
        })
    }

    // 点击还原事件
    recoverDefault = () => {
        
    }

     /**
     * 项目的选项改变事件
     * 这是子组件要调用父组件的方法
     * @param {Object} e 选中的事件对象选项
     * @param {String} id 每一组对应的id
     */
    chgEveryOptions = (e, id) => {
        const { new_default_options, temp_options } = this.props
        let val = e.target.value
        // console.log(val, id, 'sss')
        
        if (temp_options.indexOf(val) != -1) { // 表示存在
            const arr = this.removeByValue(temp_options, val)
            // 这里调用父组件的方法
            this.props.updateParentList(arr)
        } else {
            temp_options.push(val)
            // 这里调用父组件的方法
            this.props.updateParentList(temp_options)
        }
        // 在这里调用父组件的方法控制还原显示的方法
        this.props.chgDetailDisplayBlock(val, temp_options)
        // console.log(temp_options, 'sssss_1')
    }

    //删除数组中指定元素
    removeByValue = (arr = [], val) => {
        let temp = arr
        for (var i = 0; i < temp.length; i++) {
            if (temp[i] == val) {
                temp.splice(i, 1);
                break;
            }
        }
        return arr
    }


    render() {
        const { show_down_arrow, show_task_down_arrow } = this.state
        // console.log(temp_options, 'ssss')
        const { new_notice_list, new_default_options} = this.props
        const datas = {
            show_down_arrow,
        }

        return (
            <div>
                {
                    new_notice_list && new_notice_list.map((item, index) => {
                        return (
                           <CommonOptions {...datas} key={item.id} index={index} itemVal={item} default_options={new_default_options} chgEveryOptions={this.chgEveryOptions} handleArrow={ this.handleArrow } />
                        )
                    })
                }
            </div>
        )
    }
}
