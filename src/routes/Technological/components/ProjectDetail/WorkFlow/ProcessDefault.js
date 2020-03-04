import React, { Component } from 'react'
import indexStyles from './index.less'
import TemplateContent from './component/TemplateContent'

const changeClientHeight = () => {
  const clientHeight = document.documentElement.clientHeight;//获取页面可见高度
  return clientHeight
}

export default class ProcessDefault extends Component {
  state = {
    clientHeight: changeClientHeight()
  }
  constructor() {
    super()
    this.resizeTTY.bind(this)
  }
  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTTY)
  }
  resizeTTY = () => {
    const clientHeight = changeClientHeight();//获取页面可见高度
    this.setState({
      clientHeight
    })
  }

  render() {
    const { clientHeight } = this.state
    return (
      <div className={indexStyles.processDefautOut}>
        <div className={indexStyles.processDefautOut_top}>
          <div className={indexStyles.title}>模板:</div>
          <TemplateContent clientHeight={clientHeight}/>
        </div>
        {/*右方流程*/}
        <div className={indexStyles.processDefautOut_bottom}>
          {/* {flowTabs()} */}
        </div>
      </div>
    )
  }
}
