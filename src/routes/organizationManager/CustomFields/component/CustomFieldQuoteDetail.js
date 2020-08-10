import React, { Component } from 'react'
import { Modal, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction'
import { PROJECTS } from '../../../../globalset/js/constant'

export default class CustomFieldQuoteDetail extends Component {

  onCancel = () => {
    this.props.updateState && this.props.updateState()
  }

  renderTitle = () => {
    return (
      <div className={indexStyles.custom_quote_title}>字段引用详情</div>
    )
  }

  renderContent = () => {
    return (
      <div className={indexStyles.custom_quote_content}>
        <div className={indexStyles.custom_quote_c_left}>
          <Menu style={{ width: '136px', height: '626px' }}>
            <Menu.Item>
              <span className={globalStyles.authTheme}>&#xe684; {`${currentNounPlanFilterName(PROJECTS)}`}·3</span>
            </Menu.Item>
          </Menu>
        </div>
        <div className={indexStyles.custom_quote_c_right}>
          <div className={indexStyles.custom_quote_cr_item}>
            <span className={globalStyles.authTheme}>&#xe684;</span>
            <span>这是一个项目名</span>
          </div>
          <div className={indexStyles.custom_quote_cr_item}>
            <span className={globalStyles.authTheme}>&#xe684;</span>
            <span>很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长</span>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { visible } = this.props
    return (
      <div>
        <Modal
          width={614}
          visible={visible}
          title={null}
          footer={null}
          destroyOnClose={true}
          maskClosable={false}
          getContainer={() => document.getElementById('org_managementContainer')}
          onCancel={this.onCancel}
          style={{ width: '614px' }}
          maskStyle={{ backgroundColor: 'rgba(0,0,0,.3)' }}
        >
          <div>
            <div>{this.renderTitle()}</div>
            <div>{this.renderContent()}</div>
          </div>
        </Modal>
      </div>
    )
  }
}
