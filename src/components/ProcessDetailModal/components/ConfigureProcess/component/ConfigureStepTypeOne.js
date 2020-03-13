import React, { Component } from 'react'
import { Button, Dropdown, Icon, Menu, Radio, Select, InputNumber } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import ConfigureStepOne_one from './ConfigureStepOne_one'
import ConfigureStepOne_two from './ConfigureStepOne_two'
import ConfigureStepOne_three from './ConfigureStepOne_three'
import ConfigureStepOne_five from './ConfigureStepOne_five'
import NameChangeInput from '@/components/NameChangeInput'
import { connect } from 'dva'

const Option = Select.Option;

@connect(mapStateToProps)
export default class ConfigureStepTypeOne extends Component {

  constructor(props) {
    super(props)
  }

  deepCopy = (source) => {
    const isObject = (obj) => {
      return typeof obj === 'object' && obj !== null
    }
    if (!isObject(source)) return source; //如果不是对象的话直接返回
    let target = Array.isArray(source) ? [] : {} //数组兼容
    for (var k in source) {
      if (source.hasOwnProperty(k)) {
        if (typeof source[k] === 'object') {
          target[k] = this.deepCopy(source[k])
        } else {
          target[k] = source[k]
        }
      }
    }
    return target
  }

  updateConfigureProcess = (data, key) => { //更新单个数组单个属性
    const { value } = data
    const { processEditDatas = [], itemKey, itemValue, dispatch } = this.props
    const new_processEditDatas = [...processEditDatas]
    new_processEditDatas[itemKey][key] = value
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: new_processEditDatas,
      }
    })
  }

  // 任何人 | 指定人
  assigneeTypeChange = (e) => {
    this.updateConfigureProcess({ value: e.target.value }, 'assignee_type')
  }
  // 完成期限
  deadlineValueChange = (value) => {
    this.updateConfigureProcess({ value: value.toString() }, 'deadline_value')
  }
  deadlineTypeValueChange = (value) => {
    this.updateConfigureProcess({ value: value }, 'deadline_type')
    this.updateConfigureProcess({ value: 1 }, 'deadline_value')
  }

  // 添加节点备注事件
  handleRemarksWrapper = (e) => {
    e && e.stopPropagation()
    this.updateConfigureProcess({ value: false }, 'is_click_node_description')
  }

  handleRemarksContent = (e) => {
    e && e.stopPropagation()
    this.updateConfigureProcess({ value: true }, 'is_click_node_description')
  }

  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    if (val == "" || val == " " || !val) {
      this.updateConfigureProcess({ value: '' }, 'description')
      this.updateConfigureProcess({ value: false }, 'is_click_node_description')
      return
    }
    this.updateConfigureProcess({ value: val }, 'description')
    this.updateConfigureProcess({ value: false }, 'is_click_node_description')
  }

  titleTextAreaChangeClick = (e) => {
    e && e.stopPropagation()
  }

  //表单填写项
  menuAddFormClick = ({ key }) => {
    const { processEditDatas = [], processCurrentEditStep = 0, itemValue, itemKey } = this.props
    const { forms = [] } = processEditDatas[itemKey]
    //推进人一项
    let obj = {}
    switch (key) {
      case '1':
        obj = { // 表示文本
          "field_type": "1",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
          "title": "文本输入",//标题
          "prompt_content": "请填写内容",//提示内容
          "is_required": "0",//是否必填 1=必须 0=不是必须
          "verification_rule": "",//校验规则
          "val_min_length": "",//最小长度
          "val_max_length": ""//最大长度
        }
        break
      case '2':
        obj = {
          "field_type": "2",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
          "title": "下拉选择",//标题
          "prompt_content": "请选择内容",//提示内容
          "is_required": "0",//是否必填 1=必须 0=不是必须
          "is_multiple_choice": "0",//是否多选 1=是 0=否
          "options": [
            {
              "key": '0',
              "value": '选项1',
            }
          ]
        }
        break
      case '3': //下拉
        obj = { //日期
          "field_type": "3",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
          "title": "日期选择",//标题
          "prompt_content": "请选择日期",//提示内容
          "is_required": "0",//是否必填 1=必须 0=不是必须
          "date_range": "1",//日期范围 1=单个日期 2=开始日期~截止日期
          "date_precision": "2"//日期精度 1=仅日期 2=日期+时间
        }
        break
      case '5':
        obj = {
          "field_type": "5",//类型 1=文本 2=选择 3=日期 4=表格 5=附件
          "title": "附件上传",//标题
          "prompt_content": "",//提示内容
          "is_required": "0",//是否必填 1=必须 0=不是必须
          "limit_file_num": "10",//上传数量
          "limit_file_type": [//限制上传类型(文件格式) document=文档 image=图像 audio=音频 video=视频
            "document", "image", "audio", "video"
          ],
          "limit_file_size": "20"//上传大小限制
        }
      default:
        break
    }
    forms.push(obj)
    this.updateConfigureProcess({ value: forms }, 'forms')
  }

  // 渲染不同的表项
  filterForm = (value, key) => {
    const { field_type } = value
    const { itemKey, itemValue } = this.props
    let container = (<div></div>)
    switch (field_type) {
      case '1':
        container = (
          <ConfigureStepOne_one updateConfigureProcess={this.updateConfigureProcess} itemKey={key} itemValue={value} parentKey={itemKey} parentValue={itemValue} />
        )
        break
      case '2':
        container = (
          <ConfigureStepOne_two updateConfigureProcess={this.updateConfigureProcess} itemKey={key} itemValue={value} parentKey={itemKey} parentValue={itemValue} />
        )
        break
      case '3':
        container = (
          <ConfigureStepOne_three updateConfigureProcess={this.updateConfigureProcess} itemKey={key} itemValue={value} parentKey={itemKey} parentValue={itemValue} />
        )
        break
      case '5':
        container = (
          <ConfigureStepOne_five updateConfigureProcess={this.updateConfigureProcess} itemKey={key} itemValue={value} parentKey={itemKey} parentValue={itemValue} />
        )
        break
      default:
        break
    }
    return container
  }

  renderFieldType = () => {
    return (
      <div>
        <Menu onClick={this.menuAddFormClick} getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Menu.Item key="1">文本</Menu.Item>
          <Menu.Item key="2">选择</Menu.Item>
          <Menu.Item key="3">日期</Menu.Item>
          <Menu.Item key="5">附件</Menu.Item>
        </Menu>
      </div>
    )
  }

  renderMoreSelect = () => {

    return (
      <div></div>
    )
  }

  render() {
    const { itemValue, processEditDatas = [], itemKey } = this.props
    const { forms = [] } = processEditDatas[itemKey]
    const { assignee_type, deadline_type, deadline_value, description, is_click_node_description } = itemValue
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ paddingBottom: '16px', borderBottom: '1px solid #e8e8e8' }} onClick={(e) => { e && e.stopPropagation() }}>
          <div>
            {forms.map((value, key) => {
              return (<div key={`${key}-${value}`}>{this.filterForm(value, key)}</div>)
            })}
          </div>
          {/* <ConfigureStepOne_one />
          <ConfigureStepOne_two />
          <ConfigureStepOne_three />
          <ConfigureStepOne_five /> */}
          <Dropdown overlayClassName={indexStyles.overlay_addTabsItem} overlay={this.renderFieldType()} getPopupContainer={() => document.getElementById('addTabsItem')} trigger={['click']}>
            <Button id="addTabsItem" className={indexStyles.add_tabsItem}><span style={{ color: 'rgba(24,144,255,1)' }} className={globalStyles.authTheme}>&#xe782;</span>&nbsp;&nbsp;&nbsp;添加表项</Button>
          </Dropdown>
        </div>
        {/* 填写人 */}
        <div className={indexStyles.fill_person} onClick={(e) => { e && e.stopPropagation() }}>
          <span className={`${globalStyles.authTheme} ${indexStyles.label_person}`}>&#xe7b2; 填写人&nbsp;:</span>
          <Radio.Group style={{ lineHeight: '48px' }} value={assignee_type} onChange={this.assigneeTypeChange}>
            <Radio value="1">任何人</Radio>
            <Radio value="2">指定人员</Radio>
          </Radio.Group>
        </div>
        {/* 更多选项 */}
        <div className={indexStyles.more_select}>
          <span className={indexStyles.more_label}>... 更多选项 &nbsp;:</span>
          <sapn className={`${indexStyles.select_item}`}>+ 完成期限</sapn>
          {/* <sapn className={`${indexStyles.select_item}`}>+ 关联内容</sapn> */}
          <sapn className={`${indexStyles.select_item}`}>+ 备注</sapn>
        </div>
        {/* 完成期限 */}
        <div className={`${indexStyles.complet_deadline}`}>
          <span style={{ fontWeight: 900, marginRight: '2px' }} className={globalStyles.authTheme}>&#xe686;</span>
          <span>完成期限 &nbsp;: </span>
          <InputNumber precision="0.1" min={1} max={deadline_type == 'h' ? 24 : deadline_type == 'd' ? 30 : 12} value={deadline_value} onChange={this.deadlineValueChange} className={indexStyles.select_number} />
          <Select className={indexStyles.select_day} value={deadline_type} onChange={this.deadlineTypeValueChange}>
            <Option value="hour">时</Option>
            <Option value="day">天</Option>
            <Option value="month">月</Option>
          </Select>
          <span className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
        </div>
        {/* 备注 */}
        <div onClick={this.handleRemarksWrapper} className={`${indexStyles.select_remarks}`}>
          <span className={globalStyles.authTheme}>&#xe636; 备注 &nbsp;:</span>
          <span className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
          {
            !is_click_node_description ? (
              <div onClick={(e) => { this.handleRemarksContent(e) }} className={indexStyles.remarks_content}>{description != '' ? description : '添加备注'}</div>
            ) : (
                <NameChangeInput
                  autosize
                  onBlur={this.titleTextAreaChangeBlur}
                  onPressEnter={this.titleTextAreaChangeBlur}
                  onClick={this.titleTextAreaChangeClick}
                  autoFocus={true}
                  goldName={''}
                  nodeName={'input'}
                  style={{ display: 'block', fontSize: 12, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', marginTop: '4px' }}
                />
              )
          }

        </div>
        {/* 关联内容 */}
        {/* <div className={indexStyles.select_related}>
          <span className={globalStyles.authTheme}>&#xe7f5; 关联内容 &nbsp; :</span>
          <span className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
          <div className={indexStyles.related_content}>添加关联</div>
        </div> */}
      </div>
    )
  }
}

// 步骤类型为资料收集
ConfigureStepTypeOne.defaultProps = {

}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [], processCurrentEditStep } }) {
  return { processEditDatas, processCurrentEditStep }
}