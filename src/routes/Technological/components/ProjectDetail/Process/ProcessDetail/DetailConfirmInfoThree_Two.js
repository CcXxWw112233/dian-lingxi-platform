import React from 'react'
import { Input, Select, Cascader } from 'antd'
import indexStyles from './index.less'
import { areaData } from "../../../../../../utils/areaData";
import {validateFixedTel, validateTel} from "../../../../../../utils/verify";

const Option = Select.Option;

export default class DetailConfirmInfoThreeTwo extends React.Component {
  areaChange = (value) => {
    console.log(value)
  }

  updateEdit(data, key) {
    const { itemKey, parentItemKey } = this.props
    const { datas: {  processEditDatas = [], } } = this.props.model
    const { form_data=[] } = processEditDatas[parentItemKey]
    form_data[itemKey][key] = data.value
    this.props.updateDatas({
      processEditDatas
    })
  }

  defaultValueChange(verification_rule, e) {
    this.updateEdit({value: e.target.value}, 'default_value')
  }

  render() {
    const { datas: {  processEditDatas = [] } } = this.props.model
    const { itemKey, parentItemKey } = this.props
    const { form_data=[] } = processEditDatas[parentItemKey]
    const { property_name, default_value, verification_rule, val_length, is_required, } = form_data[itemKey]

    const multipleSelectChildren = [];
    for (let i = 10; i < 36; i++) {
      multipleSelectChildren.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }
    const fiterSelect = (value) => {
      let container = ''
      switch (value) {
        case 'redio':
          container = (
            <div  className={indexStyles.EditFormThreeOneOutItem} style={{ width: '100%'}}>
              <Select defaultValue="lucy" style={{ width: '100%' }}  size={'small'}>
                <Option value="jack">Jack</Option>
                <Option value="lucy">Lucy</Option>
                <Option value="disabled" >Disabled</Option>
                <Option value="Yiminghe">yiminghe</Option>
              </Select>
            </div>
          )
          break
        case 'multiple':
          container = (
            <div  className={indexStyles.EditFormThreeOneOutItem} style={{ width: '100%'}}>
              <Select
                mode="multiple"
                size={'small'}
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={['a10', 'c12']}
              >
                {multipleSelectChildren}
              </Select>
            </div>
          )
          break
        case 'province':
          container = (
            <div  className={indexStyles.EditFormThreeOneOutItem} style={{ width: '100%'}}>
              <p>所在归属地 (必填)</p>
              <div>
                <Cascader options={areaData} onChange={this.areaChange.bind(this)} placeholder="请选择省市区"  style={{ width: '100%'}}/>
              </div>
            </div>
          )
          break
        default:
          container = ''
      }
      return container
    }

    return (
      <div className={indexStyles.EditFormThreeOneOut}>
        <div className={indexStyles.EditFormThreeOneOut_form}>
          <div className={indexStyles.EditFormThreeOneOut_form_left}></div>
          <div className={indexStyles.EditFormThreeOneOut_form_right}>
            {fiterSelect(verification_rule)}
          </div>
        </div>
      </div>
    )
  }
}
