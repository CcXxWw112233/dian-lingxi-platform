import React, { Component } from 'react'
import commonStyles from '../common.less'
import globalsetStyles from '@/globalset/css/globalClassName.less'
import { Select, Dropdown, Menu, Icon, DatePicker } from 'antd'

export default class DateFieldContent extends Component {

  render() {
    return (
      <div className={commonStyles.custom_field_item_wrapper}>
        <div className={commonStyles.custom_field_item}>
          <div className={commonStyles.c_left}>
            <span className={`${globalsetStyles.authTheme} ${commonStyles.delete_icon}`}>&#xe7fe;</span>
            <div className={commonStyles.field_name}>
              <span className={`${globalsetStyles.authTheme} ${commonStyles.field_name_icon}`}>&#xe7d3;</span>
              <span>日期字段</span>
            </div>
          </div>
          <div className={`${commonStyles.field_value} ${commonStyles.pub_hover}`}>
            <div className={commonStyles.common_select}>
              <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', padding: '0 12px', display: 'inline-block' }}>
                设置日期
                <DatePicker
                  // disabledDate={this.disabledStartTime.bind(this)}
                  // onOk={this.startDatePickerChange.bind(this)}
                  // onChange={this.startDatePickerChange.bind(this)}
                  // getCalendarContainer={triggerNode => triggerNode.parentNode}
                  // placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                  format="YYYY/MM/DD HH:mm"
                  showTime={{ format: 'HH:mm' }}
                  style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: '100%' }} />
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
