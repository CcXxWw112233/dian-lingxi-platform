import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon } from 'antd'
import {min_page_width} from "./../../../globalset/js/styles";
import indexstyles from './index.less'
import globalStyles from './../../../globalset/css/globalClassName.less'
import {checkIsHasPermissionInBoard, setStorage} from "../../../utils/businessFunction";
import MeetingItem from './MeetingItem'
import TaskItem from './TaskItem'
import BoardItem from './BoardItem'
import FlowItem from './FlowItem'
import FileItem from './FileItem'

import {connect} from "dva/index";
import SchedulingItem from "../components/Workbench/CardContent/School/SchedulingItem";
const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

//此弹窗应用于各个业务弹窗，和右边圈子适配
//此弹窗应用于各个业务弹窗，和右边圈子适配
const getEffectOrReducerByName = name => `globalSearch/${name}`
@connect(mapStateToProps)
export default class TypeResult extends React.Component {
  state = {

  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {

  }

  render() {

    const { allTypeResultList } = this.props.model
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
      <div>
        {allTypeResultList.map((value, key) => {
          const { lists = [], listType } = value
          return (
            <div className={indexstyles.typeResult} key={key}>
              <div className={indexstyles.contentTitle}>{filterTitle(listType).title}</div>
              {lists.map((value, key) => {
                return (
                  <div key={key}>
                    {filterTitle(listType, value).ele}
                  </div>
                )
              })}
              <div className={indexstyles.lookMore}>查看更多...</div>
            </div>
          )
        })}
      </div>

    )
  }
}

function mapStateToProps({ globalSearch: { datas: {searchTypeList = [], defaultSearchType, searchInputValue, allTypeResultList = [] } } }) {
  return {
    model: { searchTypeList, defaultSearchType, searchInputValue, allTypeResultList },
  }
}
