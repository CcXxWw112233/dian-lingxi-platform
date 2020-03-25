import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { principalList } from '../../../constant'
import { Button } from 'antd'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class EditStepTypeTwo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      transPrincipalList: props.itemValue.assignees ? props.itemValue.assignees.split(',') : [], // 表示当前的执行人
      transCopyPersonnelList: props.itemValue.recipients ? props.itemValue.recipients.split(',') : [], // 表示当前选择的抄送人
      is_show_spread_arrow: false,
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

  handleSpreadArrow = (e) => {
    e && e.stopPropagation()
    this.setState({
      is_show_spread_arrow: !this.state.is_show_spread_arrow
    })
  }

  // 编辑点击事件
  handleEnterConfigureProcess = (e) => {
    e && e.stopPropagation()
    this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
    // this.props.dispatch({
    //   type: 'publicProcessDetailModal/updateDatas',
    //   payload: {
    //     processPageFlagStep: '1'
    //   }
    // })
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  // 把assignees中的执行人,在项目中的所有成员过滤出来
  filterAssignees = () => {
    const { projectDetailInfoData: { data = [] } } = this.props
    const { transPrincipalList = [] } = this.state
    let newData = [...data]
    newData = newData.filter(item => {
      if (transPrincipalList.indexOf(item.user_id) != -1) {
        return item
      }
    })
    return newData
  }

  // 把recipients中的抄送人在项目中的所有成员过滤出来
  filterRecipients = () => {
    const { projectDetailInfoData: { data = [] } } = this.props
    const { transCopyPersonnelList = [] } = this.state
    let newData = [...data]
    newData = newData.filter(item => {
      if (transCopyPersonnelList.indexOf(item.user_id) != -1) {
        return item
      }
    })
    return newData
  }

  renderEditDetailContent = () => {
    const { itemValue, processEditDatas = [] } = this.props
    const { approve_type, description } = itemValue
    let newData = processEditDatas.find(item => item.is_edit == '0')
    let flag = false
    if (newData && Object.keys(newData).length) {
      flag = true
    }
    let type_name = ''
    const diffType = () => {
      switch (approve_type) {
        case '1':
          type_name = '串签'
          break;
        case '2':
          type_name = '并签'
          break;
        case '1':
          type_name = '汇签'
          break;
        default:
          break;
      }
      return type_name
    }
    return (
      <div>
        {/* 审批类型 */}
        <div style={{ minHeight: '64px', padding: '20px 14px', borderTop: '1px solid #e8e8e8', marginTop: '15px' }}>
          <span style={{color: 'rgba(0,0,0,0.45)'}} className={globalStyles.authTheme}>&#xe616; 审批类型 : &nbsp;&nbsp;&nbsp;</span>
          <span>{diffType()}</span>
        </div>
        {/* 备注 */}
        {
          description != '' &&
          (
            <div className={indexStyles.select_remarks}>
              <span style={{color: 'rgba(0,0,0,0.45)'}} className={globalStyles.authTheme}>&#xe636; 备注 :</span>
              <div>{description}</div>
            </div>
          )
        }
        {/* 编辑按钮 */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center' }}>
          <Button disabled={flag} onClick={this.handleEnterConfigureProcess} type="primary">编辑</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue } = this.props
    const { is_show_spread_arrow } = this.state
    const { name, cc_type } = itemValue
    let transPrincipalList = this.filterAssignees()
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
                  <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe616;</span>
                  <span>{name}</span>
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
                    {`${transPrincipalList.length}位审批人`}
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
                <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : 步骤开始后1天内</span>
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