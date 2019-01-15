import React from 'react'
import indexStyles from './index.less'

export default class PersonNews extends React.Component {

  state = {
    width: document.getElementById('technologicalOut').clientWidth - 20
  }

  componentDidMount() {
    window.addEventListener('resize', this.resizeTTY.bind(this,'person_news_out'))
  }
  resizeTTY(type) {
    const width = document.getElementById('technologicalOut').clientWidth;//获取页面可见高度
    this.setState({
      width
    })
  }

  render(){
    const { width } = this.state
    return (
      <div className={indexStyles.person_news_out} style={{width: width}}>
        sss
      </div>
    )
  }



}
