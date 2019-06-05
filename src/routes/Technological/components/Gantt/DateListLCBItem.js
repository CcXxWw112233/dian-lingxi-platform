import React, { Component } from 'react';
import { connect, } from 'dva';
import indexStyles from './index.less'
import globalStyles from '../../../../globalset/css/globalClassName.less'
import { Tooltip, Menu, Dropdown } from 'antd'
const MenuItem = Menu.Item

const getEffectOrReducerByName = name => `gantt/${name}`
@connect(mapStateToProps)
export default class DateListLCBItem extends Component {

  constructor(props) {
    super(props)

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

  selectLCB = (e) => {

  }

  renderLCBList = () => {
    const { current_date_miletones } = this.props
    return (
      <Menu onClick={this.selectLCB}>
        {current_date_miletones.map((value, key) => {
          const { id, name } = value
          return (
            <MenuItem
              className={globalStyles.global_ellipsis}
              style={{width: 216}}
              key={id}>
              {name}
            </MenuItem>
          )
        })}
      </Menu>
    )
  }
  setAddLCBModalVisibile = (timestamp, e) => {
    e.stopPropagation()
    this.props.setCreateLcbTime && this.props.setCreateLcbTime(timestamp)
    this.props.setAddLCBModalVisibile && this.props.setAddLCBModalVisibile()
  }
  render () {
    const { has_lcb, name = 'sss', lcb_list = [], timestamp } = this.props
    return (
      <div
        // onClick={this.checkLCB.bind(this, {has_lcb})}
        className={`${indexStyles.lcb_area} ${has_lcb?indexStyles.has_lcb:indexStyles.no_has_lcb}`}>
        {has_lcb ? (
          <Dropdown overlay={this.renderLCBList()}>
            <Tooltip title={`${name}`}>
              <div className={`${globalStyles.authTheme} ${indexStyles.lcb_logo}`}
                   onClick={this.setAddLCBModalVisibile.bind(this, timestamp)}>&#xe633;</div>
            </Tooltip>
          </Dropdown>
        ): (
          <div className={`${globalStyles.authTheme} ${indexStyles.lcb_logo}`} onClick={this.setAddLCBModalVisibile.bind(this, timestamp)}>&#xe633;</div>
        )}

      </div>
    )
  }

}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({ modal, gantt, loading }) {
  return { modal, model: gantt, loading }
}
