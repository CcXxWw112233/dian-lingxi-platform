import React, { Component } from 'react'
import { Button, Dropdown, Icon, Menu, Radio, Select, InputNumber, Tooltip } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { connect } from 'dva'

const Option = Select.Option;

@connect(mapStateToProps)
export default class ConfigureStepTypeTwo extends Component {

  state = {
    approvalsList: []
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { projectDetailInfoData = {} } = this.props;
    // 多个任务执行人
    const membersData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newApprovalsList = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newApprovalsList.push(membersData[j])
        }
      }
    }

    this.setState({
      approvalsList: newApprovalsList
    });

  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { approvalsList = [] } = this.state
    let newApprovalsList = [...approvalsList]
    newApprovalsList.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        newApprovalsList.splice(index, 1)
      }
    })
    this.setState({
      approvalsList: newApprovalsList
    })
  }

  render() {
    const { approvalsList = [] } = this.state
    const { itemValue, processEditDatas = [], itemKey, projectDetailInfoData = {} } = this.props
    const { data, board_id } = projectDetailInfoData
    const { assignee_type, deadline_type, deadline_value, description, is_click_node_description } = itemValue
    return (
      <div>
        {/* 审批类型 */}
        <div className={indexStyles.approve_content}>
          <span style={{ marginRight: '20px' }} className={globalStyles.authTheme}>&#xe616; 审批类型 :</span>
          <Radio.Group style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Radio>串签</Radio>
            <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title="依照审批人员的排序依次审批"><span className={`${globalStyles.authTheme} ${indexStyles.approve_tips}`}>&#xe845;</span></Tooltip>
            <Radio>并签</Radio>
            <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title="所有审批人员可同时审批"><span className={`${globalStyles.authTheme} ${indexStyles.approve_tips}`}>&#xe845;</span></Tooltip>
            <Radio>汇签 ≥</Radio>
            <span style={{ marginRight: '4px' }}><InputNumber min={1} />&nbsp;&nbsp;%&nbsp;&nbsp;通过</span>
            <Tooltip overlayStyle={{ minWidth: '418px' }} getPopupContainer={triggerNode => triggerNode.parentNode} placement="top" title="审批过程不公开其他审批人的意见，所有审批人审批后，公开所有审批意见，如通过率达到设定的标准，则审批通过。"><span className={`${globalStyles.authTheme} ${indexStyles.approve_tips}`}>&#xe845;</span></Tooltip>
          </Radio.Group>
        </div>
        {/* 审批人 */}
        <div className={indexStyles.fill_person}>
          <span className={`${indexStyles.label_person}`}><span className={`${globalStyles.authTheme}`} style={{ fontSize: '16px' }}>&#xe7b2;</span> 审批人 (必填)&nbsp;:</span>
          <div style={{ flex: 1, padding: '8px 0' }}>
            {
              !approvalsList.length ? (
                <div style={{ position: 'relative' }}>
                  <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                    overlayStyle={{ maxWidth: '200px' }}
                    overlay={
                      <MenuSearchPartner
                        listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={approvalsList}
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
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexWrap: 'wrap',lineHeight: '22px' }}>
                    {approvalsList.map((value, index) => {
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
                          {
                            <span style={{ color: 'rgba(0,0,0,0.25)' }} className={globalStyles.authTheme}>&#xe61f;</span>
                          }
                        </div>
                      )
                    })}
                    <Dropdown trigger={['click']} overlayClassName={indexStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                      overlayStyle={{ maxWidth: '200px' }}
                      overlay={
                        <MenuSearchPartner
                          listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={approvalsList}
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
        {/* 更多选项 */}
        <div className={indexStyles.more_select}>
          <span className={indexStyles.more_label}>... 更多选项 &nbsp;:</span>
          <sapn className={`${indexStyles.select_item}`}>+ 完成期限</sapn>
          <sapn className={`${indexStyles.select_item}`}>+ 关联内容</sapn>
          <sapn className={`${indexStyles.select_item}`}>+ 备注</sapn>
        </div>
        {/* 删除 | 确认 */}
        <div className={indexStyles.step_btn}>
          <Button onClick={this.handleDeleteButton} disabled={itemKey == '0' ? true : false}>删除</Button>
          <Button onClick={this.handleConfirmButton} type="primary">确认</Button>
        </div>
      </div>
    )
  }
}

function mapStateToProps({ publicProcessDetailModal: { processEditDatas = [], processCurrentEditStep }, projectDetail: { datas: { projectDetailInfoData = {} } } }) {
  return { processEditDatas, processCurrentEditStep, projectDetailInfoData }
}
