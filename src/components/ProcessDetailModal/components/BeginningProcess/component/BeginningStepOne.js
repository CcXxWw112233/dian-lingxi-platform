import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import AvatarList from '../../AvatarList'
import BeginningStepOne_one from './BeginningStepOne_one'
import BeginningStepOne_two from './BeginningStepOne_two'
import BeginningStepOne_three from './BeginningStepOne_three'
import BeginningStepOne_five from './BeginningStepOne_five'
import {
  validateTel,
  validateFixedTel,
  validateIdCard,
  validateChineseName,
  validatePostalCode,
  validateWebsite,
  validateQQ,
  validatePositiveInt,
  validateNegative,
  validateTwoDecimal
} from '../../../../../utils/verify'
import defaultUserAvatar from '@/assets/invite/user_default_avatar@2x.png'
import { Button, message, Modal, notification, Tooltip } from 'antd'
import { connect } from 'dva'
import {
  compareACoupleOfObjects,
  isObjectValueEqual
} from '../../../../../utils/util'
import {
  checkIsHasPermissionInVisitControl,
  checkIsHasPermissionInBoard,
  currentNounPlanFilterName
} from '../../../../../utils/businessFunction'
import {
  PROJECT_FLOW_FLOW_ACCESS,
  NOT_HAS_PERMISION_COMFIRN,
  MESSAGE_DURATION_TIME,
  FLOWS
} from '../../../../../globalset/js/constant'
import {
  genPrincipalListFromAssignees,
  findCurrentFileInfo,
  transAssigneesToIds,
  getCurrentDesignatedRolesMembers
} from '../../handleOperateModal'
import DifferenceDeadlineType from '../../DifferenceDeadlineType'
import BeginningStepOne_six from './BeginningStepOne_six'
import {
  changeProcessAssignees,
  changeProcessRecipients,
  saveOnlineExcelWithProcess,
  UrgeStart
} from '../../../../../services/technological/workFlow'
import { isApiResponseOk } from '../../../../../utils/handleResponseData'
import AmendComponent from '../../ProcessStartConfirm/AmendComponent'
import { Fragment } from 'react'
import { DidShowUrging } from '../../../../../utils/businessFunction'

@connect(mapStateToProps)
export default class BeginningStepOne extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transPrincipalList: props.itemValue.assignees
        ? [...props.itemValue.assignees]
        : [], // 表示当前的执行人
      transCopyPersonnelList: props.itemValue.recipients
        ? [...props.itemValue.recipients]
        : [], // 表示当前选择的抄送人
      is_show_spread_arrow:
        props.itemValue.status == '1' || props.itemValue.runtime_type == '1'
          ? true
          : false, // 是否展开箭头 详情 true表示展开
      form_values: [],
      sheetListData: {}, // 存放表格列表数据
      /**
       * 是否显示催办按钮
       */
      updateShowUrgeBtn: false,
      updateShowUrgeText: false
    }
    /**
     * modal的namespace
     */
    this.process_action_key = 'publicProcessDetailModal'
    /**
     * redux中需要调用的方法
     */
    this.action_valuekey = 'getProcessInfo'
  }

  componentDidMount() {
    this.updateUrgeBtn()
  }

  /**
   * 更新按钮
   */
  updateUrgeBtn = props => {
    const { processInfo, itemValue } = props || this.props
    const doit = DidShowUrging(processInfo, itemValue.id)
    this.setState({
      updateShowUrgeBtn: doit.isShowUrgeButton(),
      updateShowUrgeText: doit.isShowUrgeText(itemValue)
    })
  }

  updateState = flag => {
    this.setState({
      is_uploading: flag
    })
  }
  updateParentsAssigneesOrCopyPersonnel = (data, key) => {
    const { value } = data
    const {
      projectDetailInfoData: { data: boardData = [] },
      currentOrgAllMembers = [],
      itemValue: { role_users = [], assignee_type }
    } = this.props
    let roles_data = getCurrentDesignatedRolesMembers(
      currentOrgAllMembers,
      role_users
    )
    let new_data = assignee_type == '3' ? [...roles_data] : [...boardData]
    let values = []
    new_data.map(item => {
      if (value.indexOf(item.user_id) != -1) {
        values.push(item)
      }
    })
    this.setState({
      [key]: values
    })
  }

  componentWillReceiveProps(nextProps) {
    // 需要更新箭头的状态
    if (!isObjectValueEqual(this.props, nextProps)) {
      this.setState({
        is_show_spread_arrow:
          nextProps.itemValue.status == '1' ||
          nextProps.itemValue.runtime_type == '1'
            ? true
            : false
      })
    }
    this.updateUrgeBtn(nextProps)
  }

  /**
   * 判断是否有完成按钮
   * @returns {Boolean} true 表示显示 false表示不能显示
   */
  whetherShowCompleteButton = () => {
    const { itemValue } = this.props
    const { assignee_type } = itemValue
    const { transPrincipalList = [] } = this.state
    const { id } = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : {}
    let flag = false
    let newAssignees = [...transPrincipalList]
    newAssignees.find(item => {
      if (item.id == id) {
        flag = true
      }
    })
    return flag
  }

  // 更新对应步骤下的节点内容数据, 即当前操作对象的数据
  updateCorrespondingPrcodessStepWithNodeContent = (data, value) => {
    const {
      itemValue: {
        id,
        assignees = [],
        recipients = [],
        assignee_type,
        role_users = []
      },
      processEditDatas = [],
      itemKey,
      dispatch,
      projectDetailInfoData: { data: boardData = [] },
      currentOrgAllMembers = []
    } = this.props
    let roles_data = getCurrentDesignatedRolesMembers(
      currentOrgAllMembers,
      role_users
    )
    let new_data = assignee_type == '3' ? [...roles_data] : [...boardData]
    let newProcessEditDatas = [...processEditDatas]
    if (data == 'assignees' && !!value) {
      let assignees_ = []
      let users = []
      new_data.map(item => {
        if ((value.split(',') || []).indexOf(item.user_id || item.id) != -1) {
          assignees_.push(item)
          users.push(item.user_id)
        }
      })
      changeProcessAssignees({
        flow_node_instance_id: id,
        users: users
      }).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success('修改成功', MESSAGE_DURATION_TIME)
          }, 200)
          newProcessEditDatas[itemKey][data] = assignees_
          dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              processEditDatas: newProcessEditDatas
            }
          })
        } else {
          newProcessEditDatas[itemKey][data] = assignees
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      })
      return
    } else if (data == 'recipients' && !!value) {
      let recipients_ = []
      let users = []
      boardData.map(item => {
        if ((value.split(',') || []).indexOf(item.user_id || item.id) != -1) {
          recipients_.push(item)
          users.push(item.user_id)
        }
      })
      changeProcessRecipients({
        flow_node_instance_id: id,
        users: users
      }).then(res => {
        if (isApiResponseOk(res)) {
          setTimeout(() => {
            message.success('修改成功', MESSAGE_DURATION_TIME)
          }, 200)
          newProcessEditDatas[itemKey][data] = recipients_
          dispatch({
            type: 'publicProcessDetailModal/updateDatas',
            payload: {
              processEditDatas: newProcessEditDatas
            }
          })
        } else {
          newProcessEditDatas[itemKey][data] = recipients
          message.warn(res.message, MESSAGE_DURATION_TIME)
        }
      })
      return
    } else {
      newProcessEditDatas[itemKey][data] = value
      dispatch({
        type: 'publicProcessDetailModal/updateDatas',
        payload: {
          processEditDatas: newProcessEditDatas
        }
      })
    }
  }

  handleSpreadArrow = e => {
    e && e.stopPropagation()
    this.setState({
      is_show_spread_arrow: !this.state.is_show_spread_arrow
    })
  }

  // 设置表单是否可以提交
  setCompleteButtonDisabled = () => {
    const { itemValue, itemKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[itemKey]
    let valiResult = true
    for (let i = 0; i < forms.length; i++) {
      if (forms[i]['is_required'] == '1') {
        //必填的情况下
        const verification_rule = forms[i]['verification_rule']
        const value = forms[i]['value']
        const files = forms[i]['files']
        const field_type = forms[i]['field_type']
        const limit_file_num = forms[i]['limit_file_num']
        const limit_file_size = forms[i]['limit_file_size']
        const val_min_length = forms[i]['val_min_length']
        const val_max_length = forms[i]['val_max_length']
        // console.log(files,'sssssssssssssssssssssssssssssssssssss_files')
        // console.log(i, verification_rule, validateTel(''))
        switch (verification_rule) {
          case '':
            if (value) {
              if (val_min_length && val_max_length) {
                // 表示限制了最小长度以及最大长度
                if (
                  value.length >= val_min_length &&
                  value.length <= val_max_length
                ) {
                  valiResult = true
                } else {
                  valiResult = false
                }
              } else if (val_min_length && !val_max_length) {
                // 表示只限制了最小长度
                if (value.length >= val_min_length) {
                  valiResult = true
                } else {
                  valiResult = false
                }
              } else if (val_max_length && !val_min_length) {
                // 表示只限制了最大长度
                if (value.length <= val_max_length) {
                  valiResult = true
                } else {
                  valiResult = false
                }
              } else if (!val_min_length && !val_max_length) {
                // 表示什么都没有限制的时候
                valiResult = true
              }
            } else if (!value) {
              valiResult = false
            }
            break
          case 'mobile':
            valiResult = validateTel(value)
            break
          case 'tel':
            valiResult = validateFixedTel(value)
            break
          case 'ID_card':
            valiResult = validateIdCard(value)
            break
          case 'chinese_name':
            valiResult = validateChineseName(value)
            break
          case 'url':
            valiResult = validateWebsite(value)
            break
          case 'qq':
            valiResult = validateQQ(value)
            break
          case 'postal_code':
            valiResult = validatePostalCode(value)
            break
          case 'positive_integer':
            valiResult = validatePositiveInt(value)
            break
          case 'negative':
            valiResult = validateNegative(value)
            break
          case 'two_decimal_places':
            valiResult = validateTwoDecimal(value)
            break
          default:
            // if (!!value) {
            //   valiResult = true
            // } else {
            //   valiResult = false
            // }
            if (field_type == '5') {
              if (
                !!(files && files.length) ||
                (limit_file_num != 0 &&
                  files &&
                  files.length != '0' &&
                  files.length < limit_file_num)
              ) {
                valiResult = true
              } else {
                valiResult = false
              }
            } else {
              if (!!value) {
                valiResult = true
              } else {
                valiResult = false
              }
            }
            break
        }
        if (!valiResult) {
          break
        }
      } else {
        const verification_rule = forms[i]['verification_rule']
        const value = forms[i]['value']
        const files = forms[i]['files']
        const field_type = forms[i]['field_type']
        const limit_file_num = forms[i]['limit_file_num']
        const limit_file_size = forms[i]['limit_file_size']
        const val_min_length = forms[i]['val_min_length']
        const val_max_length = forms[i]['val_max_length']
        // console.log(files,'sssssssssssssssssssssssssssssssssssss_files')
        // console.log(i, verification_rule, validateTel(''))
        if (value) {
          switch (verification_rule) {
            case '':
              if (value) {
                if (val_min_length && val_max_length) {
                  // 表示限制了最小长度以及最大长度
                  if (value.length < val_min_length) {
                    valiResult = false
                  } else if (value.length > val_max_length) {
                    valiResult = false
                  } else {
                    valiResult = true
                  }
                } else if (val_min_length && !val_max_length) {
                  // 表示只限制了最小长度
                  if (value.length > val_min_length) {
                    valiResult = false
                  } else {
                    valiResult = true
                  }
                } else if (val_max_length && !val_min_length) {
                  // 表示只限制了最大长度
                  if (value.length > val_max_length) {
                    valiResult = false
                  } else {
                    valiResult = true
                  }
                } else if (!val_min_length && !val_max_length) {
                  // 表示什么都没有限制的时候
                  valiResult = true
                }
              } else if (!value) {
                valiResult = true
              }
              break
            case 'mobile':
              valiResult = validateTel(value)
              break
            case 'tel':
              valiResult = validateFixedTel(value)
              break
            case 'ID_card':
              valiResult = validateIdCard(value)
              break
            case 'chinese_name':
              valiResult = validateChineseName(value)
              break
            case 'url':
              valiResult = validateWebsite(value)
              break
            case 'qq':
              valiResult = validateQQ(value)
              break
            case 'postal_code':
              valiResult = validatePostalCode(value)
              break
            case 'positive_integer':
              valiResult = validatePositiveInt(value)
              break
            case 'negative':
              valiResult = validateNegative(value)
              break
            case 'two_decimal_places':
              valiResult = validateTwoDecimal(value)
              break
            default:
              // if (!!value) {
              //   valiResult = true
              // } else {
              //   valiResult = false
              // }
              if (field_type == '5') {
                if (
                  !!(files && files.length) ||
                  (limit_file_num != 0 &&
                    files &&
                    files.length != '0' &&
                    files.length < limit_file_num)
                ) {
                  valiResult = true
                } else {
                  valiResult = false
                }
              } else {
                if (!!value) {
                  // 表示不存在的时候
                  valiResult = true
                }
              }
              break
          }
          if (!valiResult) {
            break
          }
        } else {
          valiResult = true
        }
      }
    }
    return valiResult
  }

  // 获取当前节点中表单数据(所有表单数据)
  getAllNodesFormsData = () => {
    const { itemValue, itemKey, processEditDatas = [] } = this.props
    const { forms = [] } = processEditDatas[itemKey]
    let newFormsData = [...forms]
    let form_values = []
    newFormsData.map(item => {
      let field_type = item.field_type
      let files = item.files && item.files.length && item.files
      let obj = {
        field_id: item.id || '',
        field_value: field_type == '5' ? '' : item.value || ''
      }
      form_values.push(obj)
    })
    return form_values
  }

  // 保存表格数据
  saveSheetData = id => {
    let { sheetListData = [] } = this.state
    // if(!id) return ;
    let keys = Object.keys(sheetListData)
    if (keys.length) {
      let promise = keys.map(item => {
        if (!item) return void 0
        let data = sheetListData[item] || []
        return new Promise(resolve => {
          saveOnlineExcelWithProcess({ excel_id: item, sheet_data: data }).then(
            res => {
              if (isApiResponseOk(res)) {
                resolve(res.data)
              }
            }
          )
        })
      })
      promise = promise.filter(n => n)
      Promise.all(promise).then(resp => {
        // console.info(resp);
      })
    }
  }

  // 更新表格列表数据
  updateSheetList = ({ id, sheetData }) => {
    if (!id) return
    let obj = { ...this.state.sheetListData }
    obj[id] = sheetData
    this.setState(
      {
        sheetListData: obj
      },
      () => {
        this.saveSheetData()
      }
    )
  }

  // 编辑点击事件
  handleEnterConfigureProcess = e => {
    e && e.stopPropagation()
    // if (!this.whetherIsHasPermission()) {
    //   message.warn(NOT_HAS_PERMISION_COMFIRN, MESSAGE_DURATION_TIME)
    //   return
    // }
    this.setState({
      isAccomplishNodesIng: true // 表示正在完成中
    })
    if (this.state.isAccomplishNodesIng) {
      // message.warn('正在完成中...')
      return
    }

    // this.updateCorrespondingPrcodessStepWithNodeContent('is_edit', '0')
    const {
      processInfo: { id: flow_instance_id, board_id },
      itemValue,
      dispatch,
      request_flows_params = {},
      processEditDatas = [],
      itemKey,
      currentFlowListType
    } = this.props
    const { id: flow_node_instance_id, forms = [] } = itemValue
    let form_values = this.getAllNodesFormsData()
    let that = this
    let BOARD_ID =
      (request_flows_params && request_flows_params.request_board_id) ||
      board_id
    dispatch({
      type: 'publicProcessDetailModal/fillFormComplete',
      payload: {
        flow_instance_id,
        flow_node_instance_id,
        content_values: form_values,
        calback: () => {
          dispatch({
            type: 'publicProcessDetailModal/getProcessListByType',
            payload: {
              board_id: BOARD_ID,
              // status: '1',
              type: currentFlowListType,
              _organization_id: request_flows_params._organization_id
            }
          })
          this.props.handleProcessDetailChange &&
            this.props.handleProcessDetailChange({
              flow_instance_id
            })
          setTimeout(() => {
            that.setState({
              isAccomplishNodesIng: false
            })
          }, 500)
        }
      }
    })
  }

  /**
   * 判断是否有权限
   * @returns {Boolean} true 表示有权限 false 表示没有权限
   */
  whetherIsHasPermission = () => {
    const { processInfo = {} } = this.props
    const { privileges = [], is_privilege, board_id, nodes = [] } = processInfo
    const principalList = genPrincipalListFromAssignees(nodes)
    let flag = false
    if (
      checkIsHasPermissionInVisitControl(
        'edit',
        privileges,
        is_privilege,
        principalList,
        checkIsHasPermissionInBoard(PROJECT_FLOW_FLOW_ACCESS, board_id)
      )
    ) {
      flag = true
    }
    return flag
  }

  // 判断表单是否能编辑

  FormCanEdit = () => {
    //表单是否可编辑
    let noCando = true
    const { itemValue } = this.props
    const { status } = itemValue
    if (status != '1') {
      noCando = false
    }
    return noCando
  }

  // 理解成是否是有效的头像
  isValidAvatar = (avatarUrl = '') =>
    avatarUrl.includes('http://') || avatarUrl.includes('https://')

  filterForm = (value, key) => {
    const { field_type } = value
    const { itemKey } = this.props
    let container = <div></div>
    switch (field_type) {
      case '1':
        container = (
          // eslint-disable-next-line react/jsx-pascal-case
          <BeginningStepOne_one
            parentKey={itemKey}
            FormCanEdit={this.FormCanEdit()}
            updateCorrespondingPrcodessStepWithNodeContent={
              this.updateCorrespondingPrcodessStepWithNodeContent
            }
            itemKey={key}
            itemValue={value}
          />
        )
        break
      case '2':
        container = (
          // eslint-disable-next-line react/jsx-pascal-case
          <BeginningStepOne_two
            parentKey={itemKey}
            FormCanEdit={this.FormCanEdit()}
            updateCorrespondingPrcodessStepWithNodeContent={
              this.updateCorrespondingPrcodessStepWithNodeContent
            }
            itemKey={key}
            itemValue={value}
          />
        )
        break
      case '3':
        container = (
          // eslint-disable-next-line react/jsx-pascal-case
          <BeginningStepOne_three
            parentKey={itemKey}
            FormCanEdit={this.FormCanEdit()}
            updateCorrespondingPrcodessStepWithNodeContent={
              this.updateCorrespondingPrcodessStepWithNodeContent
            }
            itemKey={key}
            itemValue={value}
          />
        )
        break
      case '5':
        container = (
          // eslint-disable-next-line react/jsx-pascal-case
          <BeginningStepOne_five
            updateState={this.updateState}
            parentKey={itemKey}
            FormCanEdit={this.FormCanEdit()}
            updateCorrespondingPrcodessStepWithNodeContent={
              this.updateCorrespondingPrcodessStepWithNodeContent
            }
            itemKey={key}
            itemValue={value}
          />
        )
        break
      case '6':
        container = (
          // eslint-disable-next-line react/jsx-pascal-case
          <BeginningStepOne_six
            updateSheetList={this.updateSheetList}
            updateState={this.updateState}
            parentKey={itemKey}
            FormCanEdit={this.FormCanEdit()}
            updateCorrespondingPrcodessStepWithNodeContent={
              this.updateCorrespondingPrcodessStepWithNodeContent
            }
            itemKey={key}
            itemValue={value}
          />
        )
        break
      default:
        break
    }
    return container
  }

  // 渲染不同状态时步骤的样式
  renderDiffStatusStepStyles = () => {
    const {
      itemValue = {},
      processInfo: { status: parentStatus }
    } = this.props
    const { status } = itemValue
    let stylLine, stylCircle
    if (parentStatus == '2') {
      // 表示已中止
      if (status == '1') {
        // 进行中
        stylLine = indexStyles.hasnotCompetedLine
        stylCircle = indexStyles.hasnotCompetedCircle
      } else {
        stylLine = indexStyles.stopLine
        stylCircle = indexStyles.stopCircle
      }
    } else if (parentStatus == '0') {
      // 表示未开始
      stylLine = indexStyles.stopLine
      stylCircle = indexStyles.stopCircle
    } else {
      if (status == '0') {
        // 未开始
        stylLine = indexStyles.hasnotCompetedLine
        stylCircle = indexStyles.hasnotCompetedCircle
      } else if (status == '1') {
        // 进行中
        stylLine = indexStyles.doingLine
        stylCircle = indexStyles.doingCircle
      } else if (status == '2') {
        // 已完成
        stylLine = indexStyles.line
        stylCircle = indexStyles.circle
      } else {
        stylLine = indexStyles.doingLine
        stylCircle = indexStyles.doingCircle
      }
    }

    return { stylCircle, stylLine }
  }

  // 渲染编辑详情的内容
  renderEditDetailContent = () => {
    const {
      itemValue,
      itemKey,
      processInfo: { status: parentStatus },
      processEditDatas = []
    } = this.props
    const { forms = [], description, deadline_value, status } = itemValue
    let flag = findCurrentFileInfo(processEditDatas[itemKey]['forms'])
    return (
      <div style={{ position: 'relative' }}>
        {/* 有一个蒙层表示不是该填写人不能操作 */}
        {(parentStatus != '1' ||
          !this.whetherShowCompleteButton() ||
          status != '1' ||
          this.state.isAccomplishNodesIng) && (
          <div className={indexStyles.nonOperatorPerson}></div>
        )}
        {/* 备注 */}
        {description && description != '' && (
          <div className={indexStyles.select_remarks}>
            <span className={globalStyles.authTheme}>&#xe636; 备注 :</span>
            <div>{description}</div>
          </div>
        )}
        {/* 表单内容 */}
        {forms && forms.length ? (
          <div
            style={{
              padding: '16px 0 8px 0',
              marginTop: '16px',
              borderTop: '1px solid #e8e8e8',
              paddingBottom: '0px'
            }}
          >
            {forms.map((item, key) => {
              return this.filterForm(item, key)
            })}
          </div>
        ) : (
          <></>
        )}
        {/* 编辑按钮 */}
        {parentStatus == '1' &&
          this.whetherShowCompleteButton() &&
          status == '1' && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '24px',
                borderTop: '1px solid #e8e8e8',
                textAlign: 'center'
              }}
            >
              <Button
                type="primary"
                disabled={
                  !this.setCompleteButtonDisabled() ||
                  this.state.isAccomplishNodesIng ||
                  flag
                }
                onClick={this.handleEnterConfigureProcess}
              >
                完成
              </Button>
            </div>
          )}
      </div>
    )
  }

  /**
   * 更新流程详情
   */
  updateProcessInfo = async () => {
    const { dispatch, processInfo } = this.props
    await dispatch({
      type: this.process_action_key + '/' + this.action_valuekey,
      payload: {
        id: processInfo.id
      }
    })
    // this.updateUrgeBtn()
  }

  confirmToUrge = () => {
    const {
      itemValue,
      currentFlowListType,
      request_flows_params = {},
      processInfo: { board_id }
    } = this.props
    let BOARD_ID =
      (request_flows_params && request_flows_params.request_board_id) ||
      board_id
    Modal.confirm({
      // style: {

      // },
      // getContainer: () =>
      //   document.getElementById('container_fileDetailContentOut'),
      zIndex: 1011,
      title: '提示',
      content: '确定催办此节点吗？节点中的负责人将会收到通知',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        UrgeStart({ flow_node_instance_id: itemValue.id })
          .then(res => {
            // console.log(res)
            if (isApiResponseOk(res)) {
              this.updateUrgeBtn()
              notification.success({
                message: '提示',
                description: res.message
              })
              this.updateProcessInfo()
              this.props.dispatch({
                type: 'publicProcessDetailModal/getProcessListByType',
                payload: {
                  board_id: BOARD_ID,
                  // status: currentFlowTabsStatus || '1',
                  type: currentFlowListType || 'process',
                  _organization_id:
                    request_flows_params._organization_id ||
                    localStorage.getItem('OrganizationId')
                }
              })
            } else {
              notification.warn({
                message: '警告',
                description: res.message
              })
            }
            return res
          })
          .catch(console.log)
      }
    })
  }

  render() {
    const {
      itemKey,
      processEditDatas = [],
      itemValue = {},
      projectDetailInfoData: { data = [], board_id },
      currentOrgAllMembers = [],
      processInfo: { status: parentStatus, enable_change }
    } = this.props
    const {
      status,
      name,
      assignee_type,
      cc_type,
      deadline_value,
      deadline_time_type,
      deadline_type,
      forms = [],
      runtime_type,
      assignees,
      cc_locking,
      recipients,
      role_users = []
    } = itemValue
    const {
      transPrincipalList = [],
      transCopyPersonnelList = [],
      is_show_spread_arrow,
      updateShowUrgeBtn,
      updateShowUrgeText
    } = this.state
    let roles_data = getCurrentDesignatedRolesMembers(
      currentOrgAllMembers,
      role_users
    )
    let new_data = assignee_type == '3' ? [...roles_data] : [...data]
    let new_itemValue = { ...itemValue }
    new_itemValue.assignees = transAssigneesToIds(assignees).join(',')
    if (cc_type == '1') {
      new_itemValue.recipients = transAssigneesToIds(recipients).join(',')
    }
    return (
      <div
        id={status == '1' && 'currentDataCollectionItem'}
        key={itemKey}
        style={{ display: 'flex', marginBottom: '46px' }}
      >
        {processEditDatas.length <= itemKey + 1 ? null : (
          <div className={this.renderDiffStatusStepStyles().stylLine}></div>
        )}
        {/* <div className={indexStyles.doingLine}></div> */}
        <div className={this.renderDiffStatusStepStyles().stylCircle}>
          {' '}
          {itemKey + 1}
        </div>
        <div
          className={`${
            status == '1'
              ? indexStyles.popover_card
              : indexStyles.default_popover_card
          }`}
        >
          <div className={`${globalStyles.global_vertical_scrollbar}`}>
            {/* 上 */}
            <div style={{ marginBottom: '16px' }}>
              <div className={`${indexStyles.node_name}`}>
                <div>
                  <span
                    className={`${globalStyles.authTheme} ${indexStyles.stepTypeIcon}`}
                  >
                    &#xe7b1;
                  </span>
                  <span>{name}</span>
                  {updateShowUrgeText && (
                    <Fragment>
                      <span className="urging_text_red">
                        <span className={globalStyles.authTheme}>&#xe84c;</span>
                        <span style={{ marginLeft: 5 }}>催办</span>
                      </span>
                    </Fragment>
                  )}
                  {runtime_type == '1' && (
                    <span
                      style={{
                        color: '#FF5D60',
                        fontSize: '16px',
                        marginLeft: '8px',
                        letterSpacing: '2px'
                      }}
                    >
                      {'(驳回)'}
                    </span>
                  )}
                </div>
                <div>
                  <span
                    onClick={this.handleSpreadArrow}
                    className={`${indexStyles.spreadIcon}`}
                  >
                    {!is_show_spread_arrow ? (
                      <span
                        className={`${globalStyles.authTheme} ${indexStyles.spread_arrow}`}
                      >
                        &#xe7ee;
                      </span>
                    ) : (
                      <span
                        className={`${globalStyles.authTheme} ${indexStyles.spread_arrow}`}
                      >
                        &#xe7ed;
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
            {/* 下 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* 填写人 */}
                <div
                  style={{ display: 'inline-block' }}
                  className={indexStyles.content__principalList_icon}
                >
                  {!(transPrincipalList && transPrincipalList.length) ? (
                    ''
                  ) : (
                    <>
                      <AvatarList
                        size="small"
                        maxLength={10}
                        excessItemsStyle={{
                          color: '#f56a00',
                          backgroundColor: '#fde3cf'
                        }}
                      >
                        {transPrincipalList &&
                          transPrincipalList.length &&
                          transPrincipalList.map(({ name, avatar }, index) => (
                            <AvatarList.Item
                              key={index}
                              tips={name || '佚名'}
                              src={
                                this.isValidAvatar(avatar)
                                  ? avatar
                                  : defaultUserAvatar
                              }
                            />
                          ))}
                      </AvatarList>
                      <span className={indexStyles.content__principalList_info}>
                        {`${transPrincipalList.length}位填写人`}
                      </span>
                      {updateShowUrgeBtn && (
                        <Button
                          type="primary"
                          style={{ marginLeft: 15 }}
                          onClick={this.confirmToUrge}
                        >
                          <span className={globalStyles.authTheme}>
                            &#xe84c;
                          </span>
                          <span style={{ marginLeft: 5 }}>催办</span>
                        </Button>
                      )}
                    </>
                  )}
                  {parentStatus == '0' &&
                    (enable_change == '1' || assignee_type == '3') && (
                      <span
                        style={{
                          position: 'relative',
                          verticalAlign: 'middle'
                        }}
                      >
                        <AmendComponent
                          type="1"
                          updateParentsAssigneesOrCopyPersonnel={
                            this.updateParentsAssigneesOrCopyPersonnel
                          }
                          updateCorrespondingPrcodessStepWithNodeContent={
                            this.updateCorrespondingPrcodessStepWithNodeContent
                          }
                          placementTitle="填写人"
                          data={new_data}
                          itemKey={itemKey}
                          itemValue={new_itemValue}
                          board_id={board_id}
                          NotModifiedInitiator={true}
                          currentOrgAllMembers={currentOrgAllMembers}
                        />
                      </span>
                    )}
                </div>
                {/* 抄送人 */}
                {cc_type == '1' && (
                  <div
                    style={{ marginLeft: '8px', display: 'inline-block' }}
                    className={indexStyles.content__principalList_icon}
                  >
                    {!(
                      transCopyPersonnelList && transCopyPersonnelList.length
                    ) ? (
                      ''
                    ) : (
                      <>
                        <AvatarList
                          size="small"
                          maxLength={10}
                          excessItemsStyle={{
                            color: '#f56a00',
                            backgroundColor: '#fde3cf'
                          }}
                        >
                          {transCopyPersonnelList &&
                            transCopyPersonnelList.length &&
                            transCopyPersonnelList.map(
                              ({ name, avatar }, index) => (
                                <AvatarList.Item
                                  key={index}
                                  tips={name || '佚名'}
                                  src={
                                    this.isValidAvatar(avatar)
                                      ? avatar
                                      : defaultUserAvatar
                                  }
                                />
                              )
                            )}
                        </AvatarList>
                        <span
                          className={indexStyles.content__principalList_info}
                        >
                          {`${transCopyPersonnelList.length}位抄送人`}
                        </span>
                      </>
                    )}
                    {parentStatus == '0' &&
                      (cc_locking == '0' ? (
                        <>
                          {enable_change == '1' && (
                            <span
                              style={{
                                position: 'relative',
                                verticalAlign: 'middle'
                              }}
                            >
                              <AmendComponent
                                type="3"
                                updateParentsAssigneesOrCopyPersonnel={
                                  this.updateParentsAssigneesOrCopyPersonnel
                                }
                                updateCorrespondingPrcodessStepWithNodeContent={
                                  this
                                    .updateCorrespondingPrcodessStepWithNodeContent
                                }
                                placementTitle="抄送人"
                                data={data}
                                itemKey={itemKey}
                                itemValue={new_itemValue}
                                board_id={board_id}
                              />
                            </span>
                          )}
                        </>
                      ) : (
                        <Tooltip
                          title="已锁定抄送人"
                          placement="top"
                          getPopupContainer={triggerNode =>
                            triggerNode.parentNode
                          }
                        >
                          <span
                            style={{
                              cursor: 'pointer',
                              color: 'rgba(0,0,0,0.25)',
                              marginLeft: '4px'
                            }}
                            className={globalStyles.authTheme}
                          >
                            &#xe86a;
                          </span>
                        </Tooltip>
                      ))}
                  </div>
                )}
              </div>
              <div style={{ marginRight: '14px' }}>
                <DifferenceDeadlineType
                  type="nodesStepItem"
                  itemValue={itemValue}
                />
              </div>
            </div>
            {is_show_spread_arrow && this.renderEditDetailContent()}
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps({
  publicProcessDetailModal: {
    processEditDatas = [],
    processInfo = {},
    currentOrgAllMembers = [],
    currentFlowListType
  },
  technological: {
    datas: { userBoardPermissions = [] }
  },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  }
}) {
  return {
    processEditDatas,
    processInfo,
    userBoardPermissions,
    projectDetailInfoData,
    currentOrgAllMembers,
    currentFlowListType
  }
}
