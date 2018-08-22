import React from 'react'
import CreateTaskStyle from '../CreateTask.less'
import { Icon, Checkbox, Collapse, Input } from 'antd'


const Panel = Collapse.Panel

export default class CreateItem extends React.Component {
  state = {
    isInEditAdd: false,
    inputValue: '',
  }

  setIsInEditAdd() {
    this.setState({
      isInEditAdd: true
    })
  }

  inputEditOk(e) {
    this.setState({
      isInEditAdd: false,
      inputValue: '',
    })
    this.props.addTaskItem()
  }
  inputChange(e) {
    this.setState({
      inputValue: e.target.value
    })
  }

  render() {
    const { isInEditAdd, inputValue } = this.state
    return (
      <div className={CreateTaskStyle.createTaskItem}>
        {!isInEditAdd?(
          <div className={CreateTaskStyle.createTaskItemTitle} onClick={this.setIsInEditAdd.bind(this)}>创建新分组…</div>
        ):(
          <div>
            <Input autoFocus  value={inputValue} placeholder={'创建新分组…'} className={CreateTaskStyle.createTaskItemInput} onChange={this.inputChange.bind(this)} onPressEnter={this.inputEditOk.bind(this)} onBlur={this.inputEditOk.bind(this)}/>
          </div>
        )}
      </div>
    )
  }
}
