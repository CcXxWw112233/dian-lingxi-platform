import React, { Component } from 'react'
import { Icon, Dropdown, Tooltip, Popconfirm, DatePicker, message, Menu, Modal, Breadcrumb } from 'antd'
import appendSubTaskStyles from './appendSubTask.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import AvatarList from '../AvatarList'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png';
import { timestampFormat, timestampToTimeNormal3, timestampToTimeNormal } from '@/utils/util'
import { connect } from 'dva'
import UploadAttachment from '../../UploadAttachment'
import { currentNounPlanFilterName } from '../../../utils/businessFunction'
import { TASKS } from '../../../globalset/js/constant'
import { isValidAvatar } from '../handleOperateModal'

@connect(({ publicTaskDetailModal: { drawContent = {} }, projectDetail: { datas: { projectDetailInfoData = {} } } }) => ({
  drawContent, projectDetailInfoData
}))
export default class AppendSubTaskItem extends Component {

  constructor(props) {
    super(props)
    for (let val in props.SubTaskItemLogic) {
      if (typeof props.SubTaskItemLogic[val] == 'function') {
        this[val] = props.SubTaskItemLogic[val].bind(this)
      }
    }
  }

  state = {
    is_edit_sub_name: false, // 是否修改子任务名称, 默认为 false
  }

  componentWillMount() {
    //设置默认项目名称
    this.initSet(this.props)
  }

  //初始化根据props设置state
  initSet(props) {
    const { childTaskItemValue } = props
    const { start_time, due_time, executors = [], card_name } = childTaskItemValue
    let local_executor
    if (executors.length) {
      local_executor = executors
    }

    this.setState({
      local_start_time: start_time,
      local_due_time: due_time,
      local_card_name: card_name,
      local_executor
    })
  }

  render() {
    const { childTaskItemValue, childDataIndex, dispatch, drawContent = {}, boardFolderTreeData, projectDetailInfoData: { data = [] } } = this.props
    const { org_id, board_id } = drawContent
    const { card_id, is_realize = '0', deliverables = [] } = childTaskItemValue
    const { local_card_name, local_executor = [], local_start_time, local_due_time, is_edit_sub_name } = this.state

    return (
      <div style={{ display: 'flex', position: 'relative' }} className={appendSubTaskStyles.active_icon}>
        <div className={`${appendSubTaskStyles.subTaskItemWrapper} ${appendSubTaskStyles.subTaskItemWrapper_active}`} key={childDataIndex}>
          <div style={{ display: 'flex' }}>
            {/*完成*/}
            <div style={{ flexShrink: 0 }} className={is_realize === '1' ? appendSubTaskStyles.nomalCheckBoxActive : appendSubTaskStyles.nomalCheckBox} onClick={this.itemOneClick}>
              <Icon type="check" style={{ color: '#FFFFFF', fontSize: 10, fontWeight: 'bold', position: 'absolute', top: '0', right: '0', left: '0', bottom: '0', margin: '1px auto' }} />
            </div>
            {/* 名字 */}
            <div style={{ flex: '1', cursor: 'pointer', borderBottom: '1px solid #C1C4CB', display: 'flex', justifyContent: 'space-between' }}>
              {
                !is_edit_sub_name ? (
                  <>
                    <div onClick={this.handleSubTaskName} className={appendSubTaskStyles.card_name}>
                      <span title={local_card_name} style={{ wordBreak: 'break-all' }}>{local_card_name}</span>
                    </div>
                    <div style={{ display: 'flex', width: '48px', justifyContent: 'space-between' }}>
                      <UploadAttachment
                        onFileListChange={this.onUploadFileListChange}
                        executors={local_executor}
                        boardFolderTreeData={boardFolderTreeData}
                        card_id={card_id}
                        title={'上传交付物列表设置'}
                        listDescribe={'交付物列表'}
                      >
                        <div title={'上传交付物'} className={`${appendSubTaskStyles.sub_upload} ${globalStyles.authTheme}`}>&#xe606;</div>
                      </UploadAttachment>
                      <Popconfirm getPopupContainer={triggerNode => triggerNode.parentNode} onConfirm={() => { this.deleteConfirm({ card_id, childDataIndex }) }} title={`删除该子${currentNounPlanFilterName(TASKS)}？`} placement={'topRight'}>
                        <div title={`删除子${currentNounPlanFilterName(TASKS)}`} className={`${appendSubTaskStyles.del_icon}`}>
                          <span className={`${globalStyles.authTheme}`}>&#xe7c3;</span>
                        </div>
                      </Popconfirm>
                    </div>
                  </>
                ) : (
                    <div style={{ width: 'calc(100% - 8px)' }}>
                      <input
                        autosize={true}
                        value={local_card_name}
                        onBlur={this.setchildTaskNameBlur}
                        onChange={this.setchildTaskNameChange}
                        onKeyDown={this.handlePressEnter}
                        autoFocus={true}
                        maxLength={100}
                        nodeName={'input'}
                        style={{ width: '100%', display: 'block', fontSize: 14, color: '#262626', resize: 'none', height: '38px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none', outline: 'none', paddingLeft: '12px' }}
                      />
                    </div>
                  )
              }
            </div>
          </div>
          <div style={{ display: 'flex', paddingLeft: '16px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              {/* 开始时间 */}
              <div>
                {
                  local_start_time ? (
                    <div className={appendSubTaskStyles.due_time}>
                      <div>
                        <span>{timestampToTimeNormal3(local_start_time, true)}</span>
                        <span onClick={this.handleDelStartTime} className={`${local_start_time && appendSubTaskStyles.timeDeleBtn}`}></span>
                      </div>
                      <DatePicker
                        disabledDate={this.disabledStartTime.bind(this)}
                        // onOk={this.startDatePickerChange.bind(this)}
                        onChange={this.startDatePickerChange.bind(this)}
                        // getCalendarContainer={triggerNode => triggerNode.parentNode}
                        placeholder={local_start_time ? timestampToTimeNormal(local_start_time, '/', true) : '开始时间'}
                        format="YYYY/MM/DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                    </div>
                  ) : (
                      <div className={`${appendSubTaskStyles.start_time}`}>
                        <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                          开始时间
                      <DatePicker
                            disabledDate={this.disabledStartTime.bind(this)}
                            onChange={this.startDatePickerChange.bind(this)}
                            placeholder={local_start_time ? timestampToTimeNormal(local_start_time, '/', true) : '开始时间'}
                            format="YYYY/MM/DD HH:mm"
                            showTime={{ format: 'HH:mm' }}
                            style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                        </span>
                      </div>
                    )
                }
              </div>
              &nbsp;
              <span style={{ color: '#bfbfbf' }}> ~ </span>
              &nbsp;
              {/* 截止时间 */}
              <div>
                {
                  local_due_time ? (
                    <div className={appendSubTaskStyles.due_time}>
                      <div>
                        <span>{timestampToTimeNormal3(local_due_time, true)}</span>
                        <span onClick={this.handleDelDueTime} className={`${local_due_time && appendSubTaskStyles.timeDeleBtn}`}></span>
                      </div>
                      <DatePicker
                        disabledDate={this.disabledDueTime.bind(this)}
                        onChange={this.endDatePickerChange.bind(this)}
                        placeholder={local_due_time ? timestampToTimeNormal(local_due_time, '/', true) : '截止时间'}
                        format="YYYY/MM/DD HH:mm"
                        showTime={{ format: 'HH:mm' }}
                        style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '2px', zIndex: 2 }} />
                    </div>
                  ) : (
                      <div className={`${appendSubTaskStyles.add_due_time}`}>
                        <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>截止时间</span>
                        <DatePicker
                          onChange={this.endDatePickerChange.bind(this)}
                          placeholder={local_due_time ? timestampToTimeNormal(local_due_time, '/', true) : '截止时间'}
                          format="YYYY/MM/DD HH:mm"
                          showTime={{ format: 'HH:mm' }}
                          style={{ opacity: 0, width: 'auto', background: '#000000', position: 'absolute', right: 0, top: '2px', zIndex: 2 }} />
                      </div>
                    )
                }
              </div>
            </div>

            {/* 执行人 */}
            <div style={{ flexShrink: 0 }}>
              <span style={{ position: 'relative', cursor: 'pointer' }} className={appendSubTaskStyles.user_pr}>
                <Dropdown overlayClassName={appendSubTaskStyles.overlay_sub_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                  overlay={
                    <MenuSearchPartner
                      handleSelectedAllBtn={this.handleSelectedAllBtn}
                      isInvitation={true}
                      listData={data} keyCode={'user_id'} searchName={'name'} currentSelect={local_executor} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                      board_id={board_id} />
                  }>
                  {
                    local_executor.length ? (
                      <div>
                        <AvatarList
                          size="mini"
                          maxLength={3}
                          excessItemsStyle={{
                            color: '#f56a00',
                            backgroundColor: '#fde3cf'
                          }}
                        >
                          {local_executor && local_executor.length ? local_executor.map(({ name, avatar }, index) => (
                            <AvatarList.Item
                              key={index}
                              tips={name}
                              src={isValidAvatar(avatar) ? avatar : defaultUserAvatar}
                            />
                          )) : (
                              <Tooltip title="执行人">
                                <span className={`${globalStyles.authTheme} ${appendSubTaskStyles.sub_executor}`}>&#xe7b2;</span>
                              </Tooltip>
                            )}
                        </AvatarList>
                      </div>
                    ) : (
                        <Tooltip title="执行人">
                          <span className={`${globalStyles.authTheme} ${appendSubTaskStyles.sub_executor}`}>&#xe7b2;</span>
                        </Tooltip>
                      )
                  }
                </Dropdown>
              </span>
            </div>
          </div>
          {/* 交付物 */}
          <div className={appendSubTaskStyles.filelist_wrapper}>
            {
              !!(deliverables && deliverables.length) && deliverables.map(fileInfo => {
                const { name: file_name, file_id } = fileInfo
                const breadcrumbList = getFolderPathName(fileInfo)
                return (
                  <div className={`${appendSubTaskStyles.file_item_wrapper}`} key={fileInfo.id}>
                    <div className={`${appendSubTaskStyles.file_item} ${appendSubTaskStyles.pub_hover}`} onClick={(e) => this.openFileDetailModal(e, fileInfo)} >
                      <div>
                        <span className={`${appendSubTaskStyles.file_action} ${globalStyles.authTheme}`} dangerouslySetInnerHTML={{ __html: judgeFileType(file_name) }}></span>
                      </div>
                      <div style={{ flex: 1, marginRight: '10px' }}>
                        <div onClick={(e) => this.openFileDetailModal(e, fileInfo)} title={file_name} className={appendSubTaskStyles.file_name}>{file_name}</div>
                      </div>
                      <div className={appendSubTaskStyles.file_info}>{showMemberName(fileInfo.create_by, data)} 上传于 {fileInfo.create_time && timestampFormat(fileInfo.create_time, "MM-dd hh:mm")}</div>
                      <div className={appendSubTaskStyles.breadNav} style={{ position: 'relative' }}>
                        <Breadcrumb className={appendSubTaskStyles.Breadcrumb} separator=">">
                          {breadcrumbList.map((value, key) => {
                            return (
                              // <Tooltip getPopupContainer={triggerNode => triggerNode.parentNode} title={(value && value.file_name) && value.file_name} placement="top">
                              <Breadcrumb.Item key={key}>
                                <span title={(value && value.file_name) && value.file_name} className={key == breadcrumbList.length - 1 && appendSubTaskStyles.breadItem}>{(value && value.file_name) && value.file_name}</span>
                              </Breadcrumb.Item>
                              // </Tooltip>
                            )
                          })}
                        </Breadcrumb>
                      </div>
                      <Dropdown trigger={['click']} getPopupContainer={triggerNode => triggerNode.parentNode} overlay={this.getAttachmentActionMenus(fileInfo)}>
                        <span onClick={(e) => e && e.stopPropagation()} className={`${appendSubTaskStyles.pay_more_icon} ${globalStyles.authTheme}`}>&#xe66f;</span>
                      </Dropdown>
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

AppendSubTaskItem.defaultProps = {
  boardFolderTreeData: [], // 上传的文件路径
  whetherUpdateParentTaskTime: function() {}, // 是否可以修改父任务时间
  handleChildTaskChange: function() {},
  handleTaskDetailChange: function() {},
  childTaskItemValue: {}, // 每一个子任务对象
  childDataIndex: '', //对应子任务下标
  updateRelyOnRationList: function() {}, // 更新依赖
}
