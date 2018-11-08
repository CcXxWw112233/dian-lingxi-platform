import React from 'react'
import { Button, Input } from 'antd'
import indexStyles from './index.less'
const TextArea = Input.TextArea

export default class ImageTextOne extends React.Component {
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
  styles () {
    const { datas: {teamShowCertainOneShow = true}} = this.props.model
    const styles1 = {
      display: 'flex',
    }
    const styles2 = {
      width: 100,
      height: 100,
      backgroundColor: teamShowCertainOneShow? 'red': 'yellow',
      marginLeft: 20,
    }
    return {
      styles1,
      styles2
    }
  }
  render() {
    const {templateHtml} = this.state
    const { styles1, styles2 } = this.styles()

    return (
      <div id={'editTeamShow'} style={{color: 'red'}}>
        <div style={styles1}>
          {[1,2,3].map(value => (<div style={styles2} />))}
        </div>
        <Button onClick={this.btnClick.bind(this)}></Button>
      </div>
    )
  }
}


