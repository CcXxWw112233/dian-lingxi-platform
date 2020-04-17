import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import GroupListHeadItem from './GroupListHeadItem'
import GroupListHeadElse from './GroupListHeadElse'
import OutLineHeadItem from './OutLineHeadItem'
import { ganttIsOutlineView } from './constants';
import emptyBoxImageUrl from '@/assets/gantt/empty-box.png';
import { Button } from 'antd';
import OutlineGuideModal from './components/OutlineGuideModal';
import { milestoneInit } from '@/services/technological/task.js';
@connect(mapStateToProps)
export default class GroupListHead extends Component {
  constructor(props) {
    super(props)
    this.state = {
      offsetTop: 0,
      offsetLeft: 0
    }
  }

  componentDidMount = () => {
    this.setHeaderPostion()
  }
  setHeaderPostion = () => {
    const gantt_card_out = document.getElementById('gantt_card_out')
    if (gantt_card_out) {
      const offsetTop = gantt_card_out.offsetTop
      const offsetLeft = gantt_card_out.offsetLeft
      this.setState({
        offsetTop,
        offsetLeft
      })
    }
  }

  // 头部鼠标滚动设置位置
  onWheel = (e) => {
    const { target_scrollTop, dispatch, target_scrollLeft } = this.props
    const ele = document.getElementById('gantt_card_out_middle')
    const panel_scroll_top = ele.scrollTop
    let new_target_scrollTop = panel_scroll_top
    // console.log('ssssssssssss0', ele.scrollTop)
    if (e.nativeEvent.deltaY <= 0) {
      /* scrolling up */
      if (ele.scrollTop <= 0) {
        e.preventDefault();
        // console.log('ssssssssssss1', 'scrolling up')
        return
      } else {
        new_target_scrollTop -= 50
        // console.log('ssssssssssss1', new_target_scrollTop)
      }
    }
    else {
      /* scrolling down */
      if (ele.scrollTop + ele.clientHeight >= ele.scrollHeight) {
        e.preventDefault();
        // console.log('ssssssssssss2', 'scrolling down')
        return
      } else {
        new_target_scrollTop += 50
        // console.log('ssssssssssss2', new_target_scrollTop)
      }
    }
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        target_scrollTop: new_target_scrollTop
      }
    })
    if (ele.scrollTo) {
      ele.scrollTo(target_scrollLeft, new_target_scrollTop)
    } else {
      ele.scrollTop = new_target_scrollTop
    }
  }

  openBoardTemplateDrawer = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        boardTemplateShow: 1
      }
    });
  }

  guideModalHandleClose = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        startPlanType: -1
      }
    });
  }

  openGuideModal = (boardId) => {
    const { dispatch } = this.props;

    milestoneInit({ board_id: boardId }).then((res) => {
      dispatch({
        type: 'gantt/getGanttData',
        payload: {

        }
      });
      dispatch({
        type: 'gantt/updateDatas',
        payload: {
          startPlanType: 1
        }
      });
    });


  }

  render() {
    const { list_group = [], group_rows = [], ceiHeight, target_scrollLeft, target_scrollTop, group_view_type, outline_tree = [], get_gantt_data_loaded, gantt_board_id } = this.props;
    const { startPlanType } = this.props;
    const isNewProject = (!outline_tree || outline_tree.length == 0) ? true : false;
    if (get_gantt_data_loaded == false) {
      return (
        <div></div>
      );
    }
    if (ganttIsOutlineView({ group_view_type }) && isNewProject && startPlanType == 0) {

      return (
        <div className={indexStyles.newProjectGuideWrapper}>
          <div className={indexStyles.emptyBox}>
            <div><img src={emptyBoxImageUrl} width={88} height={88} /></div>
            <div>还没有计划，赶快新建一个吧</div>
          </div>
          <div className={indexStyles.guideButtons}>

            <Button type="primary" className={indexStyles.selectMakePlanBtn} block onClick={() => { this.openGuideModal(gantt_board_id) }}>制定计划</Button>
            <Button block onClick={this.openBoardTemplateDrawer}>选择模版</Button>
          </div>
        </div>
      )

    } else {
      return (
        <div className={`${ganttIsOutlineView({ group_view_type }) ? indexStyles.listTree : indexStyles.listHead}`}
          // style={{ left: target_scrollLeft, }}
          onWheel={this.onWheel}
          style={{ top: -target_scrollTop + 64, }}
        >
          {
            ganttIsOutlineView({ group_view_type }) &&
            <div style={{ position: 'relative', height: '100%', width: '280px', boxShadow: '1px 0px 4px 0px rgba(0,0,0,0.15);' }}>
              <OutLineHeadItem changeOutLineTreeNodeProto={this.props.changeOutLineTreeNodeProto} deleteOutLineTreeNode={this.props.deleteOutLineTreeNode} />
              {/* { //大纲操作指引
                startPlanType == 1 &&
                <OutlineGuideModal handleClose={this.guideModalHandleClose} />
              } */}
            </div>
          }
          {
            !ganttIsOutlineView({ group_view_type }) &&
            <>
              {
                list_group.map((value, key) => {
                  const { list_name, list_id, list_data = [] } = value
                  return (
                    <div key={list_id}>
                      <GroupListHeadItem
                        list_id={list_id}
                        setTaskDetailModalVisibile={this.props.setTaskDetailModalVisibile}
                        itemValue={value} itemKey={key} rows={group_rows[key]} />
                      {/*<div className={indexStyles.listHeadItem} key={list_id} style={{height: (group_rows[key] || 2) * ceiHeight}}>{list_name}</div>*/}
                    </div>
                  )
                })
              }
              <GroupListHeadElse gantt_card_height={this.props.gantt_card_height} dataAreaRealHeight={this.props.dataAreaRealHeight} />
            </>
          }
        </div>
      )
    }

  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ gantt: {
  datas: {
    list_group = [],
    group_rows = [],
    ceiHeight,
    target_scrollLeft,
    target_scrollTop,
    group_list_area,
    group_list_area_section_height,
    group_view_type,
    outline_tree,
    startPlanType,
    get_gantt_data_loaded,
    gantt_board_id
  }
} }) {
  return {
    list_group,
    group_rows,
    ceiHeight,
    target_scrollLeft,
    target_scrollTop,
    group_list_area,
    group_list_area_section_height,
    group_view_type,
    outline_tree,
    startPlanType,
    get_gantt_data_loaded,
    gantt_board_id
  }
}
