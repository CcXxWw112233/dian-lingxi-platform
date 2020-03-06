import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import { Radio } from 'antd'
import ConfigureStepTypeOne from './component/ConfigureStepTypeOne'
export default class ConfigureNodeTypeInfoOne extends Component {

  state = {

  }

  // 当先选择的节点类型
  handleChangeStepType = (e) => {
    let key = e.target.value
    this.props.dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        node_type: key
      }
    })
  }

  renderDiffStepTypeContent = () => {
    const { node_type } = this.props
    let container = <div></div>
    switch (node_type) {
      case '1':
        container = <ConfigureStepTypeOne {...this.props} />
        break;

      default:
        container = <div></div>
        break;
    }
    return container
  }

  render() {
    const { itemKey, itemValue, processEditDatasRecords = [], node_type, processCurrentEditStep } = this.props
    let node_amount = this.props && this.props.processInfo && this.props.processInfo.node_amount
    let stylLine, stylCircle
    if (this.props.processInfo.completed_amount >= itemKey + 1) { //0 1    1  2 | 1 3 | 1 4
      stylLine = indexStyles.line
      stylCircle = indexStyles.circle
    } else if (this.props.processInfo.completed_amount == itemKey) {
      stylLine = indexStyles.doingLine
      stylCircle = indexStyles.doingCircle
    } else {
      stylLine = indexStyles.hasnotCompetedLine
      stylCircle = indexStyles.hasnotCompetedCircle
    }

    let check_line
    if (node_type == '1') {
      check_line = indexStyles.data_collection
    } else if (node_type == '2') {
      check_line = indexStyles.examine_approve
    } else if (node_type == '3') {
      check_line = indexStyles.make_copy
    }
    let juge = {
      bordered: false
    }
    const alltypedata = processEditDatasRecords[processCurrentEditStep]['alltypedata']
    return (
      <div className={indexStyles.configureProcessOut_1}>
        <div style={{ display: 'flex' }}>
          {node_amount <= itemKey + 1 ? null : <div className={stylLine}></div>}
          <div className={stylCircle}> {itemKey + 1}</div>
          <div className={`${indexStyles.popover_card}`}>
            <div className={`${globalStyles.global_vertical_scrollbar}`}>
              {/* 步骤名称 */}
              <div style={{ marginBottom: '16px' }}>
                <NameChangeInput
                  autosize
                  // onBlur={this.titleTextAreaChangeBlur}
                  // onClick={this.setTitleEdit}
                  // setIsEdit={this.setTitleEdit}
                  autoFocus={true}
                  goldName={''}
                  placeholder={'步骤名称(必填)'}
                  maxLength={101}
                  nodeName={'textarea'}
                  style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                />
              </div>
              <div style={{ paddingLeft: '14px', paddingRight: '14px', position: 'relative' }}>
                {/* 步骤类型 */}
                <div style={{ marginBottom: '14px' }}>
                  <span style={{ color: 'rgba(0,0,0,0.45)' }} className={globalStyles.authTheme}>&#xe7f4; &nbsp;步骤类型 :&nbsp;&nbsp;&nbsp;</span>
                  <Radio.Group onChange={this.handleChangeStepType} value={this.props.node_type}>
                    {
                      alltypedata.map(item => {
                        return (
                          <Radio key={item.node_type} value={item.node_type}>{item.name}</Radio>
                        )
                      })
                    }
                  </Radio.Group>
                </div>
                <div className={`${check_line} ${indexStyles.check_line}`}></div>
                {this.renderDiffStepTypeContent()}
              </div>
              {/* <span className={indexStyles.dynamicTime}></span> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
