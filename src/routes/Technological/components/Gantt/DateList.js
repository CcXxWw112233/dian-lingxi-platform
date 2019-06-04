import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Tooltip } from 'antd'
import DateListLCBItem from './DateListLCBItem'
import AddLCBModal from './components/AddLCBModal'

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class DateList extends Component {

  constructor(props) {
    super(props)

  }

  state = {
    add_lcb_modal_visible: false,
    create_lcb_time: '',
  }

  getDate = () => {
    const DateArray = []
    for(let i = 1; i < 13; i++) {
      const obj = {
        dateTop: `${i}月`,
        dateInner: []
      }
      for(let j = 1; j < 32; j++) {
        const obj2 = {
          name: `${i}/${j}`,
          is_daily: j % 6 || j % 7 == 0 ? '1' : '0'
        }
        obj.dateInner.push(obj2)
      }
      DateArray.push(obj)
    }
    return DateArray
  }

  checkLCB = ({has_lcb}) => {

  }

  submitCreatMilestone = (data) => {

  }

  setAddLCBModalVisibile = () => {
    this.setState({
      add_lcb_modal_visible: !this.state.add_lcb_modal_visible
    });
  }

  setCreateLcbTime = (timestamp) => {
    this.setState({
      create_lcb_time: timestamp
    })
  }

  getBoardName = (boardId) => {
    const { projectList = [] } = this.props
    const board_name = (projectList.find(item => item.board_id == boardId) || {} ).board_name
    return board_name || '项目名称'
  }

  render () {
    const {
      gold_date_arr = [],
      list_group =[],
      target_scrollTop,
      projectList,
      projectTabCurrentSelectedProject,
      currentSelectedProjectMembersList = []
    } = this.props

    const { add_lcb_modal_visible, create_lcb_time } = this.state

    return (
      <div>
        <div className={indexStyles.dateArea}
             style={{top: target_scrollTop}}>
          {gold_date_arr.map((value, key) => {
            const { date_top, date_inner = [] } = value
            return (
              <div className={indexStyles.dateAreaItem} key={key}>
                <div className={indexStyles.dateTitle}>{date_top}</div>
                <div className={indexStyles.dateDetail} >
                  {date_inner.map((value2, key2) => {
                    const { month, date_no, date_string } = value2
                    const has_lcb = key2%2==0
                    return (
                      <div key={`${month}/${date_no}`}>
                        <div className={`${indexStyles.dateDetailItem}`} key={key2}>{month}/{date_no}</div>
                        {projectTabCurrentSelectedProject != '0' && (
                          <DateListLCBItem
                            has_lcb={has_lcb}
                            timestamp={new Date(`${date_string} 23:59:59`)}
                            setCreateLcbTime={this.setCreateLcbTime}
                            setAddLCBModalVisibile={this.setAddLCBModalVisibile.bind(this)}/>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {projectTabCurrentSelectedProject != '0' && (
          <AddLCBModal
            userList={currentSelectedProjectMembersList}
            projectList={projectList}
            boardName={this.getBoardName(projectTabCurrentSelectedProject)}
            create_lcb_time={create_lcb_time}
            boardId={projectTabCurrentSelectedProject}
            add_lcb_modal_visible={add_lcb_modal_visible}
            setAddLCBModalVisibile={this.setAddLCBModalVisibile.bind(this)}
            submitCreatMilestone={this.submitCreatMilestone}
          />
        )}
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
  {
    gantt: { datas: { gold_date_arr = [], list_group = [], target_scrollTop = [] } },
    workbench: { datas: { projectList = [], projectTabCurrentSelectedProject, currentSelectedProjectMembersList = [] }}
  }){
  return { gold_date_arr, list_group, target_scrollTop, projectList, projectTabCurrentSelectedProject, currentSelectedProjectMembersList }
}
