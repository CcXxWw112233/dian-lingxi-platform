import React, { Component } from 'react'
import { Dropdown, Icon, Radio, Tooltip, Popover, Switch, Select, InputNumber, Button, Input, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import { isObjectValueEqual } from '../../../../../utils/util'

@connect(mapStateToProps)
export default class ConfirmInfoThree_one extends Component {

  constructor(props) {
    super(props)
    this.state = {
      scoreList: props.itemValue && props.itemValue.scoreList ? JSON.parse(JSON.stringify(props.itemValue.scoreList || [])) : [],
    }
  }

  whetherShowDiffWidth = () => {
    const { scoreList = [] } = this.state
    let flag = false
    for (let i = 0; i < scoreList.length; i++) {
      if (i % 4 == 0 || i % 2 == 0) {
        flag = true
        break
      }
    }
    return flag
  }

  render() {
    const { itemValue, processEditDatas = [], itemKey, projectDetailInfoData: { data = [], board_id, org_id } } = this.props
    const { weight_coefficient } = itemValue
    const { scoreList = [] } = this.state
    let flag = this.whetherShowDiffWidth()
    return (
      <div>
        {/* 评分项 */}
        <div style={{ borderTop: '1px solid rgba(0,0,0,0.09)', marginTop: '16px', padding: '16px 14px' }}>
          <div className={indexStyles.ratingItems}>
            {
              scoreList && scoreList.map((item, index) => {
                const { title, description, grade_value, weight_value } = item
                return (
                  <div key={item} className={`${indexStyles.rating_itemsValue} ${flag && scoreList.length > 1 ? indexStyles.rating_active_width : indexStyles.rating_normal_width}`}>
                    <p>
                      <span style={{ position: 'relative', marginRight: '9px', cursor: 'pointer' }}>
                        <Tooltip title={title} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                          <span style={{ marginRight: '9px', display: 'inline-block', maxWidth: '130px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{title}:</span>
                        </Tooltip>
                        {
                          weight_coefficient == '1' && (
                            <Tooltip overlayStyle={{ minWidth: '116px' }} title={`权重占比: ${weight_value}%`} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                              <span className={indexStyles.rating_weight}>{`*${weight_value}%`}</span>
                            </Tooltip>
                          )
                        }
                      </span>
                      {
                        description != '' ? (
                          <Popover title={title} content={<div style={{ wordBreak: 'break-all', whiteSpace: 'pre-wrap', width: '260px' }}>{description}</div>} placement="top" getPopupContainer={triggerNode => triggerNode.parentNode}>
                            <span style={{ color: '#1890FF', cursor: 'pointer' }} className={globalStyles.authTheme}>&#xe785;</span>
                          </Popover>
                        ) : ('')
                      }
                    </p>
                    <div className={indexStyles.rating_grade}>
                      <span>最高<span className={indexStyles.rating_grade_value}>{grade_value}</span>分</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}