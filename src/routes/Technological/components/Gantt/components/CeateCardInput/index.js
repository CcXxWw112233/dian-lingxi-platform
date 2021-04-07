import { Input } from 'antd'
import { connect } from 'dva'
import React, { Component } from 'react'
import {
  timestampFormat,
  timestampToTimeNormal
} from '../../../../../../utils/util'
import { task_item_height, task_item_margin_top } from '../../constants'
import styles from './index.less'

@connect(mapStateToProps)
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      card_name: ''
    }
    this.edit_div_ref = React.createRef()
  }
  componentDidMount() {
    console.log('ssssssaaaa_0', this.edit_div_ref)
    this.edit_div_ref.current.focus && this.edit_div_ref.current.focus()
  }
  addCard = e => {
    const value = e.target.innerText
    console.log('ssssssaaaa_1', value)
    const { handleGetNewTaskParams, setAddingCardVisible } = this.props
    // const { card_name } = this.state
    setAddingCardVisible(false)
    if (!value) return
    typeof handleGetNewTaskParams == 'function' &&
      handleGetNewTaskParams({ name: value })
  }
  changeName = e => {
    const value = e.target.value
    this.setState({
      card_name: value
    })
  }
  handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      this.addCard(e)
    }
  }

  render() {
    const { currentRect, create_end_time, create_start_time } = this.props
    const { card_name } = this.state
    return (
      <>
        <div
          className={styles.main_name}
          style={{
            left: currentRect.x + 1 - 200,
            top: currentRect.y,
            width: 200,
            height: task_item_height,
            marginTop: task_item_margin_top
          }}
        >
          {timestampToTimeNormal(create_start_time, '/', false)} -{' '}
          {timestampToTimeNormal(create_end_time, '/', false)}
        </div>

        <div
          className={`${styles.main} ${styles.editable_div_wrapper}`}
          autofocus="autofocus"
          contentEditable="true"
          style={{
            left: currentRect.x + 1,
            top: currentRect.y - 2,
            width: currentRect.width,
            height: task_item_height,
            marginTop: task_item_margin_top,
            zIndex: 5
          }}
        ></div>

        <div
          className={`${styles.main} ${styles.editable_div}`}
          autofocus="autofocus"
          contentEditable="true"
          onBlur={this.addCard}
          oninput={this.changeName}
          onKeyDown={this.handleKeyDown}
          ref={this.edit_div_ref}
          style={{
            left: currentRect.x + 1,
            top: currentRect.y - 2,
            minWidth: currentRect.width,
            width: 'auto',
            height: task_item_height,
            marginTop: task_item_margin_top
          }}
        >
          {/* <div className={styles.main_right}>
            {' '}
            <Input
              autoFocus
              style={{
                minWidth: currentRect.width,
                height: task_item_height,
                width: 'auto'
              }}
              value={card_name}
              onBlur={this.addCard}
              onChange={this.changeName}
              //   onPressEnter={this.addCard}
              onPressEnter={() => this.props.setAddingCardVisible(false)}
            ></Input>
          </div> */}
        </div>
      </>
    )
  }
}
function mapStateToProps({
  gantt: {
    datas: { create_start_time, create_end_time }
  }
}) {
  return {
    create_start_time,
    create_end_time
  }
}
