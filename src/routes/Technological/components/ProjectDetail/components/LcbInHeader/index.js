import React, { Component } from 'react'
import indexStyles from './index.less'
import globalStyles from '../../../../../../globalset/css/globalClassName.less'
import { Progress, Dropdown, Menu } from 'antd';
import AddLCBModal from '../../../Gantt/components/AddLCBModal'
import { connect } from 'dva'
const MenuItem = Menu.Item

@connect(mapStateToProps)
export default class LcbInHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      add_lcb_modal_visible: false
    }
  }
  selectLCB = (e) => {

  }

  renderLCBList = () => {
    const lcb_list = [1, 2, 3, 4, 5]
    return (
      <Menu onClick={this.selectLCB}>
        {lcb_list.map((value, key) => {
          return (
            <MenuItem
              className={globalStyles.global_ellipsis}
              style={{width: 216}}
              key={key}>
              11111111111111111111111111111111111
            </MenuItem>
          )
        })}
      </Menu>
    )
  }

  setAddLCBModalVisibile = () => {
    this.setState({
      add_lcb_modal_visible: !this.state.add_lcb_modal_visible
    });
  }

  submitCreatMilestone = (data) => {

  }

  render() {
    const { data, board_id, board_name } = this.props
    const { add_lcb_modal_visible } = this.state
    return(
      <div>
        <div className={indexStyles.coperate_lcb_out}>
          <Dropdown overlay={this.renderLCBList()}>
            <div className={`${globalStyles.authTheme} ${indexStyles.coperate_lcb_out_item} ${indexStyles.lcb_logo}`}>&#xe633;</div>
          </Dropdown>
          <div className={`${indexStyles.coperate_lcb_out_item}`}>21/32</div>
          <div className={`${indexStyles.coperate_lcb_out_item} ${indexStyles.progress_area}`}>
            <Progress percent={50}
                      status="active"
                      showInfo={false}
                      strokeColor={'#FAAD14'}
            />
          </div>
          <div className={`${indexStyles.coperate_lcb_out_item} ${indexStyles.add_input}`}
             onClick={this.setAddLCBModalVisibile.bind(this)}>＋ 项目里程碑</div>
        </div>
        <AddLCBModal
          userList={data}
          boardName={board_name}
          boardId={board_id}
          add_lcb_modal_visible={add_lcb_modal_visible}
          setAddLCBModalVisibile={this.setAddLCBModalVisibile.bind(this)}
          submitCreatMilestone={this.submitCreatMilestone}
        />
      </div>
    )
  }


}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps(
  {
    projectDetail: { datas: { projectDetailInfoData = { } } },
  }){
  const { data = [], board_id, board_name } = projectDetailInfoData
  return { data, board_id, board_name }
}
