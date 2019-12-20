import React, { Component } from 'react'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { Input, Button } from 'antd';
import { connect } from 'dva'
import TempleteSchemeTree from './TempleteSchemeTree'

// @connect(mapStateToProps)
export default class TempleteSchemeContent extends Component {

  state = {
  }


  // 渲染其他计划方案
  renderOthersScheme = () => {
    const { is_create_lcb, is_selected_item } = this.state
    return (
      <div className={indexStyles.planningSchemeItemWrapper}>
        {/* 顶部工具栏 */}
        <div className={indexStyles.planningSchemeItem_top}>
          <div>
            <span className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe6f1; 添加同级</span>
            <span style={{ marginLeft: '18px' }} className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe6f2; 添加子级</span>
          </div>
          <div>
            <span style={{marginRight: '18px'}} className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe602; 重命名</span>
            <span className={`${globalStyles.authTheme} ${is_selected_item && indexStyles.pub_hover}`}>&#xe7c3; 删除</span>
          </div>
        </div>
        <TempleteSchemeTree />
      </div>
    )
  }

  render() {
    return (
      <div>{this.renderOthersScheme()}</div>
    )
  }
}

// 这是一个每一个方案的组件
TempleteSchemeContent.defaultProps = {

}