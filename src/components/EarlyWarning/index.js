import React, { Component } from 'react'
import { connect } from 'dva'
import { Modal, Select, Button } from 'antd'
import { currentNounPlanFilterName } from '../../utils/businessFunction'
import { TASKS } from '../../globalset/js/constant'
import globalStyles from '../../globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { caldiffDays } from '../../utils/util'

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
        label: '一周',
        value: '7'
      }
    ]
  }

  onCancel = () => {
    this.setEarlyWarningVisible()
  }

  setEarlyWarningVisible = () => {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleConfirm = () => {
    this.setEarlyWarningVisible()
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

  // 渲染预警内容
  renderContent = () => {
    const { optionsList = [] } = this.state
    const {
      drawContent: { start_time, due_time }
    } = this.props
    let temp_dec = this.disabledSelectedOption({ start_time, due_time })

    return (
      <div>
        <div>
          <Select
            optionLabelProp="label"
            defaultValue="无预警"
            style={{ width: '180px', letterSpacing: '1px' }}
          >
            <Select.Option label="无预警" value="none">
              无预警
            </Select.Option>
            {optionsList.map(item => {
              return (
                <Select.Option
                  label={`到期前${item.label}预警`}
                  value={item.value}
                  disabled={
                    temp_dec == '0'
                      ? item.value >= '1'
                      : temp_dec == '1'
                      ? item.value >= '2'
                      : temp_dec <= '6'
                      ? item.value == '7'
                      : false
                  }
                >
                  {item.label}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={this.handleConfirm} type="primary">
            确定
          </Button>
        </div>
      </div>
    )
  }

  render() {
    const { visible } = this.state
    const { children, title, zIndex, width } = this.props
    return (
      <div>
        <span onClick={this.setEarlyWarningVisible}>预警</span>
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
        >
          {this.renderContent()}
        </Modal>
      </div>
    )
  }
}

index.defaultProps = {
  title: `${currentNounPlanFilterName(TASKS)}预警`
}

function mapStateToProps({
  publicTaskDetailModal: { drawContent = {}, card_id }
}) {
  return {
    drawContent,
    card_id
  }
}
