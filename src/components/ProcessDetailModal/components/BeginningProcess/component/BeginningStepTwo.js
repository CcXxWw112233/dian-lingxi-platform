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

  // -------- 审批通过气泡弹窗事件 ---------

  // 气泡消失清空内容
  onVisibleChange = (visible) => {
    if (!visible) {
      this.setState({
        successfulMessage: '',
        rejectMessage: ''
      })
    }
  }
  // 文本输入框的change事件
  handleChangeTextAreaValue = (e) => {
    e && e.stopPropagation()
    this.setState({
      successfulMessage: e.target.value
    })
  }

  // 审批通过的点击事件
  handlePassProcess = (e) => {
    e && e.stopPropagation()
    this.setState({
      isPassNodesIng: true, // 表示正在通过审批中
    })
    if (this.state.isPassNodesIng) {
      message.warn('正在审批通过中...')
      return
    }
    // this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
    const { processInfo: { id: flow_instance_id, board_id }, itemValue } = this.props
    const { id: flow_node_instance_id } = itemValue
    const { successfulMessage } = this.state
    this.props.dispatch({
      type: 'publicProcessDetailModal/fillFormComplete',
      payload: {
        flow_instance_id,
        flow_node_instance_id,
        message: successfulMessage ? successfulMessage : '通过。',
        calback: () => {
          this.setState({
            successfulMessage: '',
            isPassNodesIng: false
          })
          this.props.dispatch({
            type: 'publicProcessDetailModal/getProcessListByType',
            payload: {
              board_id,
              status: '1'
            }
          })
        }
      }
    })
  }

  // 审批意见取消的点击事件
  handleCancelSuccessProcess = (e) => {
    e && e.stopPropagation()
    this.setState({
      successfulMessage: '',
    })
  }

  // -------------- 审批通过气泡弹窗事件 -------------

  // ------------- 审批驳回气泡弹框事件 --------
  handleRejectTextAreaValue = (e) => {
    e && e.stopPropagation()
    this.setState({
      rejectMessage: '',
    })
  }

  handleCancelRejectProcess = (e) => {
    e && e.stopPropagation()
    this.updateCorrespondingPrcodessStepWithNodeContent('rejectMessage', '')
  }

  handleRejectProcess = (e) => {
    e && e.stopPropagation()
    this.setState({
      isRejectNodesIng: true, // 表示正在驳回节点中
    })
    if (this.state.isRejectNodesIng) {
      message.warn('正在驳回节点中...')
      return
    }
    // this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
    const { processInfo: { id: flow_instance_id, board_id }, itemValue } = this.props
    const { id: flow_node_instance_id } = itemValue
    const { rejectMessage } = this.state
    if (!rejectMessage) return
    this.props.dispatch({
      type: 'publicProcessDetailModal/rejectProcessTask',
      payload: {
        flow_instance_id,
        flow_node_instance_id,
        message: rejectMessage,
        calback: () => {
          this.setState({
            rejectMessage: '',
            isRejectNodesIng: false
          })
          this.props.dispatch({
            type: 'publicProcessDetailModal/getProcessListByType',
            payload: {
              board_id,
              status: '1'
            }
          })
        }
      }
    })
  }

  // ------------- 审批驳回气泡弹框事件 --------

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://');

  /**
   * 获取当前审批人的状态
   */
  getCurrentPersonApproveStatus = () => {
    const { itemValue } = this.props
    const { assignees, approve_type } = itemValue
    const { id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    let newAssignees = [...assignees]
    let gold_processed = (newAssignees.filter(item => item.id == id)[0] || []).processed || ''
    return gold_processed
  }

  // 判断是否有完成按钮
  whetherShowCompleteButton = () => {
    const { itemValue } = this.props
    const { assignees } = itemValue
    const { id } = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
    let flag = false
    let newAssignees = [...assignees]
      newAssignees.find(item => {
        if (item.id == id) {
          flag = true
        }
      })
    return flag
  }


  // 渲染不同状态时步骤的样式
  renderDiffStatusStepStyles = () => {
    const { itemValue, processInfo: { status: parentStatus } } = this.props
    const { status } = itemValue
    let stylLine, stylCircle
    if (parentStatus == '2') { // 表示已中止
      if (status == '1') { // 进行中
        stylLine = indexStyles.hasnotCompetedLine
        stylCircle = indexStyles.hasnotCompetedCircle
      } else {
        stylLine = indexStyles.stopLine
        stylCircle = indexStyles.stopCircle
      }
    } else if (parentStatus == '0') { // 表示未开始
      stylLine = indexStyles.stopLine
      stylCircle = indexStyles.stopCircle
    } else {
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
    }

    return { stylCircle, stylLine }
  }

  // 渲染通过 | 驳回 的成员以及内容
  renderApprovePersonnelSuggestion = (item) => {
    const { type, id, comment, user_id, processed, avatar, name, suggestion, create_time, time } = item
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
                processed == '2' && (
                  <span className={`${globalStyles.authTheme} ${indexStyles.approve_userIcon}`}>&#xe849;</span>
                )
              }

            </div>
            <div>
              <span>{name}</span>
              {/* {
                  type == '1' ? (
                    <span className={indexStyles.approv_pass}>通过</span>
                  ) : (
                      <span className={indexStyles.approve_reject}>驳回</span>
                    )
                } */}
              <div>{comment ? comment : '未填写意见'}</div>
            </div>
          </div>
          <div className={indexStyles.app_right}>{timestampToTimeNormal(time, '/', true) || ''}</div>
        </div>
      </div>
    )
  }

  // // 渲染通过 | 驳回 的成员以及内容
  // renderApprovePersonnelSuggestion = (item) => {
  //   const { type, user_id, avatar, name, suggestion, create_time } = item
  //   return (
  //     <div>
  //       <div className={indexStyles.appListWrapper}>
  //         <div className={indexStyles.app_left}>
  //           <div className={indexStyles.approve_user} style={{ position: 'relative', marginRight: '16px' }}>
  //             {/* <div className={indexStyles.defaut_avatar}></div> */}
  //             {
  //               avatar ? (
  //                 <img style={{ width: '32px', height: '32px', borderRadius: '32px' }} src={this.isValidAvatar(avatar) ? avatar : defaultUserAvatar} />
  //               ) : (
  //                   <img style={{ width: '32px', height: '32px', borderRadius: '32px' }} src={defaultUserAvatar} />
  //                 )
  //             }
  //             {
  //               type == '1' ? (
  //                 <span className={`${globalStyles.authTheme} ${indexStyles.approve_userIcon}`}>&#xe849;</span>
  //               ) : (
  //                   <span className={`${globalStyles.authTheme} ${indexStyles.approve_reject_userIcon}`}>&#xe844;</span>
  //                 )
  //             }

  //           </div>
  //           <div>
  //             <span>{name}</span>
  //             {
  //               type == '1' ? (
  //                 <span className={indexStyles.approv_pass}>通过</span>
  //               ) : (
  //                   <span className={indexStyles.approve_reject}>驳回</span>
  //                 )
  //             }
  //             <div>{suggestion ? suggestion : '未填写意见'}</div>
  //           </div>
  //         </div>
  //         <div className={indexStyles.app_right}>{timestampToTimeNormal(create_time, '/', true)}</div>
  //       </div>
  //     </div>
  //   )
  // }



  // 渲染驳回的内容
  renderPopRjectContent = () => {
    const { itemValue } = this.props
    const { rejectMessage } = this.state
    return (
      <div className={indexStyles.popcontent}>
        <TextArea maxLength={100} onChange={this.handleRejectTextAreaValue} value={rejectMessage || ''} placeholder="驳回请填写驳回理由（必填）" className={indexStyles.c_area} />
      </div>
    )
  }

  // 渲染通过的内容
  renderPopConfirmContent = () => {
    const { itemValue } = this.props
    // const { successfulMessage } = itemValue
    const { successfulMessage } = this.state
    return (
      <div className={indexStyles.popcontent}>
        <TextArea maxLength={100} onChange={this.handleChangeTextAreaValue} value={successfulMessage || ''} placeholder="填写审批意见（选填）" className={indexStyles.c_area} />
      </div>
    )
  }

  renderEditDetailContent = () => {
    const { itemValue, processInfo: { status: parentStatus } } = this.props
    const { approvePersonnelList = [], rejectMessage, transPrincipalList = [] } = this.state
    const { approve_type, status, assignees } = itemValue
    // 保存父级的状态是进行中 ==> 在保证当前节点是进行中 ==> 在保证是当前执行人 ==> 在保证当前执行人状态为1
    let showApproveButton = parentStatus == '1' && status == '1' && this.whetherShowCompleteButton() && this.getCurrentPersonApproveStatus() == '1'
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
            status == '2' && transPrincipalList.map(item => {
              return (this.renderApprovePersonnelSuggestion(item))
            })
          }
        </div>
        {/* 编辑按钮 */}
        {
          showApproveButton && (
            <div className={indexStyles.button_wrapper} style={{ paddingTop: '24px', borderTop: '1px solid #e8e8e8', textAlign: 'center', position: 'relative' }}>
              <Popconfirm
                className={indexStyles.confirm_wrapper} icon={<></>}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placement="top" title={this.renderPopRjectContent()}
                okText="驳回"
                okButtonProps={{ disabled: rejectMessage ? false : true }}
                onCancel={this.handleCancelRejectProcess}
                onConfirm={this.handleRejectProcess}
                onVisibleChange={this.onVisibleChange}
              >
                <Button style={{ color: '#fff', background: '#FF7875', marginRight: '8px', border: 'none' }}>驳回</Button>
              </Popconfirm>
              <Popconfirm
                onVisibleChange={this.onVisibleChange}
                className={indexStyles.confirm_wrapper} icon={<></>}
                getPopupContainer={triggerNode => triggerNode.parentNode}
                placement="top" title={this.renderPopConfirmContent()}
                okText="通过"
                onCancel={this.handleCancelSuccessProcess}
                onConfirm={this.handlePassProcess}
              >
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
    const { name } = itemValue
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

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [], processInfo = {} } }) {
  return { processEditDatas, processInfo }
}