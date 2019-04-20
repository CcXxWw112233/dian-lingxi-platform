import React, {Component} from 'react'
import {Checkbox, message} from 'antd'
import styles from './index.less'

class CheckboxGroup extends Component {
  onItemCheckStatusChange = (e, item) => {
    const {onItemChange} = this.props
    if(e) e.stopPropagation()
    onItemChange(Object.assign({}, item, {checked: e.target.checked}))
  }
  render() {
    const {dataList} = this.props
    return(
      <div className={styles.wrapper}>
        {dataList.map(({label, checked, disabled}, index) => (<Checkbox style={{marginLeft: '0'}} key={index} defaultChecked={checked} disabled={disabled} onChange={e => this.onItemCheckStatusChange(e, {label, checked, disabled, index})} >{label}</Checkbox>))}
      </div>
    )
  }
}

CheckboxGroup.defaultProps = {
  dataList: [ //checkbox 数据列表
    {
      label: '我负责的任务', //item label
      checked: true, //是否选中： true || false
      disabled: true //是否禁用
    },
    {
      label: '我创建的任务',
      checked: false,
    },
    {
      label: '我关注的任务',
      checked: false,
    },
    {
      label: '已完成的任务',
      checked: false,
    }
  ],
  onItemChange: function() {
    message.error('CheckboxGroup component Need callback: onItemChange')
  }
}

export default CheckboxGroup
