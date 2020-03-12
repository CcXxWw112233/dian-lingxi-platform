import React, { Component } from 'react'
import { Button, Dropdown, Icon, Menu, Radio, Select, InputNumber, Tooltip } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { connect } from 'dva'

const Option = Select.Option;

@connect(mapStateToProps)
export default class ConfigureStepTypeThree extends Component {

  state = {
    makeCopyPersonList: [], // 抄送人列表
    makeCopyNewsPaperPersonList: [], // 抄报人列表
  }

  updateConfigureProcess = (data, key) => { //更新单个数组单个属性
    const { value } = data
    const { processEditDatas = [], itemKey, itemValue, dispatch } = this.props
    const new_processEditDatas = [...processEditDatas]
    new_processEditDatas[itemKey][key] = value
    dispatch({
      type: 'publicProcessDetailModal/updateDatas',
      payload: {
        processEditDatas: new_processEditDatas,
      }
    })
  }

  ccTypeChange = (e) => {
    this.updateConfigureProcess({ value: e.target.value }, 'cc_type')
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { projectDetailInfoData = {} } = this.props;
    // 多个任务执行人
    const membersData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newMakeCopyPersonList = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newMakeCopyPersonList.push(membersData[j])
        }
      }
    }

    this.setState({
      makeCopyPersonList: newMakeCopyPersonList
    });

  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { makeCopyPersonList = [] } = this.state
    let newMakeCopyPersonList = [...makeCopyPersonList]
    newMakeCopyPersonList.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        newMakeCopyPersonList.splice(index, 1)
      }
    })
    this.setState({
      makeCopyPersonList: newMakeCopyPersonList
    })
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChangeTwo = (data) => {
    const { projectDetailInfoData = {} } = this.props;
    // 多个任务执行人
    const membersData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newMakeCopyNewsPaperPersonList = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newMakeCopyNewsPaperPersonList.push(membersData[j])
        }
      }
    }

    this.setState({
      makeCopyNewsPaperPersonList: newMakeCopyNewsPaperPersonList
    });

  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutorsTwo = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { makeCopyNewsPaperPersonList = [] } = this.state
    let newMakeCopyNewsPaperPersonList = [...makeCopyNewsPaperPersonList]
    newMakeCopyNewsPaperPersonList.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        newMakeCopyNewsPaperPersonList.splice(index, 1)
      }
    })
    this.setState({
      makeCopyNewsPaperPersonList: newMakeCopyNewsPaperPersonList
    })
  }

  render() {
    const { makeCopyPersonList = [], makeCopyNewsPaperPersonList = [] } = this.state
    const { itemValue, processEditDatas = [], itemKey, projectDetailInfoData = {} } = this.props
    const { data, board_id } = projectDetailInfoData
    const { cc_type, deadline_type, deadline_value, description, is_click_node_description } = itemValue
    return (
      <div>
        {/* 审批类型 */}
        <div className={indexStyles.approve_content} onClick={(e) => { e && e.stopPropagation() }}>
          <span style={{ marginRight: '20px' }} className={globalStyles.authTheme}>&#xe618; 抄送方式 :</span>
          <Radio.Group value={cc_type} onChange={this.ccTypeChange} style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Radio value="1">自动抄送</Radio>
            <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title="无需指派执行人,上一步骤完成后自动抄送"><span className={`${globalStyles.authTheme} ${indexStyles.approve_tips}`}>&#xe845;</span></Tooltip>
            <Radio value="2">手动抄送</Radio>
            <Tooltip overlayStyle={{ minWidth: '156px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title="需指定抄报人手动抄送"><span className={`${globalStyles.authTheme} ${indexStyles.approve_tips}`}>&#xe845;</span></Tooltip>
          </Radio.Group>
        </div>
        {/* 抄送人 */}
        <div className={indexStyles.fill_person}>
          <span className={`${indexStyles.label_person}`}><span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe6f5;</span> 抄送人 (必填)&nbsp;:</span>
          <div style={{ flex: 1, padding: '8px 0' }}>
            {
              !makeCopyPersonList.length ? (
                <div style={{ position: 'relative' }}>
                  <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                    overlayStyle={{ maxWidth: '200px' }}
                    overlay={
                      <MenuSearchPartner
                        listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={makeCopyPersonList}
                        // board_id={board_id}
                        // invitationType='1'
                        // invitationId={board_id}
                        // invitationOrg={org_id}
                        chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                    }
                  >
                    {/* 添加通知人按钮 */}

                    <div className={indexStyles.addNoticePerson}>
                      <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', lineHeight: '22px' }}>
                    {makeCopyPersonList.map((value, index) => {
                      const { avatar, name, user_name, user_id } = value
                      return (
                        <div style={{ display: 'flex', alignItems: 'center' }} key={user_id}>
                          <div className={`${indexStyles.user_item}`} style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }} key={user_id}>
                            {avatar ? (
                              <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                                <img className={indexStyles.img_hover} style={{ width: '32px', height: '32px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                              </Tooltip>
                            ) : (
                                <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                                  <div className={indexStyles.default_user_hover} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                    <Icon type={'user'} style={{ fontSize: 14, color: '#8c8c8c' }} />
                                  </div>
                                </Tooltip>
                              )}
                            {/* <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div> */}
                            <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${indexStyles.userItemDeleBtn}`}></span>
                          </div>
                        </div>
                      )
                    })}
                    <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                      overlayStyle={{ maxWidth: '200px' }}
                      overlay={
                        <MenuSearchPartner
                          listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={makeCopyPersonList}
                          // board_id={board_id}
                          // invitationType='1'
                          // invitationId={board_id}
                          // invitationOrg={org_id}
                          chirldrenTaskChargeChange={this.chirldrenTaskChargeChange} />
                      }
                    >
                      {/* 添加通知人按钮 */}

                      <div className={indexStyles.addNoticePerson} style={{ marginTop: '-6px' }}>
                        <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                      </div>
                    </Dropdown>
                  </div>
                )
            }

          </div>
        </div>
        {/* 抄报人 */}
        {
          cc_type == '2' && (
            <div className={indexStyles.fill_person}>
              <span className={`${indexStyles.label_person}`}><span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe6f6;</span> 抄报人 (必填)&nbsp;:</span>
              <div style={{ flex: 1, padding: '8px 0' }}>
                {
                  !makeCopyNewsPaperPersonList.length ? (
                    <div style={{ position: 'relative' }}>
                      <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                        overlayStyle={{ maxWidth: '200px' }}
                        overlay={
                          <MenuSearchPartner
                            listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={makeCopyNewsPaperPersonList}
                            // board_id={board_id}
                            // invitationType='1'
                            // invitationId={board_id}
                            // invitationOrg={org_id}
                            chirldrenTaskChargeChange={this.chirldrenTaskChargeChangeTwo} />
                        }
                      >
                        {/* 添加通知人按钮 */}

                        <div className={indexStyles.addNoticePerson}>
                          <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                        </div>
                      </Dropdown>
                    </div>
                  ) : (
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap', lineHeight: '22px' }}>
                        {makeCopyNewsPaperPersonList.map((value, index) => {
                          const { avatar, name, user_name, user_id } = value
                          return (
                            <div style={{ display: 'flex', alignItems: 'center' }} key={user_id}>
                              <div className={`${indexStyles.user_item}`} style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }} key={user_id}>
                                {avatar ? (
                                  <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                                    <img className={indexStyles.img_hover} style={{ width: '32px', height: '32px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                  </Tooltip>
                                ) : (
                                    <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title={name || user_name || '佚名'}>
                                      <div className={indexStyles.default_user_hover} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                        <Icon type={'user'} style={{ fontSize: 14, color: '#8c8c8c' }} />
                                      </div>
                                    </Tooltip>
                                  )}
                                {/* <div style={{ marginRight: 8, fontSize: '14px' }}>{name || user_name || '佚名'}</div> */}
                                <span onClick={(e) => { this.handleRemoveExecutorsTwo(e, user_id) }} className={`${indexStyles.userItemDeleBtn}`}></span>
                              </div>
                            </div>
                          )
                        })}
                        <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                          overlayStyle={{ maxWidth: '200px' }}
                          overlay={
                            <MenuSearchPartner
                              listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={makeCopyNewsPaperPersonList}
                              // board_id={board_id}
                              // invitationType='1'
                              // invitationId={board_id}
                              // invitationOrg={org_id}
                              chirldrenTaskChargeChange={this.chirldrenTaskChargeChangeTwo} />
                          }
                        >
                          {/* 添加通知人按钮 */}

                          <div className={indexStyles.addNoticePerson} style={{ marginTop: '-6px' }}>
                            <span className={`${globalStyles.authTheme} ${indexStyles.plus_icon}`}>&#xe8fe;</span>
                          </div>
                        </Dropdown>
                      </div>
                    )
                }

              </div>
            </div>
          )
        }
        {/* 更多选项 */}
        <div className={indexStyles.more_select}>
          <span className={indexStyles.more_label}>... 更多选项 &nbsp;:</span>
          <sapn className={`${indexStyles.select_item}`}>+ 完成期限</sapn>
          <sapn className={`${indexStyles.select_item}`}>+ 关联内容</sapn>
          <sapn className={`${indexStyles.select_item}`}>+ 备注</sapn>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [], processCurrentEditStep }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, processCurrentEditStep, projectDetailInfoData }
}