import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim'
import { Row, Col, Tooltip, Card} from 'antd'
import FormList from '../FormListBind'
import globalClassName from '../../../globalset/css/globalClassName.less'
import TopContent from '../../../components/TopContent'
import BottomContent from '../../../components/BottomContent'
import Copyright from '../../../components/Copyright'
import indexStyles from './../index.less'

const getEffectOrReducerByName = name => `login/${name}`
class Login extends React.Component {

  state = {
    loginType: 'password', //登录方式,验证码登录
  }
  setLoginType() {
    const { loginType } = this.state
    this.setState({
      loginType: loginType === 'password'? 'verifycode':'password'
    })
  }
  render() {
    const {dispatch} = this.props
    const { loginType } = this.state
    //传给表单
    const formListProps = {
      formSubmit(data) {
        dispatch({
          type: getEffectOrReducerByName('formSubmit'),
          payload: data
        })
      },
      getVerificationcode(data, calback) {
        dispatch({
          type: getEffectOrReducerByName('getVerificationcode'),
          payload: {
            data,
            calback
          }
        })
      }
    }
    //传给底部
    const BottomContentProps = {
      routingJump(path) {
        dispatch({
          type: getEffectOrReducerByName('routingJump'),
          payload: {
            route: path,
          },
        })
      }
    }
    const routingJump = (path) => {
      dispatch({
        type: getEffectOrReducerByName('routingJump'),
        payload: {
          route: path,
        },
      })
    }

    return (
      <div className={globalClassName['page_style_1']}>
        <QueueAnim type="top">
          <div key={'login'}>
            <div style={{
              maxWidth: 472, margin: '0 auto', width: '100%', background: '#FFFFFF',
              border: '1px solid rgba(217,217,217,1)',
              borderRadius: '4px'
            }}>
              <TopContent text={'欢迎来到'} productName={'灵犀'}/>
              <FormList {...formListProps} setLoginType={this.setLoginType.bind(this)} loginType={loginType} routingJump={routingJump} />
              <div style={{
                margin: '8px auto 16px', 
                width: '212px', 
                height: '20px', 
                textAlign:'center',
                fontSize: '14px',
                fontFamily:'PingFangSC-Regular',
                fontWeight:400,
                color: '#1890FF'
              }}><span style={{cursor: 'pointer'}} onClick={() => window.location.href='http://localhost/#/register/wechat'}>注册账户并绑定微信</span></div>
              <div style={{
                margin: '0 auto', 
                width: '271px', 
                height: '52px', 
                borderTop: '1px solid #E8E8E8',
                textAlign:'center',
                lineHeight: '56px',
                fontSize: '14px',
                fontFamily:'PingFangSC-Regular',
                fontWeight:400,
                marginBottom: '30px',
                color: '#1890FF'
              }}><span style={{cursor: 'pointer'}} onClick={() => window.location.href=('http://localhost/#/login') }>密码登陆</span></div>
            </div>
            <Copyright/>
          </div>
        </QueueAnim>
      </div>
    );
  }
};

// export default Products;
export default connect(({ login }) => ({
  login,
}))(Login);

