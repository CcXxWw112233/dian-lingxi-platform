import Cookies from 'js-cookie'
let Handlers = function () {
  this.onopen = function (event, ws) {
    Cookies.set('wsLinking', true,{expires: 30, path: ''})
    console.log('连上了哦')
  }

  /**
   * 收到服务器发来的消息
   * @param {*} event
   * @param {*} ws
   */
  this.onmessage = function (event, ws) {
    let data = event.data;
    //服务器端回复心跳内容
    if(data=="pong"){
      return;
    }
    console.log('onmessage',data)
  }

  this.onclose = function (e, ws) {
    // error(e, ws)
    Cookies.set('wsLinking', false,{expires: 30, path: ''})
    console.log('连接断开')
  }

  this.onerror = function (e, ws) {
    console.log('连接错误')
    // error(e, ws)
  }

  /**
   * 发送心跳，本框架会自动定时调用该方法，请在该方法中发送心跳
   * @param {*} ws
   */
  this.ping = function (ws) {
    // log("发心跳了")
    ws.send('ping')
  }
}

export const Handler = Handlers
