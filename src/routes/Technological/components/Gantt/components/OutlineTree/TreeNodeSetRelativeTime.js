import React, { Component } from 'react'
import { InputNumber, message, Dropdown } from 'antd'
import { connect } from 'dva'
import { caldiffDays, dateFormat } from '../../../../../../utils/util'
import { debounce } from 'lodash'
import { validatePositiveInt } from '../../../../../../utils/verify'
import globalStyles from '@/globalset/css/globalClassName.less'

@connect(mapStateToProps)
export default class TreeNodeSetRelativeTime extends Component {
  constructor(props) {
    super(props)
    this.state = {
      last_input_value: 0,
      input_value: 0
    }
  }
  componentDidMount() {
    this.setDefaultValue(this.props)
  }
  setDefaultValue = props => {
    const { value, base_relative_time } = props
    let defaultValue = 0
    if (!!value && !!base_relative_time) {
      defaultValue = caldiffDays(base_relative_time, value)
    }
    this.setState({
      last_input_value: defaultValue,
      input_value: defaultValue
    })
  }
  componentWillReceiveProps(nextProps) {
    this.setDefaultValue(nextProps)
  }

  onChange = debounce(value => {
    const { input_value } = this.state
    this.setState(
      {
        last_input_value: input_value,
        input_value: value
      },
      () => {
        this.setTime(value)
      }
    )
  }, 300)
  setTime = value => {
    const { time_type, base_relative_time, nodeValue = {} } = this.props
    const { last_input_value, input_value } = this.state
    console.log('sssssssaaa', last_input_value, input_value, value)
    if (!validatePositiveInt(value)) {
      return
    }
    const new_value = Number(value)
    if (new_value > 999) {
      message.warn('设置天数最大支持999天')
      return
    }
    const { tree_type, id } = nodeValue
    const param_time = {
      start_time:
        new Date(dateFormat(base_relative_time, 'yyyy/MM/dd')).getTime() +
        value * 24 * 60 * 60 * 1000,
      due_time:
        new Date(dateFormat(base_relative_time, 'yyyy/MM/dd')).getTime() +
        value * 24 * 60 * 60 * 1000 +
        23 * 60 * 60 * 1000 +
        59 * 60 * 100
    }
    let p_k =
      tree_type == '1' && time_type == 'due_time' ? 'deadline' : time_type
    let action = 'edit_' + (tree_type == '1' ? 'milestone' : 'task')
    if (this.props.onDataProcess) {
      this.props.onDataProcess({
        action,
        param: {
          id,
          [p_k]: param_time[time_type]
        },
        calback: () => {
          nodeValue[time_type] = param_time[time_type]
        },
        errCalback: () => {
          this.setState({
            input_value: last_input_value
          })
        }
      })
    }
  }
  renderInput = () => {
    const {
      nodeValue: { tree_type },
      time_type
    } = this.props
    const { input_value } = this.state
    return (
      <>
        T+
        <InputNumber
          disabled={tree_type == '1' && time_type == 'start_time'}
          value={input_value}
          size="small"
          min={0}
          onChange={this.onChange}
          style={{ width: 50 }}
        />
      </>
    )
  }
  render() {
    const { value, time_type } = this.props
    const description = {
      start_time: '开始',
      due_time: '结束'
    }
    return (
      <div>
        {!!value ? (
          this.renderInput()
        ) : (
          <Dropdown
            trigger={['click']}
            overlay={
              <div className={globalStyles.global_card} style={{ padding: 10 }}>
                {this.renderInput()}
              </div>
            }
          >
            <div
              style={{
                color: 'rgba(0,0,0,0.2)',
                width: '100%',
                height: 24,
                textAlign: 'center'
              }}
            >
              {' '}
              {description[time_type]}
            </div>
          </Dropdown>
        )}
      </div>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: { base_relative_time }
  }
}) {
  return {
    base_relative_time
  }
}
