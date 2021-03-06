import React from 'react'
import indexStyles from './index.less'
import NameChangeInput from '../../../../../../components/NameChangeInput'
import {
  Dropdown,
  Progress,
  Avatar,
  DatePicker,
  Button,
  message,
  InputNumber,
  Popover,
  Tree
} from 'antd'
import MeusearMutiple from '../../../Workbench/CardContent/Modal/TaskItemComponent/components/MeusearMutiple'
import ExcutorList from '../../../Workbench/CardContent/Modal/TaskItemComponent/components/ExcutorList'
import BraftEditor from 'braft-editor'
import Cookies from 'js-cookie'
import CommonRelaItem from './components/CommonRelaItem'
import globalStyle from '../../../../../../globalset/css/globalClassName.less'
import {
  timestampToTimeNormal,
  timeToTimestamp,
  compareTwoTimestamp,
  caldiffDays,
  getRelativeTimeTamp
} from '../../../../../../utils/util'
import {
  REQUEST_DOMAIN_FILE,
  TASKS
} from '../../../../../../globalset/js/constant'
import { connect } from 'dva'
import MenuSearchPartner from '@/components/MenuSearchMultiple/MenuSearchPartner.js'
import { currentNounPlanFilterName } from '../../../../../../utils/businessFunction'
import { isApiResponseOk } from '../../../../../../utils/handleResponseData'
import moment from 'moment'
import CustomCategoriesOperate from '../../../../../../components/CustomFields/CustomCategoriesOperate'
import {
  createRelationCustomField,
  getCustomFieldList
} from '../../../../../../services/organization'
import { SourceType } from './constans'
import CompleteCheckStatus from 'src/components/CompleteCheckStatus'
const getEffectOrReducerByName = name => `milestoneDetail/${name}`
@connect(mapStateToProps)
export default class MainContent extends React.Component {
  state = {
    excutors_out_left_width: 0,
    isInEditBraftEditor: false,
    selected_excutors: [],
    /** 获取的自定义字段列表 */
    fieldsData: [],
    /** 选中的自定义字段列表 */
    selected_fields: [],
    /** 自定义字段的显示隐藏 */
    fields_visible: false,
    /** 默认勾选的列表 */
    disabledKeys: [],
    completeStatus: '' //完成状态
  }

  constructor(prop) {
    super(prop)
    this.excutors_out_left_ref = React.createRef()
  }

  componentWillReceiveProps(nextProps) {
    const { milestone_detail = {} } = nextProps
    const { remarks } = milestone_detail
    this.setState({
      description: remarks,
      brafitEditHtml: remarks
    })
  }
  componentDidUpdate(prev) {
    if (prev.milestone_detail?.id !== this.props.milestone_detail?.id) {
      this.fetchCustomFields()
      this.setStatusProperty()
    }
  }

  // 父组件相对对应该里程碑变化的操作
  handleMiletonesChange = (data = {}) => {
    const { handleMiletonesChange, milestone_detail = {} } = this.props
    const { id } = milestone_detail

    if (typeof handleMiletonesChange == 'function')
      handleMiletonesChange(id, { ...data })
  }

  //更新详情
  updateMilestone = params => {
    const { dispatch, milestone_detail = {} } = this.props
    const { id } = milestone_detail
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'milestoneDetail/updateMilestone',
        payload: {
          ...params,
          id
        }
      }).then(res => {
        if (res) {
          resolve(res)
        } else {
          reject()
        }
      })
    })
  }

  //标题
  titleChangeBlur(e) {
    const value = e.target.value
    if (value.trimLR() == '') return
    this.updateMilestone({ name: value }).then(res => {
      this.handleMiletonesChange({ name: value })
    })
  }
  setTitleIsEdit = titleIsEdit => {
    this.setState({
      titleIsEdit: titleIsEdit
    })
  }

  inviteOthersToBoardCalback = ({ users }) => {
    //邀请外部人员加入回调
    const { dispatch, milestone_detail = {} } = this.props
    const { board_id, principals } = milestone_detail
    const new_milestone_detail = JSON.parse(JSON.stringify(milestone_detail))
    const calback = res => {
      //将原始的负责人和新的执行人合并
      let add_executors = users.map(item =>
        res.data.find(item2 => item2.user_id == item)
      ) //新添加的执行人通过新的项目成员遍历信息
      add_executors = add_executors.filter(item => item.user_id)
      new_milestone_detail.principals = [].concat(principals, add_executors)
      dispatch({
        type: 'milestoneDetail/updateDatas',
        payload: {
          milestone_detail: new_milestone_detail
        }
      })
    }
    dispatch({
      type: 'projectDetail/projectDetailInfo',
      payload: {
        id: board_id,
        calback
      }
    })
  }
  chirldrenTaskChargeChange = data => {
    const { key, type } = data
    const {
      dispatch,
      milestone_detail = {},
      projectDetailInfoData: { data: dataInfo = [] }
    } = this.props
    const { id, principals = [] } = milestone_detail
    let new_principals = [...principals]
    let gold_item = dataInfo.find(o => o.user_id == key) || {}
    if (type == 'add') {
      dispatch({
        type: 'milestoneDetail/addMilestoneExcutos',
        payload: {
          id,
          user_id: key
        }
      }).then(res => {
        if (isApiResponseOk(res)) {
          new_principals.push(gold_item)
          this.handleMiletonesChange({ principals: new_principals })
        }
      })
    } else if (type == 'remove') {
      dispatch({
        type: 'milestoneDetail/removeMilestoneExcutos',
        payload: {
          id,
          user_id: key
        }
      }).then(res => {
        if (isApiResponseOk(res)) {
          new_principals = new_principals.filter(n => n.user_id != key)
          this.handleMiletonesChange({ principals: new_principals })
        }
      })
    } else {
    }

    //用于判判断任务执行人菜单是否显示
    const that = this
    setTimeout(function() {
      const { excutorsOut_left = {} } = that.refs
      const excutors_out_left_width = excutorsOut_left.clientWidth
      that.setState({
        excutors_out_left_width
      })
    }, 1000)
  }

  //截止时间
  endDatePickerChange(e, timeString) {
    const due_timeStamp = timeToTimestamp(timeString)
    // 和关联任务的时间限制---
    const { milestone_detail = {} } = this.props
    const { content_list = [] } = milestone_detail
    let flag = true
    for (let val of content_list) {
      if (!compareTwoTimestamp(due_timeStamp, Number(val.deadline))) {
        flag = false
        break
      }
    }
    if (!flag) {
      message.warn('关联里程碑的截止日期不能小于任务的截止日期')
      return
    }

    // 和关联任务的时间限制---

    this.updateMilestone({ deadline: due_timeStamp }).then(res => {
      // 父组件的操作
      this.handleMiletonesChange({ deadline: due_timeStamp })
    })
  }
  disabledDueTime = deadline => {
    const now_time = new Date().getTime()
    const newStartTime =
      now_time.toString().length > 10
        ? Number(now_time).valueOf() / 1000
        : Number(now_time).valueOf()
    return Number(deadline.valueOf()) / 1000 < newStartTime
  }

  //有关于富文本编辑---------------start
  editWrapClick = e => {
    e.stopPropagation()
  }
  goEditBrafit = () => {
    // e.stopPropagation();
    // if(e.target.nodeName.toUpperCase() === 'IMG') {
    //   const src = e.target.getAttribute('src')
    // }
    this.setState({
      isInEditBraftEditor: true
    })
  }
  quitBrafitEdit = e => {
    e.stopPropagation()
    const { description = '' } = this.props
    this.setState({
      isInEditBraftEditor: false
      // brafitEditHtml: description,
    })
  }
  saveBrafitEdit = e => {
    e.stopPropagation()
    let { brafitEditHtml } = this.state
    if (typeof brafitEditHtml === 'object') {
      brafitEditHtml = brafitEditHtml.toHTML()
    }
    this.setState({
      isInEditBraftEditor: false
    })
    this.setState({
      description: brafitEditHtml
    })
    this.updateMilestone({ remarks: brafitEditHtml })
  }
  isJSON = str => {
    if (typeof str === 'string') {
      try {
        var obj = JSON.parse(str)
        if (str.indexOf('{') > -1) {
          return true
        } else {
          return false
        }
      } catch (e) {
        return false
      }
    }
    return false
  }
  myUploadFn = param => {
    const serverURL = `${REQUEST_DOMAIN_FILE}/upload`
    const xhr = new XMLHttpRequest()
    const fd = new FormData()

    const successFn = response => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      if (xhr.status === 200 && this.isJSON(xhr.responseText)) {
        if (JSON.parse(xhr.responseText).code === '0') {
          param.success({
            url: JSON.parse(xhr.responseText).data
              ? JSON.parse(xhr.responseText).data.url
              : '',
            meta: {
              // id: 'xxx',
              // title: 'xxx',
              // alt: 'xxx',
              loop: false, // 指定音视频是否循环播放
              autoPlay: false, // 指定音视频是否自动播放
              controls: true // 指定音视频是否显示控制栏
              // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
            }
          })
        } else {
          errorFn()
        }
      } else {
        errorFn()
      }
    }

    const progressFn = event => {
      // 上传进度发生变化时调用param.progress
      param.progress((event.loaded / event.total) * 100)
    }

    const errorFn = response => {
      // 上传发生错误时调用param.error
      param.error({
        msg: '图片上传失败!'
      })
    }

    xhr.upload.addEventListener('progress', progressFn, false)
    xhr.addEventListener('load', successFn, false)
    xhr.addEventListener('error', errorFn, false)
    xhr.addEventListener('abort', errorFn, false)

    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.setRequestHeader('Authorization', Cookies.get('Authorization'))
    xhr.setRequestHeader('refreshToken', Cookies.get('refreshToken'))
    xhr.send(fd)
  }
  descriptionHTML(e) {
    if (e.target.nodeName.toUpperCase() === 'IMG') {
      const src = e.target.getAttribute('src')
      this.setState({
        previewFileType: 'img',
        previewFileSrc: src
      })
    } else if (e.target.nodeName.toUpperCase() === 'VIDEO') {
      const src = e.target.getAttribute('src')
      this.setState({
        previewFileType: 'video',
        previewFileSrc: src
      })
    }
  }
  //有关于富文本编辑---------------end

  // 渲染关联内容头部、
  renderRelaTitleContent = type => {
    const { milestone_detail = {} } = this.props
    const {
      content_list = [],
      chird_list = [],
      milestone_completed_count,
      content_completed_count
    } = milestone_detail
    let title_name = ''
    let complete_num = '0'
    let total_num = '0'
    if (type == '0') {
      title_name = `${currentNounPlanFilterName(TASKS)}`
      complete_num = content_completed_count || '0'
      total_num = content_list.length
    } else if (type == '4') {
      title_name = '里程碑'
      complete_num = milestone_completed_count || '0'
      total_num = chird_list.length
    }

    return (
      <span>
        关联{title_name} · {complete_num || '0'}/{total_num || '0'}
      </span>
    )
  }

  // 渲染关联内容
  renderRelaContent = ({ content_list = [], type }) => {
    const {
      milestone_detail = {},
      projectDetailInfoData: { board_set = {} },
      base_relative_time
    } = this.props
    return (
      <>
        <div className={indexStyles.contain2_item}>
          <div
            className={indexStyles.contain2_item_left}
            style={{ width: 200 }}
          >
            <span className={globalStyle.authTheme}>&#xe7f5;</span>
            {this.renderRelaTitleContent(type)}
          </div>
          <div className={`${indexStyles.contain2_item_right}`}></div>
        </div>
        <div className={`${indexStyles.contain3}`}>
          <div
            className={`${indexStyles.contain3_inner} ${globalStyle.global_vertical_scrollbar}`}
          >
            {content_list.map((value, key) => {
              const { name, id } = value
              return (
                <CommonRelaItem
                  type={type}
                  itemValue={value}
                  key={id}
                  milestone_id={milestone_detail['id']}
                  board_set={board_set}
                  base_relative_time={base_relative_time}
                  deleteRelationContent={this.props.deleteRelationContent}
                  setStatusProperty={this.setStatusProperty}
                />
              )
            })}
          </div>
        </div>
      </>
    )
  }

  handleDueRelativeChange = value => {
    if (!isNaN(value)) {
      const {
        projectDetailInfoData: { board_set = {} },
        base_relative_time: relative_time
      } = this.props
      // const { relative_time } = board_set
      const due_timeStamp =
        value === 0
          ? relative_time
          : String(value).trimLR() == ''
          ? '0'
          : getRelativeTimeTamp(value, relative_time)

      // 和关联任务的时间限制---

      this.updateMilestone({ deadline: due_timeStamp }).then(res => {
        // 父组件的操作
        this.handleMiletonesChange({ deadline: due_timeStamp })
      })
    }
  }

  // 渲染截止时间
  renderDueTime = () => {
    const {
      projectDetailInfoData: { board_set = {} },
      milestone_detail = {},
      base_relative_time: relative_time
    } = this.props
    const { date_format, date_mode } = board_set
    const { deadline } = milestone_detail
    const day_value =
      deadline && deadline != '0'
        ? caldiffDays(relative_time, deadline)
        : (String(deadline).length == 10
          ? Number(deadline) * 1000
          : Number(deadline) == relative_time)
        ? 0
        : ''
    return (
      <>
        {date_mode == '1' ? (
          <>
            T + &nbsp;
            <InputNumber
              min={0}
              onChange={this.handleDueRelativeChange}
              value={day_value ? day_value : day_value === 0 ? 0 : ''}
              style={{ width: '68px' }}
            />
            &nbsp;日
          </>
        ) : (
          <>
            {deadline
              ? timestampToTimeNormal(
                  deadline,
                  '/',
                  date_format == '1' ? false : true
                )
              : '添加时间'}
            <DatePicker
              // disabledDate={this.disabledDueTime.bind(this)}
              placeholder={'截止时间'}
              format={date_format == '1' ? 'YYYY/MM/DD' : 'YYYY/MM/DD HH:mm'}
              showTime={
                date_format == '1'
                  ? null
                  : {
                      defaultValue: moment('17:59', 'HH:mm'),
                      format: 'HH:mm'
                    }
              }
              onChange={this.endDatePickerChange.bind(this)}
              style={{
                opacity: 0,
                width: !deadline ? 50 : 100,
                cursor: 'pointer',
                height: 20,
                background: '#000000',
                position: 'absolute',
                right: 0,
                zIndex: 1
              }}
            />
          </>
        )}
      </>
    )
  }

  /** 格式化自定义字段的树形结构
   * @param {{name: string, id:string, ?fields: any[]}[]} data 获取的字段元数据
   * @param {string[]} 禁用的自定义字段合集
   * @returns {{children: any[], title: string, key: string}[]}
   */
  forMatTreeNode = (data = [], disabled_ids = []) => {
    const arr = []
    data.forEach(item => {
      if (item.fields && item.fields.length) {
        item.fields = this.forMatTreeNode(item.fields, disabled_ids)
      }
      /** 子节点是否全部禁用了 */
      const parentDisabled =
        disabled_ids.includes(item.id) ||
        (item.fields &&
          item.fields.length &&
          item.fields.filter(child => !child.disableCheckbox).length === 0)

      const obj = {
        children: item.fields || null,
        title: <span title={item.name}>{item.name}</span>,
        key: item.id,
        disableCheckbox: parentDisabled,
        field_status: item.field_status
      }
      if (
        obj.field_status === '0' ||
        (obj.children || []).filter(item => item.field_status === '0').length
      )
        arr.push(obj)
    })
    return arr
  }

  /** 获取自定义字段 */
  fetchCustomFields = () => {
    getCustomFieldList().then(res => {
      const { milestone_detail = {} } = this.props
      const { fields = [] } = milestone_detail
      /** 已经存在详情的字段列表 */
      const disabledIds = fields.map(item => item.field_id)
      if (isApiResponseOk(res)) {
        this.setState(
          {
            fieldsData: this.forMatTreeNode(
              [
                ...(res.data.fields || []),
                ...(res.data.groups || []).filter(
                  item => item.fields && item.fields.length
                )
              ],
              disabledIds
            ),
            selected_fields: []
          },
          () => {
            this.setState({
              disabledKeys: this.getDisabledArray()
            })
          }
        )
      }
    })
  }

  /** 添加自定义字段请求 */
  handleAddFields = () => {
    const { selected_fields = [] } = this.state
    const { milestone_detail = {}, dispatch } = this.props
    const { id } = milestone_detail
    createRelationCustomField({
      relation_id: id,
      fields: selected_fields,
      source_type: SourceType.Milestone
    }).then(async res => {
      if (isApiResponseOk(res)) {
        await this.updateDetail()
        this.fetchCustomFields()
        /** 隐藏弹窗 */
        this.setState({
          fields_visible: false
        })
      } else message.warn(res.message)
    })
  }

  /** 获取禁用的列表 */
  getDisabledArray = () => {
    const { fieldsData = [] } = this.state
    /** 取到的禁用列表 */
    let arr = []
    fieldsData.forEach(item => {
      if (item.children) {
        arr = arr.concat(
          arr,
          item.children.filter(child => child.disableCheckbox)
        )
      }
      if (item.disableCheckbox) arr.push(item)
    })
    arr = arr.map(item => item.key)
    return arr
  }

  /** 重置选中的数据 */
  handleReset = () => {
    this.setState({
      selected_fields: [],
      disabledKeys: this.getDisabledArray()
    })
  }

  /** 选择了字段 */
  handleSelectField = keys => {
    this.setState({
      selected_fields: keys
    })
  }

  /** 渲染添加字段的弹窗内容 */
  PopoverContentRender = () => {
    return (
      <div className={indexStyles.treeable}>
        <div className={indexStyles.tree_fields}>
          <Tree
            checkedKeys={[
              ...this.state.selected_fields,
              ...this.state.disabledKeys
            ]}
            checkable
            treeData={this.state.fieldsData}
            onCheck={this.handleSelectField}
          />
        </div>
        <div className={indexStyles.confirmBtn}>
          <Button type="default" block onClick={this.handleReset}>
            重置
          </Button>
          <Button
            disabled={!this.state.selected_fields.length}
            type="primary"
            block
            onClick={this.handleAddFields}
          >
            确定
          </Button>
        </div>
      </div>
    )
  }

  /** 更新详情 */
  updateDetail = async () => {
    const { milestone_detail = {}, dispatch } = this.props
    const { id } = milestone_detail
    return await dispatch({
      type: 'milestoneDetail/getMilestoneDetail',
      payload: {
        id: id
      }
    })
  }
  setCompleted = () => {
    const {
      milestone_detail: { is_finished, content_list = [], deadline }
    } = this.props
    if (content_list.length) {
      message.warn('存在关联子节点，完成状态由子节点控制')
      return
    }
    const _is_finished = is_finished == '1' ? '0' : '1'
    this.updateMilestone({
      is_finished: _is_finished
    }).then(res => {
      this.handleMiletonesChange({ is_realize: _is_finished })
    })
  }
  // 设置状态属性
  setStatusProperty = () => {
    const {
      milestone_detail: {
        is_finished,
        content_list = [],
        finish_time,
        deadline,
        chird_list = []
      }
    } = this.props

    let completeStatus = ''
    const is_overdue = !!deadline
      ? Number(finish_time || 0) > Number(deadline || 0)
      : false //没有截止时间意味着随便什么时候完成都是没有超过
    const children = [].concat(content_list, chird_list)
    const isHasSubFinish = children.some(item => {
      //存在子任务处于完成
      return item.is_completed == '1'
    })
    const isHasNoFinish = children.some(item => {
      //存在子任务处于未完成
      return item.is_completed == '0'
    })
    const ishasChildCard = children.length
    if (ishasChildCard) {
      if ((!isHasNoFinish && is_finished === '0') || !isHasSubFinish) {
        completeStatus = '未到期'
      } else if (!isHasNoFinish) {
        completeStatus = '已完成'
        if (is_overdue && is_finished === '1') {
          completeStatus = '逾期完成'
        } else if (is_finished === '1' && !is_overdue) {
          completeStatus = '按时完成'
        }
      } else if (isHasSubFinish && isHasNoFinish) {
        completeStatus = '进行中'
      }
    } else {
      if (is_finished === '0') {
        completeStatus = '未到期'
      } else if (is_finished === '1') {
        if (is_overdue) {
          completeStatus = '逾期完成'
        } else {
          completeStatus = '按时完成'
        }
      }
    }
    this.setState({
      completeStatus
    })
  }
  render() {
    const {
      titleIsEdit,
      excutors_out_left_width = 0,
      isInEditBraftEditor,
      brafitEditHtml
    } = this.state
    let { description } = this.state
    description =
      !description || description == '<p></p>' ? '<p>添加备注</p>' : description
    const {
      // users = [],
      milestone_detail = {},
      projectDetailInfoData: { data: users = [], board_set = {} }
    } = this.props
    const { date_format } = board_set
    const {
      board_id,
      name,
      deadline,
      principals = [],
      id,
      content_list = [],
      fields = [],
      org_id,
      chird_list = [],
      progress_percent = '0',
      is_finished
    } = milestone_detail
    const result_process = Math.round(progress_percent * 100) / 100
    const executors = principals.filter(item => item)
    const new_users = users.map(item => {
      if (!item['user_id']) {
        item['user_id'] = item['id']
      }
      return item
    })

    const editorState = BraftEditor.createEditorState(brafitEditHtml)

    const editorProps = {
      contentStyle: { minHeight: 100, height: 'auto' },
      height: 100,
      contentFormat: 'html',
      value: editorState,
      media: { uploadFn: this.myUploadFn },
      onChange: e => {
        // const { datas:{ drawContent = {} } } = this.props
        // drawContent['description'] = e
        // this.props.updateTaskDatas({drawContent})
        this.setState({
          brafitEditHtml: e
        })
      },
      fontSizes: [14],
      controls: [
        'text-color',
        'bold',
        'italic',
        'underline',
        'strike-through',
        'text-align',
        'list_ul',
        'list_ol',
        'blockquote',
        'code',
        'split',
        'media'
      ]
    }

    return (
      <div className={indexStyles.miletone_out}>
        {/*标题*/}
        <div className={indexStyles.contain1}>
          <CompleteCheckStatus
            is_realize={is_finished == '1'}
            setStatus={this.setCompleted}
          />
          {!titleIsEdit ? (
            <div
              className={`${indexStyles.contain1_title} ${indexStyles.pub_hover}`}
              onClick={this.setTitleIsEdit.bind(this, true)}
            >
              {name}
            </div>
          ) : (
            <NameChangeInput
              onBlur={this.titleChangeBlur.bind(this)}
              onPressEnter={this.titleChangeBlur.bind(this)}
              setIsEdit={this.setTitleIsEdit.bind(this, false)}
              autoFocus={true}
              goldName={name}
              maxLength={100}
              nodeName={'input'}
              size={'large'}
              style={{ fontSize: 20, color: '#262626' }}
            />
          )}
        </div>
        <div className={indexStyles.contain2}>
          {/* 标题 E */}
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
            {this.state.completeStatus}
          </div>
          {/*进度*/}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7b5;</span>
              <span>进度</span>
            </div>
            <div
              className={`${indexStyles.contain2_item_right}`}
              style={{ lineHeight: '28px' }}
            >
              <Progress percent={result_process} strokeColor={'#95DE64'} />
            </div>
          </div>
          {/*负责人*/}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>负责人</span>
            </div>
            {!executors.length ? (
              <Dropdown
                overlay={
                  <MenuSearchPartner
                    // isInvitation={true}
                    inviteOthersToBoardCalback={this.inviteOthersToBoardCalback}
                    invitationType={'13'}
                    invitationId={id}
                    invitationOrg={org_id}
                    listData={new_users}
                    keyCode={'user_id'}
                    searchName={'name'}
                    currentSelect={executors}
                    chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                    board_id={board_id}
                  />
                }
              >
                <div
                  className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover}`}
                >
                  添加负责人
                </div>
              </Dropdown>
            ) : (
              <div
                className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover} ${indexStyles.excutorsOut}`}
              >
                <Dropdown
                  overlay={
                    <MenuSearchPartner
                      inviteOthersToBoardCalback={
                        this.inviteOthersToBoardCalback
                      }
                      invitationType={'13'}
                      invitationId={id}
                      invitationOrg={org_id}
                      listData={new_users}
                      keyCode={'user_id'}
                      searchName={'name'}
                      currentSelect={executors}
                      chirldrenTaskChargeChange={this.chirldrenTaskChargeChange}
                      board_id={board_id}
                    />
                  }
                >
                  <div
                    className={indexStyles.excutorsOut_left}
                    ref={this.excutors_out_left_ref}
                  >
                    {executors.map((value, key) => {
                      const { avatar, name, user_name, user_id } = value
                      return (
                        <div className={indexStyles.avatar_item}>
                          <div className={indexStyles.avatar_item_avatar}>
                            <Avatar src={avatar} size={28}>
                              {name || user_name}
                            </Avatar>
                          </div>
                          <div className={indexStyles.avatar_item_name}>
                            {name || user_name}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </Dropdown>

                <Dropdown overlay={<ExcutorList listData={executors} />}>
                  <div
                    className={indexStyles.excutorsOut_right}
                    style={{
                      backgroundColor:
                        (typeof excutors_out_left_width === 'number' &&
                          excutors_out_left_width > 340) ||
                        (typeof excutors_out_left_width === 'number' &&
                          excutors_out_left_width > 340)
                          ? '#f5f5f5'
                          : ''
                    }}
                  >
                    <i className={globalStyle.authTheme}>&#xe66f;</i>
                  </div>
                </Dropdown>
              </div>
            )}
          </div>
          {/*截至时间*/}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe686;</span>
              <span>截至时间</span>
            </div>
            <div
              className={`${indexStyles.contain2_item_right} ${indexStyles.pub_hover}`}
            >
              <span style={{ position: 'relative' }}>
                {this.renderDueTime()}
              </span>
            </div>
          </div>
          {/*添加备注*/}
          <div
            className={`${indexStyles.contain2_item} ${indexStyles.contain2_item_2}`}
          >
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7f6;</span>
              <span>备注</span>
            </div>
            <div
              className={`${indexStyles.contain2_item_right}`}
              style={{ height: 'auto', padding: 0 }}
            >
              {!isInEditBraftEditor ? (
                <div
                  className={`${indexStyles.divContent_1} ${indexStyles.pub_hover}`}
                  style={{ padding: '0 10px' }}
                  onClick={() => this.goEditBrafit()}
                >
                  <div
                    className={indexStyles.contain_4}
                    onClick={this.descriptionHTML.bind(this)}
                  >
                    <div
                      style={{ cursor: 'pointer' }}
                      dangerouslySetInnerHTML={{
                        __html:
                          typeof description === 'object'
                            ? description.toHTML()
                            : description
                      }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div>
                  <div
                    className={indexStyles.editorWraper}
                    onClick={this.editWrapClick.bind(this)}
                    style={{
                      border: '1px solid rgba(0,0,0,.08)',
                      borderRadius: 4
                    }}
                  >
                    <BraftEditor {...editorProps} style={{ fontSize: 12 }} />
                  </div>
                  <div style={{ marginTop: 20, textAlign: 'right' }}>
                    <Button
                      size={'small'}
                      style={{ fontSize: 12, marginRight: 16 }}
                      type={'primary'}
                      onClick={this.saveBrafitEdit.bind(this)}
                    >
                      保存
                    </Button>
                    <Button
                      size={'small'}
                      style={{ fontSize: 12 }}
                      onClick={this.quitBrafitEdit.bind(this)}
                    >
                      取消
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* 关联内容 */}
          {/* <div className={indexStyles.contain2_item} >
            <div className={indexStyles.contain2_item_left} style={{ width: 200 }}>
              <span className={globalStyle.authTheme}>&#xe7b2;</span>
              <span>关联任务 · {complete_num || '0'}/{total_num || '0'}</span>
            </div>
            <div className={`${indexStyles.contain2_item_right}`}></div>
          </div> */}
          {!!(chird_list && chird_list.length) &&
            this.renderRelaContent({ content_list: chird_list, type: '4' })}
          {!!(content_list && content_list.length) &&
            this.renderRelaContent({ content_list, type: '0' })}

          {/* 自定义字段显示 */}
          <CustomCategoriesOperate
            onlyShowPopoverContent={true}
            disabled={false}
            fields={fields}
            handleUpdateModelDatas={data => {
              this.updateDetail().then(_ => {
                this.fetchCustomFields()
              })
            }}
          />
          {/* 添加字段 */}
          <div className={indexStyles.contain2_item}>
            <div className={indexStyles.contain2_item_left}>
              <span className={globalStyle.authTheme}>&#xe7d1;</span>
              <span>字段</span>
            </div>
            <div className={`${indexStyles.contain2_item_right}`}>
              <Popover
                title={
                  <div className={indexStyles.popover_title}>添加字段</div>
                }
                visible={this.state.fields_visible}
                trigger="click"
                onVisibleChange={visible =>
                  this.setState({ fields_visible: visible })
                }
                overlayStyle={{ width: 300 }}
                placement="bottom"
                content={this.PopoverContentRender()}
              >
                <div className={indexStyles.addProperty}>
                  <span className={globalStyle.authTheme}>&#xe7d1;</span>
                  添加字段
                </div>
              </Popover>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  milestoneDetail: { milestone_detail = {} },
  projectDetail: {
    datas: { projectDetailInfoData = {} }
  },
  gantt: {
    datas: { base_relative_time }
  }
}) {
  return { milestone_detail, projectDetailInfoData, base_relative_time }
}

// const executors = [
//   {
//     id: "1131757491328258048",
//     full_name: "15289749459",
//     mobile: "15289749459",
//     wechat: "5oeS5b6X5bm96buY",
//     create_time: "1558666",
//     update_time: "1559006",
//     is_deleted: "0",
//     avatar: "https://newdi-test-public.oss-cn-beijing.aliyuncs.com/2019-05-24/1a2fe01214664937ad4a95fa4c75ade0.jpg",
//     avatar_icon: "2019-05-24/1a2fe01214664937ad4a95fa4c75ade0.jpg",
//     name: "15289749459",
//     user_id: "1131757491328258048",
//   }, {
//     id: '1121',
//     user_id: '111',
//     name: 's11s',
//     avatar: '',
//   },
// ]
// const users = executors
