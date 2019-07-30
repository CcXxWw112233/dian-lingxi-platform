// 这是一个公用的组件 
import React, { Component } from 'react'
import { Radio, Checkbox, Row, Col } from 'antd'
import styles from '../NotificationSettingsModal.less'
import glabalStyles from '@/globalset/css/globalClassName.less'

export default class CommonOptions extends Component {

  constructor(props) {
    super(props)
    this.state = {
      child_option_val: '', // 每个选项选中的value值
    }
  }


  /**
   * 这是每一个选项的方法
   * 获取val值, 调用父组件的方法
   */
  handleChildOption(e, id) {
    let val = e.target.value
    this.setState({
      child_option_val: val,
    })
    this.props.chgEveryOptions(e, id)
  }

  /**
   * 这是每一组的箭头点击事件
   */
  handleArrow(id) {
    // console.log(isClick, 'sssss')
    this.props.handleArrow(id)
  }

  

  render() {
    const { itemVal, default_options, index} = this.props
    const { id, is_show_down_arrow } = itemVal
    // console.log(itemVal, 'sss')

    return (
      <div>
        <div className={styles.project}>
          <div id={id} onClick={ () => { this.handleArrow(id) } } style={{marginBottom: 12}}>
            {
              is_show_down_arrow ? (
                // 向下的箭头
                <span className={`${glabalStyles.authTheme}`}>&#xe7ee;</span>
              ) : (
                // 向右的箭头
                <span className={`${glabalStyles.authTheme}`}>&#xe7eb;</span>
              )
            }
            <span>{itemVal.name}</span>
          </div>
          <div className={styles.contain}>
            {
              is_show_down_arrow && (
                <Checkbox.Group key={id} defaultValue={default_options} style={{width: '100%'}}>
                  <Row>
                    {
                      itemVal.child_data && itemVal.child_data.map(val => {
                        return (
                            <Col style={{marginBottom: 8}} span={8}>
                                <Checkbox onChange={(e) =>  this.handleChildOption(e, id) } value={val.id}>{val.name}</Checkbox>
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
