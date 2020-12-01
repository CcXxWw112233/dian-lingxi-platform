import { Select, Divider, Checkbox } from 'antd'
import React from 'react'
import styles from './index.less'

export default class MultipleSelect extends React.Component {
  state = {
    checkAll: false,
    checked: []
  }
  // 多选操作
  setOption = val => {
    const { options = [], onChange } = this.props
    this.setState({
      checked: val,
      checkAll: val.length === options.length
    })
    onChange && onChange(val)
  }

  checkAllOption = val => {
    const { options, valueKey = 'value', onChange } = this.props
    // console.log(val)
    let check = val.target.checked
    this.setState(
      {
        checked: check ? (options || []).map(item => item[valueKey]) : [],
        checkAll: check
      },
      () => {
        onChange && onChange(this.state.checked)
      }
    )
  }

  render() {
    const {
      options,
      showCheckAll,
      checkBoxLabel,
      labelKey,
      valueKey
    } = this.props
    const { checkAll, checked } = this.state
    const config = showCheckAll
      ? {
          dropdownRender: menu => (
            <div>
              {menu}
              <Divider style={{ margin: '2px 0' }} />
              <div
                style={{
                  padding: '4px 8px 8px 8px',
                  cursor: 'pointer'
                }}
                onMouseDown={e => e.preventDefault()}
              >
                <Checkbox
                  checked={checkAll}
                  onChange={this.checkAllOption}
                  indeterminate={
                    (checked || []).length &&
                    checked.length < (options || []).length
                  }
                >
                  {checkBoxLabel || '全选'}
                </Checkbox>
              </div>
            </div>
          )
        }
      : {}
    return (
      <Select
        className={styles.select_container}
        {...this.props}
        {...config}
        maxTagCount={this.props.maxTagCount || 1}
        onChange={this.setOption}
        mode="multiple"
        value={checked}
      >
        {options.map(item => {
          return (
            <Select.Option
              key={valueKey ? item[valueKey] : item.value}
              value={valueKey ? item[valueKey] : item.value}
            >
              {labelKey ? item[labelKey] : item.label}
            </Select.Option>
          )
        })}
      </Select>
    )
  }
}
