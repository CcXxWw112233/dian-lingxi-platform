import React, { Component } from 'react'
import { Modal, Menu } from 'antd'
import indexStyles from '../index.less'
import globalStyles from '@/globalset/css/globalClassName.less'
import { currentNounPlanFilterName } from '../../../../utils/businessFunction'
import { PROJECTS, TASKS } from '../../../../globalset/js/constant'
import EmptyImg from '@/assets/projectDetail/process/Empty@2x.png'
import { data } from '../constant'

export default class CustomFieldQuoteDetail extends Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  onCancel = () => {
    this.props.updateState && this.props.updateState()
  }

  renderTitle = () => {
    return (
      <div className={indexStyles.custom_quote_title}>字段引用详情</div>
    )
  }

  renderTips = (code) => {
    let dec = ''
    switch (code) {
      case 'BOARD':
        dec = `${currentNounPlanFilterName(PROJECTS)}`
        break;
      case 'TASK':
        dec = `${currentNounPlanFilterName(TASKS)}`
        break;

      default:
        break;
    }
    return dec
  }

  handleMenu = (e) => {
    const { domEvent, key } = e
    this.setState({
      currentSelectedCode: key
    })
  }

  renderMenu = (data = []) => {
    return (
      <div className={indexStyles.custom_quote_c_right}>
        {
          !!(data && data.length) && data.map(item => {
            return (
              <div className={indexStyles.custom_quote_cr_item}>
                <span className={globalStyles.authTheme}>&#xe684;</span>
                <span>{item}</span>
              </div>
            )
          })
        }
      </div>
    )
  }

  renderContent = () => {
    const { quoteList = [] } = this.props
    const { currentSelectedCode } = this.state
    const { quotes = [] } = !!(quoteList && quoteList.length) && (quoteList.find(item => item.field_quote_code == currentSelectedCode) || quoteList[0])
    return (
      <>
        {
          !!(quoteList && quoteList.length) ? (
            <div className={indexStyles.custom_quote_content}>
              <div className={indexStyles.custom_quote_c_left}>
                <Menu onClick={(e) => { this.handleMenu(e) }} defaultSelectedKeys={[quoteList[0].field_quote_code]} style={{ width: '136px', height: '626px' }}>
                  {
                    quoteList.map(item => {
                      return (
                        <Menu.Item key={item.field_quote_code}>
                          <span className={globalStyles.authTheme}>&#xe684; {this.renderTips(item.field_quote_code)}·{item.quotes && item.quotes.length || ''}</span>
                        </Menu.Item>
                      )
                    })
                  }
                </Menu>
              </div>
              {
                this.renderMenu(quotes)
              }
            </div>
          ) : (
              <div className={indexStyles.custom_noData}>
                <div><img style={{ width: '94px', height: '62px' }} src={EmptyImg} alt="" /></div>
                <div style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</div>
              </div>
            )
        }
      </>

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