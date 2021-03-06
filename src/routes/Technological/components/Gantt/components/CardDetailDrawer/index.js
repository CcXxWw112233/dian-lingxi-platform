import React, { Component } from 'react'
import { Drawer } from 'antd'
import { connect } from 'dva'
import MainUIComponent from './TaskDetailModal/MainContent'
import HeaderContent from './TaskDetailModal/HeaderContent'
import styles from './index.less'
import MainContent from '../../../../../../components/TaskDetailModal/MainContent'
@connect(mapStateToProps)
export default class Index extends Component {
  onClose = () => {
    const { dispatch } = this.props
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
  componentWillUnmount() {
    const { dispatch } = this.props
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
  render() {
    const { selected_card_visible } = this.props
    const {
      handleRelyUploading,
      handleTaskDetailChange,
      updateParentTaskList,
      setTaskDetailModalVisible,
      handleDeleteCard,
      card_id,
      handleChildTaskChange
    } = this.props
    return (
      <div
        className={`${styles.draw_detail} ${!selected_card_visible &&
          styles.hide_over}`}
      >
        <Drawer
          placement="right"
          title={
            <HeaderContent
              onClose={this.onClose}
              handleDeleteCard={handleDeleteCard}
              setTaskDetailModalVisible={setTaskDetailModalVisible}
              handleTaskDetailChange={handleTaskDetailChange}
              updateParentTaskList={updateParentTaskList}
            />
          }
          closable={false}
          onClose={this.onClose}
          mask={false}
          destroyOnClose
          visible={selected_card_visible}
          getContainer={false}
          style={{ position: 'absolute' }}
          width={400}
          className={styles.draw_detail}
        >
          <>
            <div style={{ height: 58 }}></div>
            <MainContent
              MainUIComponent={MainUIComponent}
              handleRelyUploading={handleRelyUploading}
              handleTaskDetailChange={handleTaskDetailChange}
              handleChildTaskChange={handleChildTaskChange}
            />
          </>
        </Drawer>
      </div>
    )
  }
}

Index.defaultProps = {
  setTaskDetailModalVisible: function() {}, // ????????????????????????????????????
  handleTaskDetailChange: function() {}, // ???????????????????????????????????????
  updateParentTaskList: function() {}, // ??????????????????????????????????????????????????????
  handleDeleteCard: function() {}, // ??????????????????
  handleChildTaskChange: function() {} // ?????????????????????????????????????????????  action?update/add/delete, parent_card_id, card_id, data(????????????keykode)
}

function mapStateToProps({
  gantt: {
    datas: { gantt_board_id, selected_card_visible }
  }
}) {
  return {
    gantt_board_id,
    selected_card_visible
  }
}
