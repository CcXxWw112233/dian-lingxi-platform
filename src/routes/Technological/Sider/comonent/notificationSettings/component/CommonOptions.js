// 这是一个公用的组件 
import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col } from 'antd'
import styles from '../NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'

export default class CommonOptions extends Component {
  render() {
    const { itemVal } = this.props
    // console.log(itemVal, 'sss')
    return (
      <div>
        <div id={itemVal.id} className={styles.project}>
          <div style={{marginBottom: 12}}>
            <span className={`${glabalStyles.authTheme}`}>&#xe7ee;</span>
            <span>{itemVal.name}</span>
          </div>
          <div className={styles.contain}>
            {
              (
                <Checkbox.Group style={{width: '100%'}} onChange={this.chgProjectOptions}>
                  <Row>
                    {
                      itemVal.child_data && itemVal.child_data.map(val => {
                        return (
                            <Col style={{marginBottom: 8}} span={8}>
                                <Checkbox value={val.id}>{val.name}</Checkbox>
                            </Col>
                        )
                      })
                    }
                  </Row>
                </Checkbox.Group>
              )
            }
          </div>
        </div>
      </div>   
    )
  }
}
