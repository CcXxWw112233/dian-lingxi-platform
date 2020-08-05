import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from '../index.less'
import commonStyles from '../common.less'
import { Button, Input, Select } from 'antd'

const Option = Select.Option;

export default class CustomFieldCategory extends Component {

  // 字段类型选择
  onFieldsChange = (value) => {
    switch (value) {
      case 'radio': // 表示单选
        
        break;
    
      default:
        break;
    }
  }

  renderPopoverTitle = () => {
    return (
      <div className={indexStyles.title__wrapper}>添加字段</div>
    )
  }

  // 渲染popover组件中的底部 确定按钮
  renderPopoverContentAddMemberBtn = () => {
    return (
      <div className={indexStyles.content__addMemberBtn_wrapper}>
        <Button
          type="primary"
          block
          disabled={true}
        >
          确定
          </Button>
      </div>
    );
  };

  // 渲染内容
  renderPopoverContentCategory = () => {
    return (
      <div>
        <div className={commonStyles.field_item}>
          <label className={commonStyles.label_name}>名称：</label>
          <Input />
        </div>
        <div className={commonStyles.field_item}>
          <label className={commonStyles.label_name}>类型：</label>
          <Select onChange={this.onFieldsChange} style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
            <Option value="radio">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe6af;</span>
              <span>单选</span>
            </Option>
            <Option value="checkbox">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe6b2;</span>
              <span>多选</span>
            </Option>
            <Option value="date">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe7d3;</span>
              <span>日期</span>
            </Option>
            <Option value="number">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe6b0;</span>
              <span>数字</span>
            </Option>
            <Option value="text">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe6b1;</span>
              <span>文本</span>
            </Option>
            <Option value="file">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe6b3;</span>
              <span>文件</span>
            </Option>
            <Option value="member">
              <span className={`${globalStyles.authTheme}`} style={{fontSize: '20px', marginRight: '8px'}}>&#xe7b2;</span>
              <span>成员</span>
            </Option>
          </Select>
        </div>
        <div className={commonStyles.field_item}>
          <label className={commonStyles.label_name}>字段分组：</label>
          <Select style={{ width: '100%' }} />
        </div>
      </div>
    )
  }

  renderPopoverContent = () => {
    return (
      <div className={indexStyles.content__wrapper}>
        <div className={indexStyles.content_category}>{this.renderPopoverContentCategory()}</div>
        <div>{this.renderPopoverContentAddMemberBtn()}</div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <div>{this.renderPopoverTitle()}</div>
        <div>{this.renderPopoverContent()}</div>
      </div>
    )
  }
}
