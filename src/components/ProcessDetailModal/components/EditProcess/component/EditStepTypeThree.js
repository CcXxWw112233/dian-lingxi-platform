import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { principalList } from '../../../constant'
import { Button, Tooltip, Icon } from 'antd'
import { connect } from 'dva'

@connect(mapStateToProps)
export default class EditStepTypeThree extends Component {

  state = {
    transPrincipalList: JSON.parse(JSON.stringify(principalList)),
    is_show_spread_arrow: false,
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
    this.updateCorrespondingPrcodessStepWithNodeContent('is_confirm', '0')
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  // 渲染抄报人
  renderRecipientsList = () => {
    const { itemValue, projectDetailInfoData: { data = [] } } = this.props
    const { recipients } = itemValue
    let reArray = recipients ? recipients.split(',') : []
    let newData = [...data]
    newData = newData.filter(item => {
      if (reArray.indexOf(item.user_id) != -1) {
        return item
      }
    })
    return newData
  }

  renderEditDetailContent = () => {
    const { itemValue } = this.props
    const { cc_type, recipients } = itemValue
    let type_name = ''
    let recipientsList = this.renderRecipientsList()
    const diffType = () => {
      switch (cc_type) {
        case '1':
          type_name = '自动抄送'
          break;
        case '2':
          type_name = '手动抄送'
          break
        default:
          break;
      }
      return type_name
    }
    return (
      <div>
        {/* 抄送方式 */}
        <div style={{ minHeight: '64px', padding: '20px 14px', color: 'rgba(0,0,0,0.45)', borderTop: '1px solid #e8e8e8', marginTop: '15px' }}>
          <span className={globalStyles.authTheme}>&#xe618; 抄送方式 : &nbsp;&nbsp;&nbsp;{diffType()}</span>
        </div>
        {/* 手动抄送显示抄报人 */}
        {
          recipientsList && recipientsList.length != '0' && (
            <div style={{ minHeight: '64px', padding: '20px 14px', color: 'rgba(0,0,0,0.45)', borderTop: '1px solid #e8e8e8', marginTop: '15px', display: 'flex', flexWrap: 'wrap' }}>
              <span style={{marginRight: '16px', flexShrink: 0}} className={globalStyles.authTheme}>&#xe6f6; 抄报人 (必填) : </span>
              {
                recipientsList.map(item => {
                  const { avatar, name, user_name, user_id } = item
                  return (
                    <span>
                      <div style={{ display: 'flex', alignItems: 'center' }} key={user_id}>
                        <div className={`${indexStyles.user_item}`} style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }} key={user_id}>
                          {avatar ? (
                            <Tooltip overlayStyle={{ minWidth: '62px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                              <img className={indexStyles.img_hover} style={{ width: '32px', height: '32px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                            </Tooltip>
                          ) : (
                              <Tooltip overlayStyle={{ minWidth: '62px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                                <div className={indexStyles.default_user_hover} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                  <Icon type={'user'} style={{ fontSize: 14, color: '#8c8c8c' }} />
                                </div>
                              </Tooltip>
                            )}
                        </div>
                      </div>
                    </span>
                  )
                })
              }
            </div>
          )
        }
        {/* 编辑按钮 */}
        <div style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center' }}>
          <Button onClick={this.handleEnterConfigureProcess} type="primary">编辑</Button>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, itemValue } = this.props
    const { cc_type } = itemValue
    const { transPrincipalList = [], is_show_spread_arrow } = this.state
    return (
      <div key={itemKey} style={{ display: 'flex', marginBottom: '45px' }}>
        <div className={indexStyles.line}></div>
        <div className={indexStyles.circle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name}`}>
                <div>
                  <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe618;</span>
                  <span>部门经理查阅</span>
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
              <div className={indexStyles.content__principalList_icon}>
                <AvatarList
                  size="small"
                  maxLength={10}
                  excessItemsStyle={{
                    color: '#f56a00',
                    backgroundColor: '#fde3cf'
                  }}
                >
                  {transPrincipalList && transPrincipalList.map(({ name, avatar }, index) => (
                    <AvatarList.Item
                      key={index}
                      tips={name}
                      src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                    />
                  ))}
                </AvatarList>
                <span className={indexStyles.content__principalList_info}>
                  {`${transPrincipalList.length}位填写人`}
                </span>
              </div>
              <div>
                {
                  cc_type == '1' ? (
                    <span>自动触发</span>
                  ) : (
                      <>
                        <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.65)', fontSize: '14px' }} className={`${globalStyles.authTheme}`}>&#xe686;</span>
                        <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : 步骤开始后1天内</span>
                      </>
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