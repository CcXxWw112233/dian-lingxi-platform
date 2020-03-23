import React, { Component } from 'react'
import { Select, InputNumber, Dropdown, Icon, Radio, Tooltip, Switch } from 'antd'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'

const Option = Select.Option;

export default class MoreOptionsComponent extends Component {

  state = {
    makeCopyPersonList: [], // 抄送人列表
  }

  // 更多选项的点击事件
  handleSelectedMoreOptions(code, e) {
    e && e.stopPropagation()
    const { itemValue } = this.props
    const { options_data = [] } = itemValue
    let moreOptionsList = [...options_data] || []
    let obj = {}
    obj = {
      code: code,
    }
    moreOptionsList.push(obj)
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: moreOptionsList }, 'options_data')
    if (code == 'DUPLICATED') {
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({value: '1'}, 'cc_type')
    } else if (code == 'COMPLETION_DEADLINE') {
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '2' }, 'deadline_type')
    }
  }

  // 更多选项的删除事件
  handleDelMoreIcon(code, e) {
    e && e.stopPropagation()
    const { itemValue } = this.props
    const { options_data = [] } = itemValue
    let moreOptionsList = [...options_data] || []
    moreOptionsList = moreOptionsList.filter(item => {
      if (item.code != code) {
        return item
      }
    })
    switch (code) {
      case 'COMPLETION_DEADLINE':
        this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '1' }, 'deadline_type')
        this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: 'day' }, 'deadline_time_type')
        this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '1' }, 'deadline_value')
        break
      case 'DUPLICATED': // 抄送
        this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '0' }, 'cc_type')
        this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '' }, 'recipients')
        break;
      case 'REMARKS':
        this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '' }, 'description')
        break
      default:
        break;
    }
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: moreOptionsList }, 'options_data')
  }

  // 完成期限
  deadlineValueChange = (value) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_value')
  }
  deadlineTimeTypeValueChange = (value) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value }, 'deadline_time_type')
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: 1 }, 'deadline_value')
  }

  // 添加节点备注事件
  handleRemarksWrapper = (e) => {
    e && e.stopPropagation()
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: false }, 'is_click_node_description')
  }

  handleRemarksContent = (e) => {
    e && e.stopPropagation()
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: true }, 'is_click_node_description')
  }

  titleTextAreaChangeBlur = (e) => {
    let val = e.target.value.trimLR()
    if (val == "" || val == " " || !val) {
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: '' }, 'description')
      this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: false }, 'is_click_node_description')
      return
    }
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: val }, 'description')
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: false }, 'is_click_node_description')
  }

  titleTextAreaChangeClick = (e) => {
    e && e.stopPropagation()
  }

  //修改通知人的回调 S
  chirldrenTaskChargeChange = (data) => {
    const { data: membersData } = this.props;
    // 多个任务执行人
    // const membersData = projectDetailInfoData['data'] //所有的人
    // const excutorData = new_userInfo_data //所有的人
    let newMakeCopyPersonList = []
    let assignee_value = []
    const { selectedKeys = [], type, key } = data
    for (let i = 0; i < selectedKeys.length; i++) {
      for (let j = 0; j < membersData.length; j++) {
        if (selectedKeys[i] === membersData[j]['user_id']) {
          newMakeCopyPersonList.push(membersData[j])
          assignee_value.push(membersData[j].user_id)
        }
      }
    }

    this.setState({
      makeCopyPersonList: newMakeCopyPersonList
    });
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: assignee_value.join(',') }, 'recipients')
  }
  // 添加执行人的回调 E

  // 移除执行人的回调 S
  handleRemoveExecutors = (e, shouldDeleteItem) => {
    e && e.stopPropagation()
    const { makeCopyPersonList = [] } = this.state
    const { itemValue } = this.props
    const { recipients } = itemValue
    let newMakeCopyPersonList = [...makeCopyPersonList]
    let newAssigneesArray = recipients && recipients.length ? recipients.split(',') : []
    newMakeCopyPersonList.map((item, index) => {
      if (item.user_id == shouldDeleteItem) {
        newMakeCopyPersonList.splice(index, 1)
        newAssigneesArray.splice(index, 1)
      }
    })
    let newRecipientsStr = newAssigneesArray.join(',')
    this.setState({
      makeCopyPersonList: newMakeCopyPersonList
    })
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: newRecipientsStr }, 'recipients')
  }

  // 是否锁定抄送人
  handleCCLocking = (value) => {
    this.props.updateConfigureProcess && this.props.updateConfigureProcess({ value: value ? '1' : '0' }, 'cc_locking')
  }

  // 渲染完成期限
  renderCompletionDeadline = () => {
    const { itemValue } = this.props
    const { deadline_time_type, deadline_value, description, } = itemValue
    return (
      <div className={`${indexStyles.complet_deadline}`}>
        <span style={{ fontWeight: 900, marginRight: '2px', color: 'rgba(0,0,0,0.45)'}} className={globalStyles.authTheme}>&#xe686;</span>
        <span style={{color: 'rgba(0,0,0,0.45)'}}>完成期限 &nbsp;: </span>
        <InputNumber precision="0.1" min={1} max={deadline_time_type == 'hour' ? 24 : deadline_time_type == 'day' ? 30 : 12} value={deadline_value} onChange={this.deadlineValueChange} onClick={(e) => e.stopPropagation()} className={indexStyles.select_number} />
        <Select className={indexStyles.select_day} value={deadline_time_type} onChange={this.deadlineTimeTypeValueChange}>
          <Option value="hour">时</Option>
          <Option value="day">天</Option>
          <Option value="month">月</Option>
        </Select>
        <span onClick={this.handleDelMoreIcon.bind(this, 'COMPLETION_DEADLINE')} className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
      </div>
    )
  }

  // 渲染抄报人
  renderDuplicatedPerson = () => {
    const { makeCopyPersonList = [], makeCopyNewsPaperPersonList = [] } = this.state
    const { data = [] } = this.props
    return (
      <div className={indexStyles.fill_person}>
        <div style={{display: 'flex', alignItems: 'center'}}>
          <span className={`${indexStyles.label_person}`} style={{ fontSize: '14px', color:'rgba(0,0,0,0.45)' }}><span className={`${globalStyles.authTheme}`}>&#xe618;</span> 抄送人 (必填)&nbsp;:</span>
          <span style={{marginRight: '8px'}}><Switch style={{marginRight: '8px'}} size="small" onChange={this.handleCCLocking}/> 锁定抄送人</span>
          <span style={{ position: 'relative',marginRight: '25px' }}>
            <Tooltip overlayStyle={{minWidth: '250px'}} getPopupContainer={triggerNode => triggerNode.parentNode} title="锁定抄送人后启动流程时不可修改抄送人" placement="top"><span style={{fontSize: '16px', color:'rgba(217,217,217,1)', cursor: 'pointer'}} className={`${globalStyles.authTheme}`}>&#xe845;</span></Tooltip>
          </span>
          <span onClick={this.handleDelMoreIcon.bind(this, 'DUPLICATED')} className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
        </div>
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
    )
  }

  // 渲染备注
  renderRemarks = () => {
    const { itemValue } = this.props
    const { description, is_click_node_description } = itemValue
    return (
      <div onClick={this.handleRemarksWrapper} className={`${indexStyles.select_remarks}`}>
        <span style={{color: 'rgba(0,0,0,0.45)'}} className={globalStyles.authTheme}>&#xe636; 备注 &nbsp;:</span>
        <span onClick={this.handleDelMoreIcon.bind(this, 'REMARKS')} className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
        {
          !is_click_node_description ? (
            <div onClick={(e) => { this.handleRemarksContent(e) }} className={indexStyles.remarks_content}>{description != '' ? description : '添加备注'}</div>
          ) : (
              <NameChangeInput
                autosize
                onBlur={this.titleTextAreaChangeBlur}
                onPressEnter={this.titleTextAreaChangeBlur}
                onClick={this.titleTextAreaChangeClick}
                autoFocus={true}
                goldName={''}
                nodeName={'input'}
                style={{ display: 'block', fontSize: 12, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', marginTop: '4px' }}
              />
            )
        }

      </div>
    )
  }

  renderMoreOptionsItem = (item) => {
    const { code } = item
    let container = (<div></div>)
    switch (code) {
      case 'COMPLETION_DEADLINE':
        container = this.renderCompletionDeadline()
        break;
      case 'REMARKS':
        container = this.renderRemarks()
        break
      case 'DUPLICATED':
        container = this.renderDuplicatedPerson()
        break
      default:
        break;
    }
    return container
  }

  render() {
    const { itemValue } = this.props
    const { options_data = [], node_type, cc_type } = itemValue
    let deadlineCode = (options_data && options_data.length && (options_data.filter(item => item.code == 'COMPLETION_DEADLINE') || {})[0] || []).code || ''
    let remarksCode = (options_data && options_data.length && (options_data.filter(item => item.code == 'REMARKS') || {})[0] || []).code || ''
    let duplicatedCode = (options_data && options_data.length && (options_data.filter(item => item.code == 'DUPLICATED') || {})[0] || []).code || ''
    return (
      <div>
        {/* 完成期限 */}
        {/* {
          deadlineCode && deadlineCode == 'COMPLETION_DEADLINE' && (
            this.renderCompletionDeadline()
          )
        } */}
        {/* 抄送 */}
        {/* {
          duplicatedCode && duplicatedCode == 'DUPLICATED' && (
            this.renderDuplicatedPerson()
          )
        } */}
        {/* 备注 */}
        {/* {
          remarksCode && remarksCode == 'REMARKS' && (
            this.renderRemarks()
          )
        } */}
        {
          options_data && options_data.map(item => {
            return (this.renderMoreOptionsItem(item))
          })
        }
        {/* 更多选项 */}
        {
          options_data.length == '3' || (node_type == '3' && cc_type == '1') && options_data.length == '2' ? (
            <></>
          ) : (
              <div className={indexStyles.more_select}>
                <span className={indexStyles.more_label}>... 更多选项 &nbsp;:</span>
                {
                  !deadlineCode && (node_type == '3' ? cc_type == '1' ? false : true : true) && (
                    <sapn onClick={this.handleSelectedMoreOptions.bind(this, 'COMPLETION_DEADLINE')} className={`${indexStyles.select_item}`}>+ 完成期限</sapn>
                  )
                }
                {
                  !duplicatedCode && (
                    <span onClick={this.handleSelectedMoreOptions.bind(this, 'DUPLICATED')} className={`${indexStyles.select_item}`}>+ 抄送</span>
                  )
                }
                {
                  !remarksCode && (
                    <sapn onClick={this.handleSelectedMoreOptions.bind(this, 'REMARKS')} className={`${indexStyles.select_item}`}>+ 备注</sapn>
                  )
                }
              </div>
            )
        }
        {/* 关联内容 */}
        {/* <div className={indexStyles.select_related}>
          <span className={globalStyles.authTheme}>&#xe7f5; 关联内容 &nbsp; :</span>
          <span className={`${globalStyles.authTheme} ${indexStyles.del_moreIcon}`}>&#xe7fe;</span>
          <div className={indexStyles.related_content}>添加关联</div>
        </div> */}
      </div>
    )
  }
}

// 更多选项组件
MoreOptionsComponent.defaultProps = {

}