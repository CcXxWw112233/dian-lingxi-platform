import React, { Component } from 'react'
import { Button, Dropdown, Icon, Menu, Radio } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import ConfigureStepOne_one from './ConfigureStepOne_one'
import ConfigureStepOne_two from './ConfigureStepOne_two'
import ConfigureStepOne_three from './ConfigureStepOne_three'
import ConfigureStepOne_five from './ConfigureStepOne_five'

export default class ConfigureStepTypeOne extends Component {

  updateConfigureProcess(data, key) { //更新单个数组单个属性
    const { value } = data
    const { processEditDatasRecords = [], processEditDatas = [], processCurrentEditStep, dispatch } = this.props

    const new_processEditDatas = [...processEditDatas]
    const new_processEditDatasRecords_ = [...processEditDatasRecords]

    //更新processEditDatasRecords操作解构赋值避免操作污染
    const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    let newAlltypedata = [...alltypedata]
    let obj = {}
    for (let i = 0; i < newAlltypedata.length; i++) {
      if (newAlltypedata[i]['node_type'] === '1') {
        obj = { ...newAlltypedata[i] }
        obj[key] = value
        newAlltypedata[i] = obj
      }
    }

    new_processEditDatas[processCurrentEditStep][key] = value
    new_processEditDatasRecords_[processCurrentEditStep] = {
      node_type: '1',
      alltypedata: newAlltypedata
    }
    ///更新processEditDatasRecords操作解构赋值避免操作污染

    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: new_processEditDatas,
        processEditDatasRecords: new_processEditDatasRecords_
      }
    })
  }

  //表单填写项
  menuAddFormClick({ key }) {
    const { processEditDatas = [], processCurrentEditStep = 0, } = this.props
    const { form_data = [] } = processEditDatas[processCurrentEditStep]
    //推进人一项
    let obj = {}
    switch (key) {
      case '1':
        obj = { //输入框
          "field_type": "1",
          "property_name": "",
          "default_value": "",
          "verification_rule": "",
          "val_length": "20",
          "is_required": "0"
        }
        break
      case '2':
        obj = {
          "field_type": "2",
          "property_name": "",
          "default_value": "",
          "verification_rule": "redio",
          "is_required": "0",
          "options_data": []
        }
        break
      case '3': //下拉
        obj = { //日期
          "field_type": "3",
          "property_name": "",
          "default_value": "",
          "verification_rule": "SINGLE_DATE_TIME",
          "is_required": "1"
        }
        break
      case '5':
        obj = {
          "field_type": "5",
          "property_name": "附件",
          "limit_file_num": "10",
          "limit_file_type": "1,2,3,4",
          "limit_file_size": "20",
          "is_required": "0"
        }
      default:
        break
    }
    form_data.push(obj)
    this.updateConfigureProcess({ value: form_data }, 'form_data')
  }

  filterForm = (value, key) => {
    const { field_type } = value
    let container = (<div></div>)
    switch (field_type) {
      case '1':
        container = (
          <ConfigureStepOne_one itemKey={key} itemValue={value} />
        )
        break
      case '2':
        container = (
          <ConfigureStepOne_two itemKey={key} itemValue={value} />
        )
        break
      case '3':
        container = (
          <ConfigureStepOne_three itemKey={key} itemValue={value} />
        )
        break
      case '5':
        container = (
          <ConfigureStepOne_five itemKey={key} itemValue={value} />
        )
        break
      default:
        break
    }
    return container
  }

  renderFieldType = () => {
    // const { processEditDatasRecords, processEditDatas, processCurrentEditStep, node_type } = this.props
    // const { form_data = [] } = processEditDatas[processCurrentEditStep]
    // const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    // const form_data = (alltypedata.filter(item => item.node_type == node_type))[0].form_data || []
    return (
      <div>
        <Menu onClick={this.menuAddFormClick.bind(this)} getPopupContainer={triggerNode => triggerNode.parentNode}>
          <Menu.Item key="1">文本</Menu.Item>
          <Menu.Item key="2">选择</Menu.Item>
          <Menu.Item key="3">日期</Menu.Item>
          <Menu.Item key="5">附件</Menu.Item>
        </Menu>
      </div>
    )
  }

  render() {
    const { processEditDatasRecords, processEditDatas, processCurrentEditStep, node_type } = this.props
    const { form_data = [] } = processEditDatas[processCurrentEditStep]
    return (
      <div style={{ position: 'relative' }}>
        <div style={{paddingBottom: '16px', borderBottom: '1px solid #e8e8e8'}}>
          <div>
            {form_data.map((value, key) => {
              return (<div key={key}>{this.filterForm(value, key)}</div>)
            })}
          </div>
          {/* <ConfigureStepOne_one />
          <ConfigureStepOne_two />
          <ConfigureStepOne_three />
          <ConfigureStepOne_five /> */}
          <Dropdown overlayClassName={indexStyles.overlay_pricipal} overlay={this.renderFieldType()} getPopupContainer={() => document.getElementById('addTabsItem')} trigger={['click']}>
            <Button id="addTabsItem" className={indexStyles.add_tabsItem}><span style={{ color: 'rgba(24,144,255,1)' }} className={globalStyles.authTheme}>&#xe782;</span>&nbsp;&nbsp;&nbsp;添加表项</Button>
          </Dropdown>
        </div>
        {/* 填写人 */}
        <div className={indexStyles.fill_person}>
          <span className={`${globalStyles.authTheme} ${indexStyles.label_person}`}>&#xe7b2; 填写人&nbsp;:</span>
          <Radio.Group>
            <Radio>任何人</Radio>
            <Radio>指定人员</Radio>
          </Radio.Group>
        </div>
        {/* 更多选项 */}
        <div className={indexStyles.more_select}>
          <span className={indexStyles.more_label}>... 更多选项 &nbsp;:</span>
          <sapn className={`${indexStyles.complet_deadline} ${indexStyles.select_item}`}>+ 完成期限</sapn>
          <sapn className={`${indexStyles.select_item}`}>+ 关联内容</sapn>
          <sapn className={`${indexStyles.select_item}`}>+ 备注</sapn>
        </div>
        {/* 删除 | 确认 */}
        <div className={indexStyles.step_btn}>
          <Button>删除</Button>
          <Button type="primary">确认</Button>
        </div>
      </div>
    )
  }
}

// 步骤类型为资料收集
ConfigureStepTypeOne.defaultProps = {

}
