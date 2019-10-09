import React from 'react'
import { Input, message, Button } from 'antd'
import QueueAnim from 'rc-queue-anim'
import TopContent from '../../../../components/TopContent'
import globalClassName from '../../../../globalset/css/globalClassName.less'
import indexStyles from './index.less'

export default class AccessInterface extends React.Component {
    state = {
    }
    immediatelyVisitor() {
        console.log('立即访问');
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
                                <Input placeholder="请输入访问密码" onPressEnter={this.immediatelyVisitor} className={indexStyles.inputStyle} />
                            </div>
                            <div>
                                <Button type="primary" htmlType="submit" className={indexStyles.buttonStyle} onClick={this.immediatelyVisitor}>立即访问</Button>
                            </div>
                        </div>
                    </div>
                </QueueAnim>
            </div>
        )
    }
}
