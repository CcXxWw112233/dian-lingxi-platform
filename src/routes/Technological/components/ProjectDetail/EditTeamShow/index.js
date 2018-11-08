import React from 'react'
import { Button, Input } from 'antd'
import indexStyles from './index.less'
import BaseInfo from './BaseInfo'
const TextArea = Input.TextArea

export default class EditTeamShow extends React.Component {

  state = {
    templateHtml: ''
  }

  btnClick() {
    const that = this
    that.props.updateDatas({
      teamShowCertainOneShow: false
    })
    setTimeout(function () { //延迟获取
      const html = document.getElementById('editTeamShow').innerHTML
      console.log(html)
      that.setState({
        templateHtml: html
      })
    },200)

  }

  render() {
    return (
      <div id={'editTeamShow'} className={indexStyles.editTeamShowOut}>
        <div className={indexStyles.editTeamShow}>
        <BaseInfo {...this.props} />
        </div>
      </div>
    )
  }
}


