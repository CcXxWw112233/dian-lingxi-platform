/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import { connect } from 'dva'
import {
  Icon,
  Dropdown,
  Menu,
  DatePicker,
  Progress,
  Button,
  Breadcrumb,
  InputNumber
} from 'antd'
import mainContentStyles from './MainContent.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import NameChangeInput from '@/components/NameChangeInput'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import RichTextEditor from '@/components/RichTextEditor'
import UploadAttachment from '@/components/UploadAttachment'
import InformRemind from '@/components/InformRemind'
import EarlyWarning from '@/components/EarlyWarning'
import {
  timestampToTime,
  timestampToTimeNormal,
  timestampFormat
} from '@/utils/util'
import { PROJECT_TEAM_CARD_EDIT } from '@/globalset/js/constant'
import { isPaymentOrgUser } from '@/utils/businessFunction'
import FileListRightBarFileDetailModal from '@/routes/Technological/components/ProjectDetail/FileModule/FileListRightBarFileDetailModal'
import {
  renderTaskNounPlanCode,
  getCurrentFieldIcon,
  getCurrentDrawerContentPropsModelFieldData,
  getFolderPathName,
  judgeFileType,
  showMemberName
} from '../../../../../../../components/TaskDetailModal/handleOperateModal'
import BasicFieldUIComponent from './BasicFieldUIComponent'
import BasicFieldContainer from '../../../../../../../components/TaskDetailModal/UIWithContainerComponent/BasicFieldContainer'
import CustomCategoriesOperate from '../../../../../../../components/CustomFields/CustomCategoriesOperate'
import moment from 'moment'
import { currentNounPlanFilterName } from '../../../../../../../utils/businessFunction'
import {
  TASKS,
  REQUEST_DOMAIN_BOARD
} from '../../../../../../../globalset/js/constant'
import { caldiffDays, isOverdueTime } from '../../../../../../../utils/util'
import SetNodeGroup from '../../OutlineTree/SetNodeGroup'

@connect(mapStateToProps)
export default class MainContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      is_change_parent_time: false,
      is_edit_title: false, // ??????????????????
      inputValue: '',
      taskStatus: '' //????????????
    }
    for (let val in props.LogicWithMainContent) {
      if (typeof props.LogicWithMainContent[val] == 'function') {
        this[val] = props.LogicWithMainContent[val].bind(this)
      }
    }
  }

  // componentWillMount() {
  //   Promise.resolve(
  //     this.props.dispatch({
  //       type: 'publicTaskDetailModal/getCardAttributesList',
  //       payload: {}
  //     })
  //   ).then(res => {
  //     if (isApiResponseOk(res)) {
  //       this.setState({
  //         propertiesList: res.data
  //       })
  //     }
  //   })
  // }

  componentDidMount() {
    this.getInitCardDetailDatas(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, drawerVisible, card_id } = nextProps
    const {
      drawerVisible: oldDrawerVisible,
      drawContent = {},
      card_id: old_card_id,
      selected_card_visible,
      simplemodeCurrentProject = {}
    } = this.props
    if (card_id != old_card_id && card_id) {
      // Promise.resolve(
      //   this.props.dispatch({
      //     type: 'publicTaskDetailModal/getCardAttributesList',
      //     payload: {}
      //   })
      // ).then(res => {
      //   if (isApiResponseOk(res)) {
      //     this.setState({
      //       propertiesList: res.data
      //     })
      //   }
      // })
      setTimeout(() => {
        this.getInitCardDetailDatas(nextProps)
      }, 200)
    }
    // ?????????????????? ????????????????????????
    if (
      selected_card_visible &&
      simplemodeCurrentProject.board_id &&
      simplemodeCurrentProject.board_id != '0' &&
      drawContent.board_id &&
      simplemodeCurrentProject.board_id != drawContent.board_id
    ) {
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          selected_card_visible: false
        }
      })
      dispatch({
        type: 'publicTaskDetailModal/updateDatas',
        payload: {
          drawContent: {},
          card_id: ''
        }
      })
    }
    this.setStatusProperty && this.setStatusProperty()
  }

  // ????????????????????????????????????
  getDiffAttributies = () => {
    // const { propertiesList = [], selectedKeys = [] } = this.state
    const { propertiesList = [], drawContent = {} } = this.props
    const { org_id } = drawContent
    if (!(propertiesList && propertiesList.length)) {
      return <></>
    }
    let new_propertiesList = [...propertiesList]
    new_propertiesList = new_propertiesList.filter(
      item => item.code != 'CONTENTLINK'
    )
    if (!isPaymentOrgUser(org_id)) {
      new_propertiesList = new_propertiesList.filter(
        item => item.code != 'ATTACHMENT'
      )
    }
    return (
      <div>
        <div className={mainContentStyles.attrWrapper}>
          {new_propertiesList &&
            new_propertiesList.map((item, index) => (
              <Button
                onClick={e => {
                  this.handleMenuReallySelect(e, item)
                }}
                className={mainContentStyles.attr_btn}
                key={`${item.id}`}
              >
                <span
                  className={`${globalStyles.authTheme} ${mainContentStyles.attr_icon}`}
                >
                  {getCurrentFieldIcon(item)}
                </span>
                <span className={mainContentStyles.attr_name}>
                  {renderTaskNounPlanCode(item)}
                </span>
              </Button>
            ))}
        </div>
      </div>
    )
  }

  // ?????????????????????????????????
  renderPriciple = () => {
    const { drawContent = {}, projectDetailInfoData } = this.props
    const { showDelColor, currentDelId } = this.state
    const { card_id, board_id, org_id, properties = [] } = drawContent
    const { data = [], id } = getCurrentDrawerContentPropsModelFieldData({
      properties,
      code: 'EXECUTOR'
    })
    const flag =
      this.checkDiffCategoriesAuthoritiesIsVisible &&
      this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit &&
      !this.checkDiffCategoriesAuthoritiesIsVisible(
        PROJECT_TEAM_CARD_EDIT
      ).visit_control_edit()
    return (
      <div>
        <div
          style={{ cursor: 'pointer' }}
          className={`${mainContentStyles.field_content} ${showDelColor &&
            id == currentDelId &&
            mainContentStyles.showDelColor}`}
        >
          <div className={mainContentStyles.field_left}>
            <div className={mainContentStyles.field_hover}>
              <span className={mainContentStyles.user_executor}>?????????</span>
            </div>
            {!flag && (
              <span
                onClick={() => {
                  this.handleDelCurrentField(id)
                }}
                className={`${globalStyles.authTheme} ${mainContentStyles.field_delIcon}`}
              >
                &#xe7fe;
              </span>
            )}
          </div>
          {this.checkDiffCategoriesAuthoritiesIsVisible &&
          this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit &&
          !this.checkDiffCategoriesAuthoritiesIsVisible(
            PROJECT_TEAM_CARD_EDIT
          ).visit_control_edit() ? (
            !data.length ? (
              <div className={`${mainContentStyles.field_right}`}>
                <div className={`${mainContentStyles.pub_hover}`}>
                  <span>??????</span>
                </div>
              </div>
            ) : (
              <div
                style={{ display: 'flex', flexWrap: 'wrap' }}
                className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}
              >
                {data.map(value => {
                  const { avatar, name, user_name, user_id } = value
                  return (
                    <div
                      key={user_id}
                      className={`${mainContentStyles.first_pric}`}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        marginLeft: '-12px'
                      }}
                    >
                      <div
                        className={`${mainContentStyles.user_item}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          position: 'relative',
                          margin: '2px 10px',
                          textAlign: 'center'
                        }}
                        key={user_id}
                      >
                        {avatar ? (
                          <img
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: 20,
                              margin: '0 2px'
                            }}
                            src={avatar}
                          />
                        ) : (
                          <div
                            style={{
                              width: '24px',
                              height: '24px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: 20,
                              backgroundColor: '#f5f5f5',
                              margin: '0 2px'
                            }}
                          >
                            <Icon
                              type={'user'}
                              style={{ fontSize: 12, color: '#8c8c8c' }}
                            />
                          </div>
                        )}
                        <div
                          style={{ marginRight: 8, fontSize: '14px' }}
                          className={mainContentStyles.value_text}
                        >
                          {name || user_name || '??????'}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          ) : (
            <span style={{ flex: '1', display: 'block' }}>
              {!data.length ? (
                <div style={{ flex: '1', position: 'relative' }}>
                  <Dropdown
                    trigger={['click']}
                    overlayClassName={mainContentStyles.overlay_pricipal}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    overlay={
                      <MenuSearchPartner
                        inviteOthersToBoardCalback={
                          this.inviteOthersToBoardCalback
                        }
                        invitationType="4"
                        invitationId={card_id}
                        invitationOrg={org_id}
                        listData={projectDetailInfoData.data}
                        keyCode={'user_id'}
                        searchName={'name'}
                        currentSelect={data}
                        chirldrenTaskChargeChange={
                          this.chirldrenTaskChargeChange
                        }
                        board_id={board_id}
                      />
                    }
                  >
                    <div className={`${mainContentStyles.field_right}`}>
                      <div className={`${mainContentStyles.pub_hover}`}>
                        <span>???????????????</span>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              ) : (
                <div style={{ flex: '1', position: 'relative' }}>
                  <Dropdown
                    trigger={['click']}
                    overlayClassName={mainContentStyles.overlay_pricipal}
                    getPopupContainer={triggerNode => triggerNode.parentNode}
                    overlay={
                      <MenuSearchPartner
                        inviteOthersToBoardCalback={
                          this.inviteOthersToBoardCalback
                        }
                        invitationType="4"
                        invitationId={card_id}
                        invitationOrg={org_id}
                        listData={projectDetailInfoData.data}
                        keyCode={'user_id'}
                        searchName={'name'}
                        currentSelect={data}
                        chirldrenTaskChargeChange={
                          this.chirldrenTaskChargeChange
                        }
                        board_id={board_id}
                      />
                    }
                  >
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap' }}
                      className={`${mainContentStyles.field_right} ${mainContentStyles.pub_hover}`}
                    >
                      {data.map(value => {
                        const { avatar, name, user_name, user_id } = value
                        return (
                          <div
                            key={user_id}
                            className={`${mainContentStyles.first_pric}`}
                            style={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              marginLeft: '-12px'
                            }}
                          >
                            <div
                              className={`${mainContentStyles.user_item}`}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                position: 'relative',
                                margin: '2px 10px',
                                textAlign: 'center'
                              }}
                              key={user_id}
                            >
                              {avatar ? (
                                <img
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: 20,
                                    margin: '0 2px'
                                  }}
                                  src={avatar}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 20,
                                    backgroundColor: '#f5f5f5',
                                    margin: '0 2px'
                                  }}
                                >
                                  <Icon
                                    type={'user'}
                                    style={{ fontSize: 12, color: '#8c8c8c' }}
                                  />
                                </div>
                              )}
                              <div
                                style={{ marginRight: 8, fontSize: '14px' }}
                                className={mainContentStyles.value_text}
                              >
                                {name || user_name || '??????'}
                              </div>
                              <span
                                onClick={e => {
                                  this.handleRemoveExecutors(e, user_id)
                                }}
                                className={`${mainContentStyles.userItemDeleBtn}`}
                              ></span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </Dropdown>
                </div>
              )}
            </span>
          )}
        </div>
      </div>
    )
  }

  // ????????????
  renderReMarks = () => {
    const {
      drawContent = {},
      projectDetailInfoData: { data = [] }
    } = this.props
    const { showDelColor, currentDelId, boardFolderTreeData = [] } = this.state
    const {
      card_id,
      board_id,
      org_id,
      properties = [],
      dec_files = []
    } = drawContent
    let { data: executors = [] } = getCurrentDrawerContentPropsModelFieldData({
      properties,
      code: 'EXECUTOR'
    })
    const { data: gold_data, id } = getCurrentDrawerContentPropsModelFieldData({
      properties,
      code: 'REMARK'
    })
    const flag =
      this.checkDiffCategoriesAuthoritiesIsVisible &&
      this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit &&
      !this.checkDiffCategoriesAuthoritiesIsVisible(
        PROJECT_TEAM_CARD_EDIT
      ).visit_control_edit()
    return (
      <div
        key={id}
        style={{ position: 'relative' }}
        className={`${mainContentStyles.field_content} ${showDelColor &&
          id == currentDelId &&
          mainContentStyles.showDelColor}`}
      >
        <div className={mainContentStyles.field_left}>
          <div className={mainContentStyles.field_hover}>
            <span>{`${currentNounPlanFilterName(TASKS)}`}??????</span>
          </div>
          {!flag && (
            <span
              onClick={() => {
                this.handleDelCurrentField(id)
              }}
              className={`${globalStyles.authTheme} ${mainContentStyles.field_delIcon}`}
            >
              &#xe7fe;
            </span>
          )}
        </div>
        <div className={`${mainContentStyles.field_right}`}>
          <div>
            {this.checkDiffCategoriesAuthoritiesIsVisible &&
            this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit &&
            !this.checkDiffCategoriesAuthoritiesIsVisible(
              PROJECT_TEAM_CARD_EDIT
            ).visit_control_edit() ? (
              !gold_data || gold_data == '<p></p>' ? (
                <div className={`${mainContentStyles.pub_hover}`}>
                  <span>??????</span>
                </div>
              ) : (
                <>
                  <div className={`${mainContentStyles.pub_hover}`}>
                    <div
                      className={mainContentStyles.descriptionContent}
                      dangerouslySetInnerHTML={{ __html: gold_data }}
                    ></div>
                  </div>
                </>
              )
            ) : (
              // ???????????????
              <>
                <div>
                  <RichTextEditor
                    saveBrafitEdit={this.saveBrafitEdit}
                    value={gold_data && gold_data}
                  >
                    <div>
                      <div
                        style={{ paddingLeft: '12px' }}
                        onClick={e => e && e.stopPropagation()}
                      >
                        <UploadAttachment
                          executors={executors.data}
                          boardFolderTreeData={boardFolderTreeData}
                          card_id={card_id}
                          title={`????????????????????????`}
                          listDescribe={'??????????????????'}
                          isNotShowNoticeList={true}
                          url={`${REQUEST_DOMAIN_BOARD}/card/desc/attachment/upload`}
                          onFileListChange={this.onUploadDescFileListChange}
                        >
                          <span className={mainContentStyles.add_sub_upload}>
                            <span
                              style={{ fontSize: '16px' }}
                              className={globalStyles.authTheme}
                            >
                              &#xe7fa;
                            </span>
                            <span>??????????????????</span>
                          </span>
                        </UploadAttachment>
                      </div>
                      <div
                        style={{ padding: '0px 2px', paddingLeft: '12px' }}
                        className={`${mainContentStyles.pub_hover}`}
                      >
                        {gold_data && gold_data != '<p></p>' ? (
                          <div
                            className={mainContentStyles.descriptionContent}
                            dangerouslySetInnerHTML={{ __html: gold_data }}
                          ></div>
                        ) : (
                          '????????????'
                        )}
                      </div>
                    </div>
                  </RichTextEditor>
                </div>
              </>
            )}
          </div>
          <div>
            {/* ????????? */}
            <div className={mainContentStyles.filelist_wrapper}>
              {!!(dec_files && dec_files.length) &&
                dec_files.map(fileInfo => {
                  const { name: file_name, file_id } = fileInfo
                  const breadcrumbList = getFolderPathName(fileInfo)
                  return (
                    <div
                      className={`${mainContentStyles.file_item_wrapper}`}
                      key={fileInfo.id}
                    >
                      <div
                        className={`${mainContentStyles.file_item} ${mainContentStyles.pub_hover}`}
                        onClick={e => this.openFileDetailModal(e, fileInfo)}
                      >
                        <div>
                          <span
                            className={`${mainContentStyles.file_action} ${globalStyles.authTheme}`}
                            dangerouslySetInnerHTML={{
                              __html: judgeFileType(file_name)
                            }}
                          ></span>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            marginRight: '32px',
                            width: 0,
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          <div
                            title={file_name}
                            className={mainContentStyles.file_name}
                          >
                            {file_name}
                          </div>
                          <div className={mainContentStyles.file_info}>
                            {showMemberName(fileInfo.create_by, data)} ?????????{' '}
                            {fileInfo.create_time &&
                              timestampFormat(
                                fileInfo.create_time,
                                'MM-dd hh:mm'
                              )}
                          </div>
                          <div
                            className={mainContentStyles.breadNav}
                            style={{ position: 'relative' }}
                          >
                            <Breadcrumb
                              className={mainContentStyles.Breadcrumb}
                              separator=">"
                            >
                              {breadcrumbList.map((value, key) => {
                                return (
                                  <Breadcrumb.Item key={key}>
                                    <span
                                      title={
                                        value &&
                                        value.file_name &&
                                        value.file_name
                                      }
                                      className={
                                        key == breadcrumbList.length - 1 &&
                                        mainContentStyles.breadItem
                                      }
                                    >
                                      {value &&
                                        value.file_name &&
                                        value.file_name}
                                    </span>
                                  </Breadcrumb.Item>
                                )
                              })}
                            </Breadcrumb>
                          </div>
                        </div>
                        <Dropdown
                          trigger={['click']}
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          }
                          overlay={this.getAttachmentActionMenus({
                            fileInfo,
                            code: 'REMARK',
                            card_id
                          })}
                        >
                          <span
                            onClick={e => e && e.stopPropagation()}
                            className={`${mainContentStyles.pay_more_icon} ${globalStyles.authTheme}`}
                          >
                            &#xe66f;
                          </span>
                        </Dropdown>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ??????????????????
  renderStartTime = () => {
    const {
      drawContent = {},
      projectDetailInfoData = {},
      base_relative_time: relative_time
    } = this.props
    // const { board_set = {} } = projectDetailInfoData
    // const { relative_time } = board_set
    const { start_time } = drawContent
    const day_value =
      start_time && start_time != '0'
        ? caldiffDays(relative_time, start_time)
        : start_time == relative_time
        ? 0
        : ''
    return this.showTimerMode() ? (
      <>
        &nbsp;
        <InputNumber
          min={0}
          onChange={this.handleStartRelativeChange}
          value={day_value ? day_value : day_value === 0 ? 0 : ''}
          style={{ width: '68px' }}
        />
        &nbsp;???
      </>
    ) : (
      <>
        {this.showTimerRange() ? (
          <DatePicker
            disabledDate={this.disabledStartTime.bind(this)}
            onChange={this.startDatePickerChange.bind(this)}
            placeholder={
              start_time
                ? timestampToTimeNormal(start_time, '/', false)
                : '????????????'
            }
            format="YYYY/MM/DD"
            style={{
              opacity: 0,
              height: '100%',
              background: '#000000',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'auto'
            }}
          />
        ) : (
          <DatePicker
            disabledDate={this.disabledStartTime.bind(this)}
            onChange={this.startDatePickerChange.bind(this)}
            placeholder={
              start_time
                ? timestampToTimeNormal(start_time, '/', true)
                : '????????????'
            }
            format="YYYY/MM/DD HH:mm"
            showTime={{
              defaultValue: moment('09:00', 'HH:mm'),
              format: 'HH:mm'
            }}
            style={{
              opacity: 0,
              height: '100%',
              background: '#000000',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'auto'
            }}
          />
        )}
      </>
    )
  }

  // ??????????????????
  renderDueTime = () => {
    const {
      drawContent = {},
      projectDetailInfoData = {},
      base_relative_time: relative_time
    } = this.props
    // const { board_set = {} } = projectDetailInfoData
    // const { relative_time } = board_set
    const { due_time } = drawContent
    const day_value =
      due_time && due_time != '0'
        ? caldiffDays(relative_time, due_time)
        : due_time == relative_time
        ? 0
        : ''
    return this.showTimerMode() ? (
      <>
        &nbsp;
        <InputNumber
          min={0}
          onChange={this.handleDueRelativeChange}
          value={day_value ? day_value : day_value === 0 ? 0 : ''}
          style={{ width: '68px' }}
        />
        &nbsp;???
      </>
    ) : (
      <>
        {this.showTimerRange() ? (
          <DatePicker
            disabledDate={this.disabledDueTime.bind(this)}
            placeholder={
              due_time
                ? timestampToTimeNormal(due_time, '/', false)
                : '????????????'
            }
            format="YYYY/MM/DD"
            onChange={this.endDatePickerChange.bind(this)}
            style={{
              opacity: 0,
              height: '100%',
              background: '#000000',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'auto'
            }}
          />
        ) : (
          <DatePicker
            disabledDate={this.disabledDueTime.bind(this)}
            placeholder={
              due_time ? timestampToTimeNormal(due_time, '/', true) : '????????????'
            }
            format="YYYY/MM/DD HH:mm"
            showTime={{
              defaultValue: moment('17:59', 'HH:mm'),
              format: 'HH:mm'
            }}
            onChange={this.endDatePickerChange.bind(this)}
            style={{
              opacity: 0,
              height: '100%',
              background: '#000000',
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'auto'
            }}
          />
        )}
      </>
    )
  }

  handleSetMoreField = () => {
    this.props.dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        selected_more_field_visible: true
      }
    })
  }

  setNodeGroupProps = () => {
    const { drawContent = {} } = this.props
    const { card_id: id, list_ids = [] } = drawContent
    const _obj = {
      tree_type: '2',
      id,
      list_ids
    }
    // console.log('ssssssssssasddd', _obj)
    return _obj
  }

  render() {
    const {
      drawContent = {},
      milestoneList = [],
      projectDetailInfoData: { board_set = {} },
      base_relative_time: relative_time
    } = this.props
    // const { board_set = {} } = projectDetailInfoData
    const { date_mode } = board_set
    const {
      card_id,
      card_name,
      type = '0',
      is_realize = '0',
      start_time,
      due_time,
      progress_percent
    } = drawContent
    const { properties = [], fields = [] } = drawContent
    const executors = getCurrentDrawerContentPropsModelFieldData({
      properties,
      code: 'EXECUTOR'
    })
    const {
      boardFolderTreeData = [],
      selectedKeys = [],
      inputValue,
      is_edit_title
    } = this.state
    // ??????
    const filedEdit = (
      <Menu
        onClick={this.handleFiledIsComplete}
        getPopupContainer={triggerNode => triggerNode.parentNode}
        selectedKeys={is_realize == '0' ? ['incomplete'] : ['complete']}
      >
        <Menu.Item key="incomplete">
          <span>?????????</span>
          <div style={{ display: is_realize == '0' ? 'block' : 'none' }}>
            <Icon type="check" />
          </div>
        </Menu.Item>
        <Menu.Item key="complete">
          <span>?????????</span>
          {/* display: selectedKeys.indexOf(user_id) != -1 ? 'block' : 'none' */}
          <div style={{ display: is_realize == '0' ? 'none' : 'block' }}>
            <Icon type="check" />
          </div>
        </Menu.Item>
      </Menu>
    )

    const start_day_time = caldiffDays(relative_time, start_time)
    const due_day_time = caldiffDays(relative_time, due_time)

    return (
      <div className={mainContentStyles.main_wrap}>
        <div className={mainContentStyles.main_content}>
          {/* ?????? S */}
          <div>
            <div className={mainContentStyles.title_content}>
              <div className={mainContentStyles.title_icon}>
                {type == '0' ? (
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={this.setIsCheck}
                    className={
                      is_realize == '1'
                        ? mainContentStyles.nomalCheckBoxActive
                        : mainContentStyles.nomalCheckBox
                    }
                  >
                    <Icon
                      type="check"
                      style={{
                        color: '#FFFFFF',
                        fontSize: 16,
                        fontWeight: 'bold'
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      color: '#595959',
                      cursor: 'pointer'
                    }}
                  >
                    <i
                      style={{ fontSize: '20px' }}
                      className={globalStyles.authTheme}
                    >
                      &#xe84d;
                    </i>
                  </div>
                )}
              </div>
              {!is_edit_title ? (
                <div
                  onClick={e => {
                    this.setTitleEdit(e, card_name)
                  }}
                  className={`${mainContentStyles.card_name} ${mainContentStyles.pub_hover}`}
                >
                  <span style={{ wordBreak: 'break-all' }}>{card_name}</span>
                </div>
              ) : (
                <NameChangeInput
                  autosize
                  onChange={this.titleTextAreaChange}
                  onBlur={this.titleTextAreaChangeBlur}
                  onPressEnter={this.titleTextAreaChangeBlur}
                  setIsEdit={this.titleTextAreaChangeBlur}
                  autoFocus={true}
                  goldName={inputValue}
                  maxLength={101}
                  nodeName={'input'}
                  style={{
                    display: 'block',
                    fontSize: 20,
                    color: '#262626',
                    resize: 'none',
                    height: '44px',
                    background: 'rgba(255,255,255,1)',
                    boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.15)',
                    borderRadius: '4px',
                    border: 'none'
                  }}
                />
              )}
            </div>
          </div>
          {/* ?????? E */}
          <div
            style={{
              padding: '0 12px',
              height: 28,
              textAlign: 'center',
              lineHeight: '28px',
              border: '1px solid #D1D5E4',
              borderRadius: 4,
              color: '#212434',
              width: 'max-content',
              marginBottom: 12
            }}
          >
            {this.state.taskStatus}
          </div>
          {/* ??????????????????????????? S */}
          <div>
            {/* ???????????? */}
            <div>
              <div
                className={mainContentStyles.field_content}
                style={{ cursor: 'pointer' }}
              >
                <div className={mainContentStyles.field_left}>
                  <div className={mainContentStyles.field_hover}>
                    {/* <span className={globalStyles.authTheme}>&#xe686;</span> */}
                    <span>??????</span>
                  </div>
                </div>
                <div
                  className={`${mainContentStyles.field_right}`}
                  style={{ paddingLeft: 12 }}
                >
                  <Progress
                    percent={progress_percent}
                    strokeColor={'#95DE64'}
                  />
                </div>
              </div>
            </div>

            {/* ??????????????? S */}
            {this.whetherExistencePriciple('EXECUTOR') && this.renderPriciple()}
            {/* ??????????????? E */}

            {/* ???????????? */}
            <div>
              {/* <div style={{ position: 'relative' }} className={mainContentStyles.field_content} style={{ cursor: 'pointer' }}>
                <div className={mainContentStyles.field_left}>
                  <div className={mainContentStyles.field_hover}>
                    <span>????????????</span>
                  </div>
                </div>
                {
                  type == '0' ? (
                    <>
                      {
                        (this.checkDiffCategoriesAuthoritiesIsVisible && this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit) && !this.checkDiffCategoriesAuthoritiesIsVisible(PROJECT_TEAM_CARD_EDIT).visit_control_edit() ? (
                          <div className={`${mainContentStyles.field_right}`}>
                            <div className={`${mainContentStyles.pub_hover}`}>
                              <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '?????????' : '?????????'}</span>
                            </div>
                          </div>
                        ) : (
                            <Dropdown trigger={['click']} overlayClassName={mainContentStyles.overlay_item} overlay={filedEdit} getPopupContainer={triggerNode => triggerNode.parentNode}>
                              <div className={`${mainContentStyles.field_right}`}>
                                <div className={`${mainContentStyles.pub_hover}`}>
                                  <span className={is_realize == '0' ? mainContentStyles.incomplete : mainContentStyles.complete}>{is_realize == '0' ? '?????????' : '?????????'}</span>
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
              </div> */}
            </div>
            {/* ???????????? */}
            <div>
              <div
                className={mainContentStyles.field_content}
                style={{ cursor: 'pointer' }}
              >
                <div className={mainContentStyles.field_left}>
                  <div className={mainContentStyles.field_hover}>
                    {/* <span className={globalStyles.authTheme}>&#xe686;</span> */}
                    <span>??????</span>
                  </div>
                </div>
                <div className={`${mainContentStyles.field_right}`}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        marginRight: '16px',
                        display: 'flex'
                      }}
                    >
                      {/* ???????????? */}
                      {(this.checkDiffCategoriesAuthoritiesIsVisible &&
                        this.checkDiffCategoriesAuthoritiesIsVisible()
                          .visit_control_edit &&
                        !this.checkDiffCategoriesAuthoritiesIsVisible(
                          PROJECT_TEAM_CARD_EDIT
                        ).visit_control_edit()) ||
                      this.state.is_change_parent_time ? (
                        <div className={`${mainContentStyles.start_time}`}>
                          <span
                            style={{
                              position: 'relative',
                              zIndex: 0,
                              minWidth: '80px',
                              lineHeight: '38px',
                              padding: '0 12px',
                              display: 'inline-block',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {start_time ? (
                              <span className={mainContentStyles.value_text}>
                                {this.showTimerMode() ? (
                                  <>T + {start_day_time} ???</>
                                ) : (
                                  timestampToTime(
                                    start_time,
                                    this.showTimerRange() ? true : false
                                  )
                                )}
                              </span>
                            ) : (
                              '??????'
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className={`${mainContentStyles.start_time}`}>
                          <span
                            style={{
                              position: 'relative',
                              zIndex: 0,
                              minWidth: '80px',
                              lineHeight: '38px',
                              padding: '0 12px',
                              display: 'inline-block',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {this.showTimerMode() ? (
                              'T +'
                            ) : (
                              <>
                                {start_time ? (
                                  <span
                                    className={mainContentStyles.value_text}
                                  >
                                    {timestampToTime(
                                      start_time,
                                      this.showTimerRange() ? true : false
                                    )}
                                  </span>
                                ) : (
                                  '????????????'
                                )}
                              </>
                            )}
                            {this.renderStartTime()}
                          </span>
                          {!this.showTimerMode() && (
                            <span
                              onClick={this.handleDelStartTime}
                              className={`${
                                mainContentStyles.userItemDeleBtn
                              } ${start_time && mainContentStyles.timeDeleBtn}`}
                            ></span>
                          )}
                        </div>
                      )}
                      &nbsp;
                      <span style={{ color: '#bfbfbf' }}> ~ </span>
                      &nbsp;
                      {/* ???????????? */}
                      {(this.checkDiffCategoriesAuthoritiesIsVisible &&
                        this.checkDiffCategoriesAuthoritiesIsVisible()
                          .visit_control_edit &&
                        !this.checkDiffCategoriesAuthoritiesIsVisible(
                          PROJECT_TEAM_CARD_EDIT
                        ).visit_control_edit()) ||
                      this.state.is_change_parent_time ? (
                        <div className={`${mainContentStyles.due_time}`}>
                          <span
                            style={{
                              position: 'relative',
                              zIndex: 0,
                              minWidth: '80px',
                              lineHeight: '38px',
                              padding: '0 12px',
                              display: 'inline-block',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {due_time ? (
                              <span className={mainContentStyles.value_text}>
                                {this.showTimerMode() ? (
                                  <>T + {due_day_time} ???</>
                                ) : (
                                  timestampToTime(
                                    due_time,
                                    this.showTimerRange() ? true : false
                                  )
                                )}
                              </span>
                            ) : (
                              '??????'
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className={`${mainContentStyles.due_time}`}>
                          <span
                            style={{
                              position: 'relative',
                              minWidth: '80px',
                              lineHeight: '38px',
                              padding: '0 12px',
                              display: 'inline-block',
                              textAlign: 'center',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {this.showTimerMode() ? (
                              'T +'
                            ) : (
                              <>
                                {due_time ? (
                                  <span
                                    className={mainContentStyles.value_text}
                                  >
                                    {timestampToTime(
                                      due_time,
                                      this.showTimerRange() ? true : false
                                    )}
                                  </span>
                                ) : (
                                  '????????????'
                                )}
                              </>
                            )}

                            {this.renderDueTime()}
                          </span>
                          {!this.showTimerMode() && (
                            <span
                              onClick={this.handleDelDueTime}
                              className={`${
                                mainContentStyles.userItemDeleBtn
                              } ${due_time && mainContentStyles.timeDeleBtn}`}
                            ></span>
                          )}
                        </div>
                      )}
                    </div>
                    {/* ???????????? */}
                    {(this.checkDiffCategoriesAuthoritiesIsVisible &&
                      this.checkDiffCategoriesAuthoritiesIsVisible()
                        .visit_control_edit &&
                      !this.checkDiffCategoriesAuthoritiesIsVisible(
                        PROJECT_TEAM_CARD_EDIT
                      ).visit_control_edit()) ||
                    this.showTimerMode() ? (
                      ''
                    ) : (
                      <span style={{ position: 'relative' }}>
                        <InformRemind
                          commonExecutors={executors.data}
                          style={{
                            display: 'inline-block',
                            minWidth: '72px',
                            height: '38px',
                            borderRadius: '4px',
                            textAlign: 'center'
                          }}
                          rela_id={card_id}
                          rela_type={type == '0' ? '1' : '2'}
                        />
                      </span>
                    )}
                    {/* ???????????????????????????????????????????????????????????? */}
                    {!!start_time &&
                      !!due_time &&
                      !isOverdueTime(due_time) &&
                      date_mode == '0' && (
                        <EarlyWarning
                          handleUpdateDatas={
                            this.updateDrawContentWithUpdateParentListDatas
                          }
                        />
                      )}
                  </div>
                </div>
              </div>
            </div>
            {/* ???????????? S */}
            {this.whetherExistencePriciple('REMARK') && this.renderReMarks()}
            {/* ???????????? E */}

            {/* ???????????? */}
            <div>
              <div
                className={mainContentStyles.field_content}
                style={{ cursor: 'pointer' }}
              >
                <div className={mainContentStyles.field_left}>
                  <div className={mainContentStyles.field_hover}>
                    {/* <span className={globalStyles.authTheme}>&#xe686;</span> */}
                    <span>??????</span>
                  </div>
                </div>
                <div
                  className={`${mainContentStyles.field_right}`}
                  style={{ paddingLeft: 12 }}
                >
                  <SetNodeGroup
                    nodeValue={this.setNodeGroupProps()}
                    wrapper_styles={{ justifyContent: 'flex-start' }}
                    item_styles={{ maxWidth: 100 }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ??????????????????????????? E */}
          {/* ????????????????????? S */}
          <div style={{ position: 'relative' }}>
            <BasicFieldContainer
              BasicFieldUIComponent={BasicFieldUIComponent}
              LogicWithMainContent={this.props.LogicWithMainContent}
              boardFolderTreeData={boardFolderTreeData}
              milestoneList={milestoneList}
              whetherUpdateParentTaskTime={this.whetherUpdateParentTaskTime}
              handleChildTaskChange={this.props.handleChildTaskChange}
              handleTaskDetailChange={this.props.handleTaskDetailChange}
              updateParentPropertiesList={this.updateParentPropertiesList}
              updatePrivateVariablesWithOpenFile={
                this.updatePrivateVariablesWithOpenFile
              }
              handleRelyUploading={this.props.handleRelyUploading}
            />
          </div>
          {/* ????????????????????? E */}

          {/* ???????????????????????? */}
          <div>
            <CustomCategoriesOperate
              {...this.props}
              onlyShowPopoverContent={true}
              disabled={
                this.checkDiffCategoriesAuthoritiesIsVisible &&
                this.checkDiffCategoriesAuthoritiesIsVisible()
                  .visit_control_edit &&
                !this.checkDiffCategoriesAuthoritiesIsVisible(
                  PROJECT_TEAM_CARD_EDIT
                ).visit_control_edit()
              }
              fields={fields}
              handleUpdateModelDatas={this.handleUpdateModelDatas}
            />
          </div>

          {/* ???????????? */}
          <div className={mainContentStyles.field_content}>
            {this.checkDiffCategoriesAuthoritiesIsVisible &&
            this.checkDiffCategoriesAuthoritiesIsVisible().visit_control_edit &&
            !this.checkDiffCategoriesAuthoritiesIsVisible(
              PROJECT_TEAM_CARD_EDIT
            ).visit_control_edit() ? (
              ''
            ) : (
              <div
                className={mainContentStyles.field_left}
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <div className={mainContentStyles.field_hover}>
                  <span>??????</span>
                </div>
                <div
                  onClick={this.handleSetMoreField}
                  style={{ color: '#5680FA' }}
                >
                  <span>?????? &gt;</span>
                </div>
              </div>
            )}
            <div className={`${mainContentStyles.field_right}`}>
              {/* ???????????? S */}
              <div>
                {this.checkDiffCategoriesAuthoritiesIsVisible &&
                this.checkDiffCategoriesAuthoritiesIsVisible()
                  .visit_control_edit &&
                !this.checkDiffCategoriesAuthoritiesIsVisible(
                  PROJECT_TEAM_CARD_EDIT
                ).visit_control_edit() ? (
                  ''
                ) : (
                  <>
                    {!(properties && properties.length == 7) && (
                      <>{this.getDiffAttributies()}</>
                    )}
                  </>
                )}
              </div>
              {/* ???????????? E */}
            </div>
          </div>
        </div>
        {/* <div
          onClick={this.handleDynamicComment}
          id="dynamic_comment"
          className={mainContentStyles.dynamic_comment}
        >
          <Tooltip
            overlayStyle={{ minWidth: '72px' }}
            placement="top"
            title="????????????"
            getPopupContainer={() => document.getElementById('dynamic_comment')}
          >
            <span className={globalStyles.authTheme}>&#xe8e8;</span>
          </Tooltip>
        </div> */}
        {/*??????????????????*/}
        <div>
          {this.props.isInOpenFile && this.state.whetherIsOpenFileVisible && (
            <FileListRightBarFileDetailModal
              filePreviewCurrentFileId={this.props.filePreviewCurrentFileId}
              fileType={this.props.fileType}
              file_detail_modal_visible={this.props.isInOpenFile}
              filePreviewCurrentName={this.props.filePreviewCurrentName}
              setPreviewFileModalVisibile={this.setPreviewFileModalVisibile}
              whetherUpdateFolderListData={this.whetherUpdateFolderListData}
            />
          )}
        </div>
      </div>
    )
  }
}

// ?????????public??????????????????
function mapStateToProps({
  publicTaskDetailModal: {
    drawerVisible,
    drawContent = {},
    card_id,
    boardTagList = [],
    attributesList = [],
    propertiesList = [],
    milestoneList = [],
    card_list_group = []
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  gantt: {
    datas: { group_view_type, selected_card_visible, base_relative_time }
  },
  publicFileDetailModal: {
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType,
    filePreviewCurrentName
  },
  simplemode: { simplemodeCurrentProject = {} },
  technological: {
    datas: { userBoardPermissions }
  }
}) {
  return {
    group_view_type,
    selected_card_visible,
    drawerVisible,
    drawContent,
    card_id,
    boardTagList,
    attributesList,
    propertiesList,
    milestoneList,
    projectDetailInfoData,
    isInOpenFile,
    filePreviewCurrentFileId,
    fileType,
    filePreviewCurrentName,
    simplemodeCurrentProject,
    userBoardPermissions,
    card_list_group,
    base_relative_time
  }
}
