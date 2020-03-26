import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { principalList, approvePersonnelSuggestion } from '../../../constant'
import { Button, Popconfirm, Input } from 'antd'
import { connect } from 'dva'
import { timestampToTimeNormal, compareACoupleOfObjects } from '../../../../../utils/util';

const TextArea = Input.TextArea
@connect(mapStateToProps)
export default class BeginningStepTwo extends Component {

  constructor(props) {
    super(props)
    this.state = {
      transPrincipalList: props.itemValue.assignees ? [...props.itemValue.assignees] : [], // 表示当前的执行人
      transCopyPersonnelList: props.itemValue.recipients ? [...props.itemValue.recipients] : [], // 表示当前选择的抄送人
      is_show_spread_arrow: props.itemValue.status == '1' ? true : false,
      approvePersonnelList: JSON.parse(JSON.stringify(approvePersonnelSuggestion))
    }
  }

  componentWillReceiveProps(nextProps) {
    // 需要更新箭头的状态
    if (!compareACoupleOfObjects(this.props, nextProps)) {
      this.setState({
          is_show_spread_arrow: nextProps.itemValue.status == '1' ? true : false,
        })
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
    // e && e.stopPropagation()
    // this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
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

  // 渲染不同状态时步骤的样式
  renderDiffStatusStepStyles = () => {
    const { itemValue } = this.props
    const { status } = itemValue
    let stylLine, stylCircle
    if (status == '0') { // 未开始
      stylLine = indexStyles.hasnotCompetedLine
      stylCircle = indexStyles.hasnotCompetedCircle
    } else if (status == '1') { // 进行中
      stylLine = indexStyles.doingLine
      stylCircle = indexStyles.doingCircle
    } else if (status == '2') { // 已完成
      stylLine = indexStyles.line
      stylCircle = indexStyles.circle
    } else {
      stylLine = indexStyles.doingLine
      stylCircle = indexStyles.doingCircle
    }
    return { stylCircle, stylLine }
  }

  // 渲染通过 | 驳回 的成员以及内容
  renderApprovePersonnelSuggestion = (item) => {
    const { type, user_id, avatar, name, suggestion, create_time } = item
    return (
      <div>
        <div className={indexStyles.appListWrapper}>
          <div className={indexStyles.app_left}>
            <div className={indexStyles.approve_user} style={{ position: 'relative', marginRight: '16px' }}>
              {/* <div className={indexStyles.defaut_avatar}></div> */}
              {
                avatar ? (
                  <img style={{ width: '32px', height: '32px', borderRadius: '32px' }} src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar} />
                ) : (
                    <img style={{ width: '32px', height: '32px', borderRadius: '32px' }} src={defaultUserAvatar} />
                  )
              }
              {
                type == '1' ? (
                  <span className={`${globalStyles.authTheme} ${indexStyles.approve_userIcon}`}>&#xe849;</span>
                ) : (
                    <span className={`${globalStyles.authTheme} ${indexStyles.approve_reject_userIcon}`}>&#xe844;</span>
                  )
              }

            </div>
            <div>
              <span>{name}</span>
              {
                type == '1' ? (
                  <span className={indexStyles.approv_pass}>通过</span>
                ) : (
                    <span className={indexStyles.approve_reject}>驳回</span>
                  )
              }
              <div>{suggestion ? suggestion : '未填写意见'}</div>
            </div>
          </div>
          <div className={indexStyles.app_right}>{timestampToTimeNormal(create_time, '/', true)}</div>
        </div>
      </div>
    )
  }

  // 渲染驳回的内容
  renderPopRjectContent = () => {
    return (
      <div className={indexStyles.popcontent}>
        <TextArea placeholder="驳回请填写驳回理由（必填）" className={indexStyles.c_area} />
      </div>
    )
  }

  // 渲染通过的内容
  renderPopConfirmContent = () => {
    return (
      <div className={indexStyles.popcontent}>
        <TextArea placeholder="填写审批意见（选填）" className={indexStyles.c_area} />
      </div>
    )
  }

  renderEditDetailContent = () => {
    const { itemValue } = this.props
    const { approvePersonnelList = [] } = this.state
    const { approve_type, status } = itemValue
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
        <div style={{ minHeight: '64px', padding: '20px 14px', color: 'rgba(0,0,0,0.45)', borderTop: '1px solid #e8e8e8', marginTop: '15px' }}>
          <span className={globalStyles.authTheme}>&#xe616; 审批方式 : &nbsp;&nbsp;&nbsp;{diffType()}</span>
          {/* {this.renderApprovePersonnelSuggestion()} */}
          {
            approvePersonnelList.map(item => {
              return (this.renderApprovePersonnelSuggestion(item))
            })
          }
        </div>
        {/* 编辑按钮 */}
        {
          status == '1' && (
            <div className={indexStyles.button_wrapper} style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center', position: 'relative' }}>
              <Popconfirm className={indexStyles.confirm_wrapper} icon={<></>} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={this.renderPopRjectContent()} okText="驳回">
                <Button onClick={this.handleEnterConfigureProcess} style={{ color: '#fff', background: '#FF7875', marginRight: '8px' }}>驳回</Button>
              </Popconfirm>
              <Popconfirm className={indexStyles.confirm_wrapper} icon={<></>} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={this.renderPopConfirmContent()} okText="通过">
                <Button type="primary">通过</Button>
              </Popconfirm>
            </div>
          )
        }
      </div>
    )
  }

  /**
   * 渲染悬浮状态的审批节点
   * 根据 container_configureProcessOut 容器作为父元素来定位的
   */
  renderAbsoluteContent = () => {
    const { itemKey, processEditDatas = [], itemValue } = this.props
    const { transPrincipalList = [], is_show_spread_arrow } = this.state
    return (
      <div id="currentAbsoluteApproveContainer" key={itemKey} style={{ display: 'flex', marginBottom: '46px', marginRight: '32px', left: '32px', right: 0, position: 'absolute', top: '478px', zIndex: 1 }}>
        {processEditDatas.length <= itemKey + 1 ? null : <div className={this.renderDiffStatusStepStyles().stylLine}></div>}
        <div className={this.renderDiffStatusStepStyles().stylCircle}> {itemKey + 1}</div>
        <div className={`${indexStyles.popover_card}`}>
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 步骤名称 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name}`}>
                <div>
                  <span className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}>&#xe616;</span>
                  <span>建设部门审批</span>
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
                  {(transPrincipalList && transPrincipalList.length) && transPrincipalList.map(({ name, avatar }, index) => (
                    <AvatarList.Item
                      key={index}
                      tips={name}
                      src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                    />
                  ))}
                </AvatarList>
                <span className={indexStyles.content__principalList_info}>
                  {`${transPrincipalList.length}位审批人`}
                </span>
              </div>
              <div>
                <span style={{ fontWeight: 500, color: 'rgba(0,0,0,0.65)', fontSize: '14px' }} className={`${globalStyles.authTheme}`}>&#xe686;</span>
                <span className={`${indexStyles.deadline_time}`}>&nbsp;完成期限 : 步骤开始后1天内</span>
              </div>
            </div>
            {/* {is_show_spread_arrow && this.renderEditDetailContent()} */}
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { itemKey, processEditDatas = [], itemValue } = this.props
    const { status, name, cc_type } = itemValue
    const { transPrincipalList = [], transCopyPersonnelList = [], is_show_spread_arrow } = this.state
    return (
      <>
        <div id={status == '1' && 'currentStaticApproveContainer'} key={itemKey} style={{ display: 'flex', marginBottom: '48px', position: 'relative' }}>
          {processEditDatas.length <= itemKey + 1 ? null : <div className={this.renderDiffStatusStepStyles().stylLine}></div>}
          <div className={this.renderDiffStatusStepStyles().stylCircle}> {itemKey + 1}</div>
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
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
        <div>
          {/* {status == '1' && this.renderAbsoluteContent()} */}
        </div>
      </>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [] } }) {
  return { processEditDatas }
}