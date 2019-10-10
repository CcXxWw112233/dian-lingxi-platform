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

@connect(({ AccessInterface }) => ({
    AccessInterface
}))
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
        verificationShareLink(payload).then(({ code, message }) => {
            if (code === '0') {
                if (check_type === '2') {  //2=验证密码 才跳转
                    const { dispatch } = this.props;
                    dispatch(
                        routerRedux.push('/share_detailed')
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
