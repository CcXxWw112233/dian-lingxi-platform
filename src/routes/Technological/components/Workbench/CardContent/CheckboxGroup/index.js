import React, {Component} from 'react'
import {Checkbox, message} from 'antd'

class CheckboxGroup extends Component {
  onItemCheckStatusChange = (e, item) => {
    const {onItemChange} = this.props
    if(e) e.stopPropagation()
    console.log(item, item)
    onItemChange(item)
  }
  render() {
    const {dataList} = this.props
    return(
      <div>
        {dataList.map(({label, checked, disabled}, index) => (<Checkbox key={index} defaultChecked={checked} disabled={disabled} onChange={e => this.onItemCheckStatusChange(e, {label, checked, disabled, index})} >{label}</Checkbox>))}
      </div>
    )
  }
}

CheckboxGroup.defaultProps = {
  isMutuallyExclusive: false, //是不是互斥,也就是说是不是同一时间只能选中列表中的一项
  mutuallyExclusiveIncludeDisabledItem: false, //互斥是否包括被disabled的已选中的项
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
