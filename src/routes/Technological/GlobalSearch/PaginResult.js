import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import {checkIsHasPermissionInBoard, setStorage} from "../../../utils/businessFunction";
import {connect} from "dva/index";
import MeetingItem from './MeetingItem'
import TaskItem from './TaskItem'
import BoardItem from './BoardItem'
import FlowItem from './FlowItem'
import FileItem from './FileItem'

const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
const getEffectOrReducerByName = name => `globalSearch/${name}`
@connect(mapStateToProps)
export default class PaginResult extends React.Component {
  state = {

  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: getEffectOrReducerByName('getGlobalSearchResultList'),
      payload: {

      }
    })
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {
    const { sigleTypeResultList = [] } = this.props.model
    const sigleItem = sigleTypeResultList[0] || {}
    const { listType, lists=[] } = sigleItem
    const filterTitle = (listType, value) => {
      let title = ''
      let ele = <div></div>
      switch (listType) {
        case 'boards':
          title = '项目'
          ele = <BoardItem itemValue={value}/>
          break
        case 'cards':
          title = '任务'
          ele = <TaskItem itemValue={value}/>
          break
        case 'files':
          title = '文档'
          ele = <FileItem itemValue={value}/>
          break
        case 'flows':
          title = '流程'
          ele = <FlowItem itemValue={value}/>
          break
        case 'schedules':
          title = '日程'
          ele = <MeetingItem itemValue={value}/>
          break
        default:
          break
      }
      return { title, ele }
    }

    return(
      <div className={`${indexstyles.typeResult} ${indexstyles.paginResult}`}>
        <div className={`${indexstyles.paginResultInner}`}>
          {lists.map((value, key) => {
            return (
              <div key={key}>
                {filterTitle(listType, value).ele}
              </div>
            )
          })}
        </div>
        <div className={indexstyles.lookMore}>加载更多...</div>
      </div>
    )
  }
}
function mapStateToProps({ globalSearch: { datas: {searchTypeList = [], defaultSearchType, searchInputValue, page_number, page_size, sigleTypeResultList} } }) {
  return {
    model: { searchTypeList, defaultSearchType, searchInputValue, page_number, page_size, sigleTypeResultList },
  }
}
