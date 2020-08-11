import React, { Component } from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import indexStyles from '../index.less'
import commonStyles from '../common.less'
import { Button, Input, Select } from 'antd'
import InputExport from './InputExport'

const Option = Select.Option;

export default class CustomFieldCategory extends Component {

  state = {
    fieldInputName: '', // 名称值
    selected_fields: '', // 选择的字段类型
    inputList: [{value: ''}], // input列表
  }

  // ------------- 名称事件 S --------------------

  handleChangeFieldName = (e) => {
    let value = e.target.value
    // this.setState({
    //   fieldInputName: value
    // })
  }

  handleChangeFieldNameBlur = (e) => {
    let value = e.target.value
    if (!value || value.trimLR() == '') {
      this.setState({
        fieldInputName: ''
      })
      return
    }
    this.setState({
      fieldInputName: value
    })
  }

  // ------------- 名称事件 E --------------------

  // 字段类型选择
  onFieldsChange = (value, e) => {
    this.setState({
      selected_fields: value,
      inputList: [{value: ''}]
    })
  }

  // 追加一条Input
  handleAddOneTips = () => {
    const { inputList = [] } = this.state
    let new_inputList = [...inputList]
    new_inputList = new_inputList.concat([{ value: '' }])
    this.setState({
			inputList: new_inputList
		}) 
  }

  // 删除一条Input
  handleDeleteInput = (index) => {
    const { inputList = [] } = this.state
    let new_inputList = [...inputList]
    new_inputList = new_inputList.filter((item,i) => i != index)
    console.log(new_inputList, index);
    this.setState({
      inputList: new_inputList
    })
  }

  handleChangeInputValue = (data) => {
    const { value, index } = data
    const { inputList = [] } = this.state
    let new_inputList = [...inputList]
    new_inputList = new_inputList.map((item, i) => {
      let new_item = item
			if (index == i) {
				new_item = { ...new_item, value: value }
			}
			return new_item
    })
    this.setState({
      inputList: new_inputList
    })
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

  // 渲染不同类型选项对应不同内容
  renderPopoverContentWithDiffCategoryDetail = (data) => {
    const { inputList = [] } = this.state
    let mainContent = (<div></div>)
    const { key } = data
    switch (key) {
      case '1': // 表示单选
        mainContent = (
          <div className={commonStyles.field_item}>
            <label className={commonStyles.label_name}>选项：</label>
            {
              inputList && inputList.map((item, index) => {
                return <InputExport 
                inputList={inputList} 
                itemKey={index} 
                itemValue={item} 
                handleAddOneTips={this.handleAddOneTips}
                handleDeleteInput={this.handleDeleteInput}
                handleChangeInputValue={this.handleChangeInputValue} 
                />
              })
            }
          </div>
        )
        break;
      case '2': // 表示多选
        mainContent = (
          <div className={commonStyles.field_item}>
            <label className={commonStyles.label_name}>选项：</label>
            {
              inputList && inputList.map((item, index) => {
                return <InputExport 
                inputList={inputList} 
                itemKey={index} 
                itemValue={item} 
                handleAddOneTips={this.handleAddOneTips}
                handleDeleteInput={this.handleDeleteInput} 
                />
              })
            }
          </div>
        )
        break;
      case '3': // 表示日期
        mainContent = (
          <div className={commonStyles.field_item}>
            <label className={commonStyles.label_name}>精确度：</label>
            <Select style={{width: '100%'}}>
              <Option value={'yy-mm'}>年/月</Option>
              <Option value={'yy-mm-dd'}>年/月/日</Option>
              <Option value={'yy-mm-dd hh'}>年/月/日 时</Option>
              <Option value={'yy-mm-dd hh:mm'}>年/月/日 时:分</Option>
            </Select>
          </div>
        )
        break;
      case '4': // 表示数字
        mainContent = null
        break;
      case '5': // 表示文本
        mainContent = null
        break;
      case '6': // 表示文件
        mainContent = null
        break;
      case '8': // 表示成员
        mainContent = (
          <>
            <div className={commonStyles.field_item}>
              <label className={commonStyles.label_name}>选择限制：</label>
              <Select style={{width: '100%'}}>
                <Option value={'single'}>单人</Option>
                <Option value={'multiple'}>多人</Option>
              </Select>
            </div>
            <div className={commonStyles.field_item}>
              <label className={commonStyles.label_name}>范围限制：</label>
              <Select style={{width: '100%'}}>
                <Option value={'orgazation'}>当前组织</Option>
                <Option value={'board'}>项目内</Option>
              </Select>
            </div>
          </>
        )
        break;
      default:
        break;
    }
    return mainContent
  }

  // 渲染类型选项
  renderPopoverContentSelectedDiffCategory = () => {
    const { selected_fields } = this.state
    return (
      <Select
        optionLabelProp={'label'}
        labelInValue={true} value={[selected_fields]} onSelect={this.onFieldsChange} style={{ width: '100%' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
        <Option value="1" label={'单选'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe6af;</span>
          <span>单选</span>
        </Option>
        <Option value="2" label={'多选'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe6b2;</span>
          <span>多选</span>
        </Option>
        <Option value="3" label={'日期'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe7d3;</span>
          <span>日期</span>
        </Option>
        <Option value="4" label={'数字'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe6b0;</span>
          <span>数字</span>
        </Option>
        <Option value="5" label={'文本'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe6b1;</span>
          <span>文本</span>
        </Option>
        <Option value="6" label={'文件'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe6b3;</span>
          <span>文件</span>
        </Option>
        <Option value="8" label={'成员'}>
          <span className={`${globalStyles.authTheme}`} style={{ fontSize: '20px', marginRight: '8px' }}>&#xe7b2;</span>
          <span>成员</span>
        </Option>
      </Select>
    )
  }

  // 渲染内容
  renderPopoverContentCategory = () => {
    const { fieldInputName, selected_fields = {} } = this.state
    const { customFieldsList: { groups = [] } } = this.props
    return (
      <div>
        <div className={commonStyles.field_item}>
          <label className={commonStyles.label_name}>名称：</label>
          <Input value={fieldInputName} onChange={this.handleChangeFieldName} onBlur={this.handleChangeFieldNameBlur} />
        </div>
        <div className={commonStyles.field_item}>
          <label className={commonStyles.label_name}>类型：</label>
          {this.renderPopoverContentSelectedDiffCategory()}
        </div>
        {this.renderPopoverContentWithDiffCategoryDetail(selected_fields)}
        <div className={commonStyles.field_item}>
          <label className={commonStyles.label_name}>字段分组：</label>
          <Select optionLabelProp={'label'} style={{ width: '100%' }}>
            {
              groups && groups.length && groups.map(item => {
                return (
                  <Option value={item.id} label={item.name}>{item.name}</Option>
                )
              })
            }
          </Select>
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
