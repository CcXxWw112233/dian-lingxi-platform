import React from 'react'
import { Icon } from 'antd';
import indexStyles from './index.less'
import globalStyles from '../../globalset/css/globalClassName.less'
import { operateIm } from './operateDom'

export default class ImChat extends React.Component {
  state={
    imIframOutVisible: '1'
  }
  setImIframOutVisible() {
    operateIm('0')
    // const { imIframOutVisible } = this.state
    // this.setState({
    //   imIframOutVisible: imIframOutVisible === '2' ? '3': '2',//!this.state.imIframOutVisible
    // })
  }
  render(){
    const { datas: {imData = {}} } = this.props.model
    const { access_token, username } = imData
    const { imIframOutVisible } = this.state

    return (
      <div>
        {/*聊天*/}
        {/*${imIframOutVisible === '1'?'': (imIframOutVisible ==='2'? indexStyles.imMessageHide: indexStyles.imMessageShow)}*/}
        <div id={'imMessage'}  className={`${globalStyles.authTheme} ${indexStyles.imMessage} `} onClick={this.setImIframOutVisible.bind(this)}>
          {/*<Icon type="message" />*/}
          &#xe639;
        </div>

        {/*${imIframOutVisible === '1'?'': (imIframOutVisible ==='2'? indexStyles.showIframe: indexStyles.hideIframe)}*/}
        <div id={'imIframOut'} className={`${indexStyles.imIframOut} `}>
          <div className={indexStyles.ifram}>
            {access_token?(
              <iframe
                src={`http://www.new-di.com/im/#/login?username=${username}&access_token=${access_token}`}
                frameBorder="0"
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
