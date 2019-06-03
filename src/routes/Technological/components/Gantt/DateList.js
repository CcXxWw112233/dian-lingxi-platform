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
    lcb_modal_visible: true
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
  setAddLCBModalVisibile() {
    this.setState({
      lcb_modal_visible: !this.state.lcb_modal_visible
    });
  }

  render () {
    const { datas: { gold_date_arr = [], list_group =[], target_scrollTop }} = this.props.model

    const { lcb_modal_visible } = this.state

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
                    const { month, date_no } = value2
                    const has_lcb = key2%2==0
                    return (
                      <div key={`${month}/${date_no}`}>
                        <div className={`${indexStyles.dateDetailItem}`} key={key2}>{month}/{date_no}</div>
                        <DateListLCBItem has_lcb={has_lcb}/>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {lcb_modal_visible && (
          <AddLCBModal
            {...this.props}
            setTaskDetailModalVisibile={this.setAddLCBModalVisibile.bind(
              this
            )}
            isUseInGantt
            projectIdWhenUseInGantt={0}
            projectMemberListWhenUseInGantt={[]}
            projectGroupListId={0}
            // handleGetNewTaskParams={this.handleGetNewTaskParams.bind(this)}
            modalTitle="添加任务"
            taskType="RESPONSIBLE_TASK"
            getNewTaskInfo={this.getNewTaskInfo}
            projectTabCurrentSelectedProject={0}
            projectList={[]}
            addTaskModalVisible={lcb_modal_visible}
            addTaskModalVisibleChange={this.setAddLCBModalVisibile.bind(this)}
            projectGroupLists={[]}
            // handleShouldUpdateProjectGroupList={this.handleShouldUpdateProjectGroupList}
          />
        )}
      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
