import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Button, message } from 'antd'
import { currentNounPlanFilterName } from '../../utils/businessFunction'
import { MESSAGE_DURATION_TIME, TASKS } from '../../globalset/js/constant'
import globalStyles from '../../globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { caldiffDays } from '../../utils/util'
import { updateTaskVTwo_2 } from '../../services/technological/task'
import { isApiResponseOk } from '../../utils/handleResponseData'

@connect(mapStateToProps)
export default class index extends Component {
  state = {
    visible: false,
    optionsList: [
      {
        label: '0.5天',
        value: '0.5'
      },
      {
        label: '1天',
        value: '1'
      },
      {
        label: '2天',
        value: '2'
      },
      {
        label: '3天',
        value: '3'
      },
      {
        label: '5天',
        value: '5'
      }
    ]
  }

  onCancel = () => {
    this.setEarlyWarningVisible()
  }

  setEarlyWarningVisible = () => {
    const {
      drawContent: { time_warning },
      projectDetailInfoData: {
        board_set: { time_warning: board_time_warning }
      }
    } = this.props
    this.setState({
      visible: !this.state.visible,
      selectedValue: time_warning || board_time_warning
    })
  }

  handleConfirm = () => {
    const { selectedValue } = this.state
    const {
      drawContent = {},
      drawContent: { card_id }
    } = this.props
    drawContent['time_warning'] = selectedValue
    updateTaskVTwo_2({ card_id, time_warning: selectedValue }).then(res => {
      if (isApiResponseOk(res)) {
        this.props.handleUpdateDatas &&
          this.props.handleUpdateDatas({
            drawContent,
            name: 'time_warning',
            value: selectedValue,
            card_id
          })
        message.success('设置成功', MESSAGE_DURATION_TIME)
        setTimeout(() => {
          this.setEarlyWarningVisible()
        }, 200)
      } else {
        setTimeout(() => {
          this.setEarlyWarningVisible()
        }, 200)
        message.warn(res.message, MESSAGE_DURATION_TIME)
      }
    })
  }

  // 禁用选项
  disabledSelectedOption = ({ start_time, due_time }) => {
    let temp_dec
    if (!!start_time && !!due_time) {
      // 表示存在开始和结束时间
      temp_dec = caldiffDays(start_time, due_time)
    }
    return temp_dec
  }

  // 选择
  handleSelectedValue = value => {
    // console.log(value)
    this.setState({
      selectedValue: value
    })
  }

  // 渲染预警内容
  renderContent = () => {
    const { optionsList = [], selectedValue } = this.state
    const {
      drawContent: { start_time, due_time }
    } = this.props
    let temp_dec = this.disabledSelectedOption({ start_time, due_time })
    let disabled = false
    if (temp_dec == '0') {
      // 表示开始和结束在同一天 表示只能选择1天之前的
      disabled = selectedValue >= '1'
    } else if (temp_dec == '1') {
      // 表示相差一天
      disabled = selectedValue >= '2'
    } else if (temp_dec == '2') {
      disabled = selectedValue >= '3'
    } else if (temp_dec <= '4') {
      disabled = selectedValue >= '5'
    } else {
      disabled = false
    }
    return (
      <div>
        <div>
          <Select
            optionLabelProp="label"
            defaultValue="无预警"
            style={{ width: '180px', letterSpacing: '1px' }}
            onChange={this.handleSelectedValue}
            value={selectedValue || '0'}
          >
            <Select.Option label="无预警" value="0">
              无预警
            </Select.Option>
            {optionsList.map(item => {
              let option_disabled = false
              if (temp_dec == '0') {
                // 表示开始和结束在同一天 表示只能选择1天之前的
                option_disabled = item.value >= '1'
              } else if (temp_dec == '1') {
                // 表示相差一天
                option_disabled = item.value >= '2'
              } else if (temp_dec == '2') {
                option_disabled = item.value >= '3'
              } else if (temp_dec <= '4') {
                option_disabled = item.value >= '5'
              } else {
                option_disabled = false
              }
              // let option_disabled =
              //   temp_dec == '0'
              //     ? item.value >= '1'
              //     : temp_dec == '1'
              //     ? item.value >= '2'
              //     : temp_dec <= '6'
              //     ? item.value == '7'
              //     : false
              return (
                <Select.Option
                  label={`到期前${item.label}预警`}
                  value={item.value}
                  disabled={option_disabled}
                >
                  {item.label}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button
            disabled={disabled}
            onClick={this.handleConfirm}
            type="primary"
          >
            确定
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { visible } = this.state
    const { children, title, zIndex, width, getPopupContainer } = this.props
    return (
      <>
        <div className={indexStyles.warning_block}>
          <span onClick={this.setEarlyWarningVisible}>预警</span>
        </div>
        <Modal
          title={
            <div
              style={{
                textAlign: 'center',
                fontSize: 16,
                fontWeight: 500,
                color: '#000'
              }}
            >
              {title}
            </div>
          }
          visible={visible}
          width={width}
          zIndex={zIndex}
          onCancel={this.onCancel}
          footer={null}
          destroyOnClose
          maskClosable={false}
          getContainer={() =>
            getPopupContainer ? getPopupContainer : document.body
          }
        >
          {this.renderContent()}
        </Modal>
      </>
    )
  }
}

index.defaultProps = {
  title: `${currentNounPlanFilterName(TASKS)}预警`
}

function mapStateToProps({
  publicTaskDetailModal: { drawContent = {}, card_id },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    drawContent,
    card_id,
    projectDetailInfoData
  }
}
