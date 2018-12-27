import React from 'react'
import { Icon } from 'antd';
import indexStyles from './index.less'

export default class ImChat extends React.Component {
  state={
    imIframOutVisible:false
  }
  setImIframOutVisible() {
    this.setState({
      imIframOutVisible: !this.state.imIframOutVisible
    })
  }
  render(){
    const { datas: {imData = {}} } = this.props.model
    const { access_token, username } = imData
    const { imIframOutVisible } = this.state

    return (
      <div>
        {/*聊天*/}

        <div className={indexStyles.imMessage} onClick={this.setImIframOutVisible.bind(this)}>
          <Icon type="message" />
        </div>

        <div className={indexStyles.imIframOut} style={{display: !imIframOutVisible?'none':'block'}}>
          <div className={indexStyles.ifram}>
            {access_token?(
              <iframe
                src={`http://www.new-di.com/im/#/login?username=${username}&access_token=${access_token}`}
                frameborder="0"
                width="500"
                height="500"
                id="imIFram"
              ></iframe>
            ):('')}
            <div className={indexStyles.closeimMessage} onClick={this.setImIframOutVisible.bind(this)}>
              <Icon type="close" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
