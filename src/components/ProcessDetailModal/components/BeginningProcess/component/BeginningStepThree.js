import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { principalList } from '../../../constant'
import { Button, Tooltip, Icon } from 'antd'
import { connect } from 'dva'
import { renderTimeType } from '../../handleOperateModal'
import BeginningStepThree_one from './BeginningStepThree_one';

@connect(mapStateToProps)
export default class BeginningStepThree extends Component {

  constructor(props) {
    super(props)
    this.state = {
      transPrincipalList: JSON.parse(JSON.stringify(principalList || [])),
      // transPrincipalList: props.itemValue.assignees ? [...props.itemValue.assignees] : [], // 表示当前的执行人
      transCopyPersonnelList: props.itemValue.recipients ? [...props.itemValue.recipients] : [], // 表示当前选择的抄送人
      is_show_spread_arrow: props.itemValue.status == '1' ? true : false, // 是否展开箭头 详情 true表示展开
    }
  }

  // 更新对应步骤下的节点内容数据, 即当前操作对象的数据
  updateCorrespondingPrcodessStepWithNodeContent = (data, value) => {
    const { itemValue, processEditDatas = [], itemKey, dispatch } = this.props
    let newProcessEditDatas = [...processEditDatas]
    newProcessEditDatas[itemKey][data] = value
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: newProcessEditDatas,
      }
    })
  }

  // 编辑点击事件
  handleEnterConfigureProcess = (e) => {
    e && e.stopPropagation()
    this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
  }

  handleSpreadArrow = (e) => {
    e && e.stopPropagation()
    this.setState({
      is_show_spread_arrow: !this.state.is_show_spread_arrow
    })
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  // 把assignees中的执行人,在项目中的所有成员过滤出来
  filterAssignees = () => {
    const { projectDetailInfoData: { data = [] } } = this.props
    const { transPrincipalList = [] } = this.state
    let new_data = [...data]
    let newTransPrincipalList = transPrincipalList && transPrincipalList.map(item => {
      return new_data.find(item2 => item2.user_id == item) || {}
    })
    newTransPrincipalList = newTransPrincipalList.filter(item => item.user_id)
    return newTransPrincipalList
  }

  // 把recipients中的抄送人在项目中的所有成员过滤出来
  filterRecipients = () => {
    const { projectDetailInfoData: { data = [] } } = this.props
    const { transCopyPersonnelList = [] } = this.state
    let newData = [...data]
    let newTransCopyPersonnelList = transCopyPersonnelList && transCopyPersonnelList.map(item => {
      return newData.find(item2 => item2.user_id == item) || {}
    })
    newTransCopyPersonnelList = newTransCopyPersonnelList.filter(item => item.user_id)
    return newTransCopyPersonnelList
  }

  renderEditDetailContent = () => {
    const { itemValue, itemKey } = this.props
    return (
      <div>
        {/* 渲染评分项 */}
        <div>
          <BeginningStepThree_one updateCorrespondingPrcodessStepWithNodeContent={this.updateCorrespondingPrcodessStepWithNodeContent} itemValue={itemValue} itemKey={itemKey} />
        </div>
        {/* 评分结果判定 */}
        <div>
          <div style={{ minHeight: '210px', padding: '16px 14px', borderTop: '1px solid rgba(0,0,0,0.09)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ color: 'rgba(0,0,0,0.45)' }}>
              <span className={globalStyles.authTheme}>&#xe7bf;</span>
              <span style={{ marginLeft: '4px' }}>评分结果判定：</span>
            </div>
            <div>
              <span className={indexStyles.rating_label_name}>计算方式</span>
              <span className={indexStyles.select_item} style={{ minWidth: '94px' }}>总分值相加</span>
            </div>
            <div>
              <span className={indexStyles.rating_label_name}>结果分数</span>
              <span className={indexStyles.select_item} style={{ minWidth: '94px' }}>大于或等于</span>
              <span className={indexStyles.select_item} style={{ minWidth: '40px' }}>60</span>
              <span className={indexStyles.select_item} style={{ minWidth: '136px' }}>流程流转到下一步</span>
            </div>
            <div>
              <span className={indexStyles.rating_label_name}>其余情况</span>
              <span className={indexStyles.select_item} style={{ minWidth: '136px' }}>流程流转到上一步</span>
            </div>
          </div>
        </div>
        {/* 编辑按钮 */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center' }}>
          <Button onClick={this.handleEnterConfigureProcess} type="primary">完成</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue } = this.props
    const { is_show_spread_arrow, transPrincipalList = [] } = this.state
    const { name, cc_type, deadline_type, deadline_value, deadline_time_type } = itemValue
    // let transPrincipalList = this.filterAssignees()
    let transCopyPersonnelList = this.filterRecipients()
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '48px' }}>
        <div className={indexStyles.line}></div>
        <div className={indexStyles.circle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name}`}>
                <div>
                  <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe7b6;</span>
                  <span>项目评分</span>
                </div>
                <div>
                  <span onClick={this.handleSpreadArrow} className={`${indexStyles.spreadIcon}`}>
                    {
                      !is_show_spread_arrow ? <span className={`${globalStyles.authTheme} ${indexStyles.spread_arrow}`}>&#xe7ee;</span> : <span className={`${globalStyles.authTheme} ${indexStyles.spread_arrow}`}>&#xe7ed;</span>
                    }
                  </span>
                </div>
              </div>
            </div>
            {/* 下 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                {/* 填写人 */}
                <div style={{ display: 'inline-block' }} className={indexStyles.content__principalList_icon}>
                  <AvatarList
                    size="small"
                    maxLength={10}
                    excessItemsStyle={{
                      color: '#f56a00',
                      backgroundColor: '#fde3cf'
                    }}
                  >
                    {(transPrincipalList && transPrincipalList.length) && transPrincipalList.map(({ name, avatar }, index) => (
                      <AvatarList.Item
                        key={index}
                        tips={name || '佚名'}
                        src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                      />
                    ))}
                  </AvatarList>
                  <span className={indexStyles.content__principalList_info}>
                    {`${transPrincipalList.length}位评分人`}
                  </span>
                </div>
                {/* 抄送人 */}
                {
                  cc_type == '1' && (
                    <div style={{ marginLeft: '8px', display: 'inline-block' }} className={indexStyles.content__principalList_icon}>
                      <AvatarList
                        size="small"
                        maxLength={10}
                        excessItemsStyle={{
                          color: '#f56a00',
                          backgroundColor: '#fde3cf'
                        }}
                      >
                        {(transCopyPersonnelList && transCopyPersonnelList.length) && transCopyPersonnelList.map(({ name, avatar }, index) => (
                          <AvatarList.Item
                            key={index}
                            tips={name || '佚名'}
                            src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                          />
                        ))}
                      </AvatarList>
                      <span className={indexStyles.content__principalList_info}>
                        {`${transCopyPersonnelList.length}位抄送人`}
                      </span>
                    </div>
                  )
                }
              </div>
              <div>
                <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.65)', fontSize: '14px' }} className={`${globalStyles.authTheme}`}>&#xe686;</span>
                <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : </span>
                {
                  deadline_type == '1' || deadline_type == '' ? (
                    <span style={{ color: 'rgba(0,0,0,0.45)' }}>未限制时间</span>
                  ) : (
                      <span style={{ color: 'rgba(0,0,0,0.45)' }}>
                        步骤开始后{`${deadline_value}${renderTimeType(deadline_time_type)}`}内
                      </span>
                    )
                }
              </div>
            </div>
            {is_show_spread_arrow && this.renderEditDetailContent()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, projectDetailInfoData }
}