import React, { Component } from 'react'
import { connect } from 'dva'
import { Icon, Dropdown, Menu, DatePicker, Tooltip, Button } from 'antd'
import mainContentStyles from '../MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { isApiResponseOk } from '../../../utils/handleResponseData'
import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import InformRemind from '@/components/InformRemind'
import { timestampToTime, timestampToTimeNormal } from '@/utils/util'
import CustomFields from '../../CustomFields'
import CustomCategoriesOperate from '../../CustomFields/CustomCategoriesOperate';
import DefaultBasicFieldUIComponent from './BasicFieldUIComponent'
import FileListRightBarFileDetailModal from '@/routes/Technological/components/ProjectDetail/FileModule/FileListRightBarFileDetailModal';
import RelyOnRelationship from '../../RelyOnRelationship'
import { getCurrentDrawerContentPropsModelFieldData, renderTaskNounPlanCode, getCurrentFieldIcon } from '../handleOperateModal';
import {
  PROJECT_TEAM_CARD_EDIT
} from "@/globalset/js/constant";
import {
  isPaymentOrgUser
} from "@/utils/businessFunction";
import BasicFieldContainer  from './BasicFieldContainer'
import SetRelationContent from '../../RelyOnRelationship/SetRelationContent'

@connect(mapStateToProps)
export default class MainUIComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      is_change_parent_time: false,
      is_edit_title: false,
      inputValue: ''
    }
    // const log = new LogicTaskComponent()
    for (let val in props.LogicWithMainContent) {
      if (typeof props.LogicWithMainContent[val] == 'function') {
        this[val] = props.LogicWithMainContent[val].bind(this)
      }
    }
  }

  initState = () => {
    this.setState({
      propertiesList: [], // 添加的属性字段
      is_change_parent_time: false, // 是否可以修改父任务时间
      local_card_name: '', // 当前任务的名称
    })
  }

  componentWillMount() {
    Promise.resolve(
      this.props.dispatch({
        type: 'publicTaskDetailModal/getCardAttributesList',
        payload: {
        }
      })
    ).then(res => {
      if (isApiResponseOk(res)) {
        this.setState({
          propertiesList: res.data
        })
      }
    })
  }

  componentDidMount() {
    this.getInitCardDetailDatas()
  }

  componentWillReceiveProps(nextProps) {
    const { drawerVisible } = nextProps
    const { drawerVisible: oldDrawerVisible } = this.props
    // 忘记这步操作是在干嘛
    if (oldDrawerVisible == false && drawerVisible == true) {
      Promise.resolve(
        this.props.dispatch({
          type: 'publicTaskDetailModal/getCardAttributesList',
          payload: {
          }
        })
      ).then(res => {
        if (isApiResponseOk(res)) {
          this.setState({
            propertiesList: res.data
          })
        }
      })
      setTimeout(() => {
        this.getInitCardDetailDatas()
      }, 200)
    }
  }

  // 卸载时清空私有数据
  componentWillUnmount() {
    this.initState()
  }

  // 获取添加属性中的不同字段
  getDiffAttributies = () => {
    const { propertiesList = [], selectedKeys = [] } = this.state
    const { drawContent = {}, projectDetailInfoData } = this.props
    const { org_id, properties = [], fields = [] } = drawContent
    if (!(propertiesList && propertiesList.length)) {
      return (<></>)
    }
    let new_propertiesList = [...propertiesList]
    new_propertiesList = new_propertiesList.filter(item => item.code != 'CONTENTLINK')
    // 上传附件需要钱,所以需判断是否付费
    if (!isPaymentOrgUser(org_id)) {
      new_propertiesList = new_propertiesList.filter(item => item.code != 'ATTACHMENT')
    }
    return (
      <div>
        <div className={mainContentStyles.attrWrapper}>
          {
            (new_propertiesList && !(properties && properties.length == 6)) && new_propertiesList.map((item, index) => (
              <Button onClick={(e) => { this.handleMenuReallySelect(e, item) }} className={mainContentStyles.attr_btn} key={`${item.id}`}>
                <span className={`${globalStyles.authTheme} ${mainContentStyles.attr_icon}`}>{getCurrentFieldIcon(item)}</span>
                <span className={mainContentStyles.attr_name}>{renderTaskNounPlanCode(item)}</span>
              </Button>
            ))
          }
          <CustomFields style={{ display: 'inline-block' }} relations_fields={fields} org_id={org_id} handleAddCustomField={this.handleAddCustomField} placement="bottomLeft">
            <Button className={mainContentStyles.attr_btn}>更多</Button>
          </CustomFields>
        </div>
      </div>
    )
  }

  // 执行人渲染需要特殊处理
  renderPriciple = () => {
    const { drawContent = {}, projectDetailInfoData } = this.props
    const { showDelColor, currentDelId } = this.state
    const { card_id, board_id, org_id, properties = [] } = drawContent
    const { data = [], id } = getCurrentDrawerContentPropsModelFieldData({ properties, code: 'EXECUTOR' })
    const flag = (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit()
    return (
      <div>
        <div style={{ cursor: 'pointer' }} className={`${mainContentStyles.field_content} ${showDelColor && id == currentDelId && mainContentStyles.showDelColor}`}>
          <div className={mainContentStyles.field_item}>
            <div className={mainContentStyles.field_left}>
              {
                !flag && (
                  <span onClick={() => { this.handleDelCurrentField(id) }} className={`${globalStyles.authTheme} ${mainContentStyles.field_delIcon}`}>&#xe7fe;</span>
                )
              }
              <div className={mainContentStyles.field_hover}>
                <span style={{ fontSize: '16px', color: 'rgba(0,0,0,0.65)' }} className={globalStyles.authTheme}>&#xe7b2;</span>
                <span className={mainContentStyles.user_executor}>负责人</span>
              </div>
            </div>
            {
              (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                (
                  !data.length ? (
                    <div className={`${mainContentStyles.field_right}`}>
                      <div className={`${mainContentStyles.pub_hover}`}>
                        <span>暂无</span>
                      </div>
                    </div>
                  ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap' }} className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                        {data.map((value) => {
                          const { avatar, name, user_name, user_id } = value
                          return (
                            <div key={user_id} className={`${mainContentStyles.first_pric}`} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                              <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 10px', textAlign: 'center' }} key={user_id}>
                                {avatar ? (
                                  <img style={{ width: '24px', height: '24px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                ) : (
                                    <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                      <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                    </div>
                                  )}
                                <div style={{ marginRight: 8, fontSize: '14px' }} className={mainContentStyles.value_text}>{name || user_name || '佚名'}</div>
                                {/* <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${mainContentStyles.userItemDeleBtn}`}></span> */}
                              </div>

                            </div>
                          )
                        })}
                      </div>
                    )
                )
              ) : (
                  <span style={{ flex: '1' }}>
                    {
                      !data.length ? (
                        <div style={{ flex: '1', position: 'relative' }}>
                          <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                            overlay={
                              <MenuSearchPartner
                                // isInvitation={true}
                                inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}
                                invitationType='4'
                                invitationId={card_id}
                                invitationOrg={org_id}
                                listData={projectDetailInfoData.data} keyCode={'user_id'} searchName={'name'} currentSelect={data} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                                board_id={board_id} />
                            }
                          >
                            <div className={`${mainContentStyles.field_right}`}>
                              <div className={`${mainContentStyles.pub_hover}`}>
                                <span>指派负责人</span>
                              </div>
                            </div>
                          </Dropdown>
                        </div>
                      ) : (
                          <div style={{ flex: '1', position: 'relative' }}>
                            <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_pricipal} getPopupContainer={triggerNode => triggerNode.parentNode}
                              overlay={
                                <MenuSearchPartner
                                  // isInvitation={true}
                                  inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}
                                  invitationType='4'
                                  invitationId={card_id}
                                  invitationOrg={org_id}
                                  listData={projectDetailInfoData.data} keyCode={'user_id'} searchName={'name'} currentSelect={data} chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                                  board_id={board_id} />
                              }
                            >
                              <div style={{ display: 'flex', flexWrap: 'wrap' }} className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}>
                                {data.map((value) => {
                                  const { avatar, name, user_name, user_id } = value
                                  return (
                                    <div key={user_id} className={`${mainContentStyles.first_pric}`} style={{ display: 'flex', flexWrap: 'wrap', marginLeft: '-12px' }} key={user_id}>
                                      <div className={`${mainContentStyles.user_item}`} style={{ display: 'flex', alignItems: 'center', position: 'relative', margin: '2px 10px', textAlign: 'center' }} key={user_id}>
                                        {avatar ? (
                                          <img style={{ width: '24px', height: '24px', borderRadius: 20, margin: '0 2px' }} src={avatar} />
                                        ) : (
                                            <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#f5f5f5', margin: '0 2px' }}>
                                              <Icon type={'user'} style={{ fontSize: 12, color: '#8c8c8c' }} />
                                            </div>
                                          )}
                                        <div style={{ marginRight: 8, fontSize: '14px' }} className={mainContentStyles.value_text}>{name || user_name || '佚名'}</div>
                                        <span onClick={(e) => { this.handleRemoveExecutors(e, user_id) }} className={`${mainContentStyles.userItemDeleBtn}`}></span>
                                      </div>

                                    </div>
                                  )
                                })}
                              </div>
                            </Dropdown>
                          </div>
                        )
                    }
                  </span>
                )
            }
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { drawContent = {}, isInOpenFile, handleTaskDetailChange, handleChildTaskChange, whetherUpdateParentTaskTime } = this.props
    const {
      org_id,
      card_id,
      card_name,
      type = '0',
      is_realize = '0',
      start_time,
      due_time,
      dependencies = [],
      fields = []
    } = drawContent
    const { properties = [] } = drawContent
    const { data = [] } = getCurrentDrawerContentPropsModelFieldData({ properties, code: 'EXECUTOR' })
    const { boardFolderTreeData = [], milestoneList = [], selectedKeys = [], is_edit_title, inputValue } = this.state
    // 状态
    const filedEdit = (
      <Menu onClick={this.handleFiledIsComplete} getPopupContainer={triggerNode => triggerNode.parentNode} selectedKeys={is_realize == '0' ? ['incomplete'] : ['complete']}>
        <Menu.Item key="incomplete">
          <span>未完成</span>
          <div style={{ display: is_realize == '0' ? 'block' : 'none' }}>
            <Icon type="check" />
          </div>
        </Menu.Item>
        <Menu.Item key="complete">
          <span>已完成</span>
          {/* display: selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none' */}
          <div style={{ display: is_realize == '0' ? 'none' : 'block' }}>
            <Icon type="check" />
          </div>
        </Menu.Item>

      </Menu>
    )

    return (
      <div className={mainContentStyles.main_wrap}>
        <RelyOnRelationship relationshipList={dependencies} updateRelyOnRationList={this.updateRelyOnRationList} />
        <div className={mainContentStyles.main_content}>
          {/* 标题 S */}
          <div>
            <div className={mainContentStyles.title_content}>
              <div className={mainContentStyles.title_icon}>
                {
                  type == '0' ? (
                    <div style={{ cursor: 'pointer', }} onClick={this.setIsCheck} className={is_realize == '1' ? mainContentStyles.nomalCheckBoxActive : mainContentStyles.nomalCheckBox}>
                      <Icon type="check" style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' }} />
                    </div>
                  ) : (
                      <div style={{ width: 20, height: 20, color: '#595959', cursor: 'pointer' }}>
                        <i style={{ fontSize: '20px' }} className={globalStyles.authTheme}>&#xe84d;</i>
                      </div>
                    )
                }
              </div>
              {
                !is_edit_title ? (
                  <div onClick={(e) => { this.setTitleEdit(e, card_name) }} className={`${mainContentStyles.card_name} ${mainContentStyles.pub_hover}`}>
                    <span style={{ wordBreak: 'break-all' }}>{card_name}</span>
                  </div>
                ) : (
                    <NameChangeInput
                      autosize
                      onChange={this.titleTextAreaChange}
                      onBlur={this.titleTextAreaChangeBlur}
                      // onClick={this.setTitleEdit}
                      onPressEnter={this.titleTextAreaChangeBlur}
                      setIsEdit={this.titleTextAreaChangeBlur}
                      autoFocus={true}
                      goldName={inputValue}
                      maxLength={101}
                      nodeName={'input'}
                      style={{ display: 'block', fontSize: 20, color: '#262626', resize: 'none', height: '44px', background: 'rgba(255,255,255,1)', boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)', borderRadius: '4px', border: 'none' }}
                    />
                  )
              }
            </div>
          </div>
          {/* 标题 E */}

          {/* 各种字段的不同状态 S */}
          <div>
            {/* 负责人区域 S */}
            {this.whetherExistencePriciple() && this.renderPriciple()}
            {/* 负责人区域 E */}
            {/* 状态区域 */}
            <div>
              <div style={{ position: 'relative' }} className={mainContentStyles.field_content} style={{ cursor: 'pointer' }}>
                <div className={mainContentStyles.field_item}>
                  <div className={mainContentStyles.field_left}>
                    <div className={mainContentStyles.field_hover}>
                      <span className={`${globalStyles.authTheme}`}>&#xe6b6;</span>
                      <span>状态</span>
                    </div>
                  </div>
                  {
                    type == '0' ? (
                      <>
                        {
                          (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                            <div className={`${mainContentStyles.field_right}`}>
                              <div className={`${mainContentStyles.pub_hover}`}>
                                <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '未完成' : '已完成'}</span>
                              </div>
                            </div>
                          ) : (
                              <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_item} overlay={filedEdit} getPopupContainer={triggerNode => triggerNode.parentNode}>
                                <div className={`${mainContentStyles.field_right}`}>
                                  <div className={`${mainContentStyles.pub_hover}`}>
                                    <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '未完成' : '已完成'}</span>
                                  </div>
                                </div>
                              </Dropdown>
                            )
                        }
                      </>
                    ) : (
                        <div className={`${mainContentStyles.field_right}`}>
                          <div className={`${mainContentStyles.pub_hover}`}>
                            {
                              this.getMeetingStatus && this.getMeetingStatus()
                            }
                          </div>
                        </div>
                      )
                  }
                </div>

              </div>
            </div>
            {/* 时间区域 */}
            <div>
              <div className={mainContentStyles.field_content} style={{ cursor: 'pointer' }}>
                <div className={mainContentStyles.field_item}>
                  <div className={mainContentStyles.field_left}>
                    <div className={mainContentStyles.field_hover}>
                      <span style={{ fontWeight: 500 }} className={globalStyles.authTheme}>&#xe686;</span>
                      <span>时间</span>
                    </div>
                  </div>
                  <div className={`${mainContentStyles.field_right}`}>
                    <div style={{ display: 'flex' }}>
                      <div style={{ position: 'relative' }}>
                        {/* 开始时间 */}
                        {
                          (((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit())
                            || this.state.is_change_parent_time
                          ) ? (
                              (
                                <div className={`${mainContentStyles.start_time}`}>
                                  <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                    {start_time ? <span className={mainContentStyles.value_text}>{timestampToTime(start_time, true)}</span> : '暂无'}
                                  </span>
                                </div>
                              )
                            ) : (
                              <div className={`${mainContentStyles.start_time}`}>
                                <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                  {start_time ? <span className={mainContentStyles.value_text}>{timestampToTime(start_time, true)}</span> : '开始时间'}
                                  <DatePicker
                                    disabledDate={this.disabledStartTime.bind(this)}
                                    // onOk={this.startDatePickerChange.bind(this)}
                                    onChange={this.startDatePickerChange.bind(this)}
                                    // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                    placeholder={start_time ? timestampToTimeNormal(start_time, '/', true) : '开始时间'}
                                    format="YYYY/MM/DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                                </span>
                                <span onClick={this.handleDelStartTime} className={`${mainContentStyles.userItemDeleBtn} ${start_time && mainContentStyles.timeDeleBtn}`}></span>
                              </div>
                            )
                        }
                      &nbsp;
                      <span style={{ color: '#bfbfbf' }}> ~ </span>
                      &nbsp;
                      {/* 截止时间 */}
                        {
                          (((this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit())
                            || this.state.is_change_parent_time
                          ) ? (
                              (
                                <div className={`${mainContentStyles.due_time}`}>
                                  <span style={{ position: 'relative', zIndex: 0, minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                    {due_time ? <span className={mainContentStyles.value_text}>{timestampToTime(due_time, true)}</span> : '暂无'}
                                  </span>
                                </div>
                              )
                            ) : (
                              <div className={`${mainContentStyles.due_time}`}>
                                <span style={{ position: 'relative', minWidth: '80px', lineHeight: '38px', padding: '0 12px', display: 'inline-block', textAlign: 'center' }}>
                                  {due_time ? <span className={mainContentStyles.value_text}>{timestampToTime(due_time, true)}</span> : '截止时间'}
                                  <DatePicker
                                    disabledDate={this.disabledDueTime.bind(this)}
                                    // getCalendarContainer={triggerNode => triggerNode.parentNode}
                                    placeholder={due_time ? timestampToTimeNormal(due_time, '/', true) : '截止时间'}
                                    format="YYYY/MM/DD HH:mm"
                                    showTime={{ format: 'HH:mm' }}
                                    // onOk={this.endDatePickerChange.bind(this)}
                                    onChange={this.endDatePickerChange.bind(this)}
                                    style={{ opacity: 0, height: '100%', background: '#000000', position: 'absolute', left: 0, top: 0, width: 'auto' }} />
                                </span>
                                <span onClick={this.handleDelDueTime} className={`${mainContentStyles.userItemDeleBtn} ${due_time && mainContentStyles.timeDeleBtn}`}></span>
                              </div>
                            )
                        }
                      </div>
                      {/* 通知提醒 */}
                      {
                        (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                          ''
                        ) : (
                            <span style={{ position: 'relative' }}>
                              <InformRemind commonExecutors={data} style={{ display: 'inline-block', minWidth: '72px', height: '38px', borderRadius: '4px', textAlign: 'center' }} rela_id={card_id} rela_type={type == '0' ? '1' : '2'} />
                            </span>
                          )
                      }

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 各种字段的不同状态 E */}
          {/* 不同字段的渲染 S */}
          <div style={{ position: 'relative' }}>
            <BasicFieldContainer
              BasicFieldUIComponent={this.props.BasicFieldUIComponent ? this.props.BasicFieldUIComponent : DefaultBasicFieldUIComponent}
              LogicWithMainContent={this.props.LogicWithMainContent} 
              boardFolderTreeData={boardFolderTreeData} 
              milestoneList={milestoneList}
              whetherUpdateParentTaskTime={this.whetherUpdateParentTaskTime}
              handleChildTaskChange={handleChildTaskChange} 
              handleTaskDetailChange={handleTaskDetailChange}
              updateParentPropertiesList={this.updateParentPropertiesList}
            />
          </div>
          {/* 不同字段的渲染 E */}

          {/* 显示设置依赖字段 */}
          <div>
            <SetRelationContent />
          </div>

          {/* 渲染添加关联字段 */}
          <div>
            <CustomCategoriesOperate fields={fields} handleUpdateModelDatas={this.handleUpdateModelDatas} />
          </div>

          {/* 添加字段 S */}
          <div>
            {
              (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                ''
              ) : (
                  <>
                    {
                      // !(properties && properties.length == 6) && 
                      (
                        <div className={mainContentStyles.field_content}>
                          <div className={mainContentStyles.field_item}>
                            <div className={mainContentStyles.field_left}>
                              <div className={mainContentStyles.field_hover}>
                                <span className={globalStyles.authTheme}>&#xe8fe;</span>
                                <span>字段</span>
                              </div>
                            </div>
                            <div className={mainContentStyles.field_right}>
                              <div style={{ position: 'relative' }}>
                                {this.getDiffAttributies()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }
                  </>
                )
            }
          </div>
          {/* 添加字段 E */}
        </div>
        <div onClick={this.handleDynamicComment} id="dynamic_comment" className={mainContentStyles.dynamic_comment}>
          <Tooltip overlayStyle={{ minWidth: '72px' }} placement="top" title="动态消息" getPopupContainer={() => document.getElementById('dynamic_comment')}>
            <span className={globalStyles.authTheme}>&#xe8e8;</span>
          </Tooltip>
        </div>
        {/*查看任务附件*/}
        <div>
          {
            this.props.isInOpenFile && (
              <FileListRightBarFileDetailModal
                filePreviewCurrentFileId={this.props.filePreviewCurrentFileId}
                fileType={this.props.fileType}
                file_detail_modal_visible={this.props.isInOpenFile}
                filePreviewCurrentName={this.props.filePreviewCurrentName}
                setPreviewFileModalVisibile={this.setPreviewFileModalVisibile}
              />
            )
          }
        </div>
      </div>
    )
  }
}

// 只关联public弹窗内的数据
function mapStateToProps({
  publicTaskDetailModal: { drawerVisible, drawContent = {}, card_id, boardTagList = [], attributesList = [] },
  projectDetail: { datas: { projectDetailInfoData = {} } },
  publicFileDetailModal: {
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType,
    filePreviewCurrentName
  },
  technological: {
    datas: {
      userBoardPermissions
    }
  }
}) {
  return { drawerVisible, drawContent, card_id, boardTagList, attributesList, projectDetailInfoData, isInOpenFile, filePreviewCurrentFileId, fileType, filePreviewCurrentName, userBoardPermissions }
}
