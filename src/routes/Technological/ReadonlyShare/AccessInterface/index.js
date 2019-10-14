import React from 'react'
import { Input, message, Button } from 'antd'
import QueueAnim from 'rc-queue-anim'
import TopContent from '../../../../components/TopContent'
import globalClassName from '../../../../globalset/css/globalClassName.less'
import indexStyles from './index.less'
import { verificationShareLink, } from "../../../../services/technological/workbench";
import { MESSAGE_DURATION_TIME } from '../../../../globalset/js/constant'
import { routerRedux } from "dva/router";
import { connect } from 'dva';
import md5 from 'md5'
import { Base64 } from 'js-base64';

@connect()
export default class AccessInterface extends React.Component {
    state = {
        verificationCode: '',  //输入的验证码
    }
    componentDidMount() {
        const params = {
            check_type: '1',
            password: ''
        }
        this.verificationShareInfo(params)
    }

    createRandomCode = (number) => {
        var random = Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, number - 1));

        return random;
    }

    verificationShareInfo(params) {
        const hash = window.location.hash
        var arr = hash.split("/");
        const token = arr[2]
        const { check_type, password, } = params
        /**
         * mark - parm
         * check_type*	integer($int32) 分享链接验证类型（1=验证链接是否过期 2=验证密码是否正确）
         * password	    string          分享链接密码
         * token*	    string          分享token
         */
        const payload = {
            check_type: check_type,
            password: password,
            token: token,
        }
        verificationShareLink(payload).then(({ code, message, data }) => {

            if (code === '0') {
                if (check_type === '2') {  //2=验证密码 才跳转详情页

                    const hash = data.hash
                    //生成10位数的随机码
                    const randomCode = this.createRandomCode(10)

                    //未来时间 = 当前时间 + 1分钟, 转成字符串, 截取10位(秒级)
                    var newDate = new Date;
                    const futureDate = newDate.setMinutes(newDate.getMinutes() + 60).toString();
                    const futureTimestamp = futureDate.substr(0, 10);

                    // hash randomCode timestamp 按照顺序拼接
                    let arrNew = new Array()
                    arrNew.push(hash)
                    arrNew.push(randomCode)
                    arrNew.push(futureTimestamp)
                    const signature = arrNew.join('')
                    //md5加密成32位小写
                    const signature_md5 = md5(signature)
                    const shareLinkInfo = {
                        "hash": hash,
                        "signature": signature_md5,
                        "randomCode": randomCode,
                        "timestamp": futureTimestamp,
                    }

                    const shareLinkInfo_value = Base64.encode(JSON.stringify(shareLinkInfo))

                    /***
                     * 示例data:  {"hash":"eyJyZWxhSWQiOjExODE4NTE5Nzc1NDY2MDA0NDgsInJlbGFUeXBlIjoxfQ==","signature":"8088109ab4b9b6a139785a4c4601b396","randomCode":"2234","timestamp":"1570698304"}
                     * 
                     * hash： 分享链接验证返回
                     * signature ：签名
                     * randomCode：随机码
                     * timestamp ：时间戳十位 未来一分钟
                     * signature 该值为 hash randomCode timestamp 三个的值md5加密
                     * 然后整个字符串base64加密放入ShareLinkInfo 里面
                     */
                    localStorage.setItem('shareLinkInfo', shareLinkInfo_value)

                    const { dispatch } = this.props;
                    dispatch(
                        routerRedux.push(`/share_detailed?rela_type=${data.rela_type}&rela_id=${data.rela_id}`)
                    )
                }
            } else {
                message.error(message, MESSAGE_DURATION_TIME)
            }
        })
    }
    setVerificationCode = (data) => {
        const inputValue = data.target.value
        this.setState({
            verificationCode: inputValue,
        })
    }
    immediatelyVisitor = () => {
        const { verificationCode } = this.state
        const params = {
            check_type: '2',
            password: verificationCode,
        }
        this.verificationShareInfo(params)
    }

    render() {
        return (
            <div className={globalClassName['page_style_1']}>
                <QueueAnim type="top">
                    <div>
                        <div style={{
                            maxWidth: 472, margin: '0 auto', width: '100%', background: '#FFFFFF',
                            border: '1px solid rgba(217,217,217,1)',
                            borderRadius: '4px',
                            textAlign: 'center',
                        }}>
                            <TopContent text={'欢迎来到'} productName={'灵犀'} hidenDescription={true} />
                            <div className={indexStyles.textStyle}> 请输入访问密码 </div>
                            <div>
                                <Input placeholder="请输入访问密码" onPressEnter={this.immediatelyVisitor} className={indexStyles.inputStyle} onChange={this.setVerificationCode} />
                            </div>
                            <div>
                                <Button type="primary" htmlType="submit" className={indexStyles.buttonStyle} onClick={(data) => this.immediatelyVisitor(data)}>立即访问</Button>
                            </div>
                        </div>
                    </div>
                </QueueAnim>
            </div>
        )
    }
}
