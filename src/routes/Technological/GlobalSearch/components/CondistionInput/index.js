import React from 'react'
import { Modal, Form, Button, Input, message, Select, Icon } from 'antd'
import indexstyles from './index.less'
import globalStyles from './../../../../../globalset/css/globalClassName.less'
const FormItem = Form.Item
const TextArea = Input.TextArea
const InputGroup = Input.Group;
const Option = Select.Option;

//应用与
export default class CondistionInput extends React.Component {
  onChange = (e) => {
    console.log('sss', e.target.innerText)

  }
  render() {
    const { style, inputStyle, conditions = [1, 2, 3, 4, 51, 2,] } = this.props
    return(
      <div style={style}>
        <div contenteditable="true" resize ='none' placeholder="请输入" className={`${indexstyles.input_out}`} onInput={this.onChange}>
          <div className={`${indexstyles.conditions}`}>
            {
              conditions.map((value, key) => {
                return (
                  <div contenteditable="false" className={`${indexstyles.condition_item}`}>
                    <span contenteditable="false" >{`sd${key}`}</span>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}


