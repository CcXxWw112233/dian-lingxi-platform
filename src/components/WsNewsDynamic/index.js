import tio from './tiows'
import { Handler } from './Handler'
import Cookies from 'js-cookie'

let ws_protocol = 'ws'; // ws 或 wss
let ip = '192.168.0.57'
let port = 9326
let heartbeatTimeout = 5000; // 心跳超时时间，单位：毫秒
let reconnInterval = 1000; // 重连间隔时间，单位：毫秒
let binaryType = 'blob'; // 'blob' or 'arraybuffer';//arraybuffer是字节
let handler = new Handler()

let tiows
const Authorization = Cookies.get('Authorization')
const { id } = Cookies.get('userInfo')?JSON.parse(Cookies.get('userInfo')): ''
const initWsFun = () => {
  let queryString = `uid=${id}&token=${Authorization}`
  let param = null
  tiows = new tio.ws(ws_protocol, ip, port, queryString, param, handler, heartbeatTimeout, reconnInterval, binaryType)
  tiows.connect()
}
export const sendWsFun =(value) => {
  tiows.send(value)
}
export const initWs = initWsFun
export const send = sendWsFun
