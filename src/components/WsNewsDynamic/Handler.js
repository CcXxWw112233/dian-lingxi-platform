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
    Cookies.set('updateNewMessageItem', false,{expires: 30, path: ''})
    //重写setItem，将最新消息存储
    let orignalSetItem = localStorage.setItem;
    localStorage.setItem = function(key,newValue){
      let setMessageItemEvent = new Event("setMessageItemEvent");
      setMessageItemEvent.key=key;
      setMessageItemEvent.newValue = newValue;
      window.dispatchEvent(setMessageItemEvent);
      orignalSetItem.apply(this,arguments);
    }
    setTimeout(function () {
      localStorage.setItem('newMessage', JSON.stringify(data));
    },500)
  }

  this.onclose = function (e, ws) {
    Cookies.set('wsLinking', false,{expires: 30, path: ''})
    console.log('连接断开')
  }

  this.onerror = function (e, ws) {
    console.log('连接错误')
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
