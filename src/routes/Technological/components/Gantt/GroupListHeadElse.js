import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { connect } from 'dva'
import CreateProject from './../Project/components/CreateProject/index';

@connect(mapStateToProps)
export default class GroupListHeadElse extends Component {
  state = {

  }
  setAddProjectModalVisible = (data) => {
    const { addProjectModalVisible } = this.state
    this.setState({
      addProjectModalVisible: !addProjectModalVisible
    })
  }

  handleSubmitNewProject = data => {
    const { dispatch } = this.props;
    Promise.resolve(
      dispatch({
        type: 'project/addNewProject',
        payload: data
      })
    )
      .then(() => {
        dispatch({
          type: 'workbench/getProjectList',
          payload: {}
        });
      })
      .then(() => {
        dispatch({
          type: 'gantt/getGanttData',
          payload: {
            
          }
        })
      });
  };
  getElseHeight = () => {
    let rows = 7
    const { gantt_card_height, dataAreaRealHeight, ceiHeight } = this.props
    const difference_height = gantt_card_height - dataAreaRealHeight
    const mult = Math.ceil(difference_height / ceiHeight)
    if (dataAreaRealHeight < 0) {
      rows = 7
    } else {
      if (mult < 7) {
        rows = 7
      } else {
        rows = mult
      }
    }
    return rows * ceiHeight
  }
  render() {
    const { addProjectModalVisible } = this.state
    return (
      <div style={{ height: this.getElseHeight() }} className={`${indexStyles.listHeadItem}`}>
        <div onClick={this.setAddProjectModalVisible} className={globalStyles.link_mouse} style={{marginTop: 20}}><i className={globalStyles.authTheme}>&#xe8fe;</i> 新建项目</div>
        {addProjectModalVisible && (
          <CreateProject
            setAddProjectModalVisible={this.setAddProjectModalVisible}
            addProjectModalVisible={addProjectModalVisible}
            addNewProject={this.handleSubmitNewProject}
          />
        )}
      </div>
    )
  }
}

//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: { datas: { gold_date_arr = [], ceiHeight } } }) {
  return { gold_date_arr, ceiHeight }
}