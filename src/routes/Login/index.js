import React from 'react';
import { connect } from 'dva';
import QueueAnim from  'rc-queue-anim'
import { Row,  Col, Tooltip, Card} from 'antd'
import FormList from './FormList'
import globalClassName from '../../globalset/css/globalClassName.less'
import TopContent from '../../components/TopContent'
import BottomContent from '../../components/BottomContent'
import Copyright from '../../components/Copyright'
import indexStyles from './index.less'

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
              <div className={indexStyles.bottomWhole}>
                <div className={indexStyles.bottomWholeLeft} style={{marginTop: -8}}>
                  <Tooltip placement="top" title={'即将上线'}>
                    <i className={globalClassName.authTheme}
                       style={{fontStyle: 'normal', fontSize: 24, color: '#bfbfbf', cursor: 'pointer',}}>&#xe6be;</i>
                  </Tooltip>
                  <Tooltip placement="top" title={'即将上线'}>
                    <i className={globalClassName.authTheme} style={{
                      fontStyle: 'normal',
                      fontSize: 24,
                      color: '#bfbfbf',
                      cursor: 'pointer',
                      marginLeft: 6,
                      marginTop: -6
                    }}>&#xe6c2;</i>
                  </Tooltip>
                  <Tooltip placement="top" title={'即将上线'}>
                    <i className={globalClassName.authTheme} style={{
                      fontStyle: 'normal',
                      fontSize: 24,
                      color: '#bfbfbf',
                      cursor: 'pointer',
                      marginLeft: 6,
                      marginTop: -6
                    }}>&#xe6c1;</i>
                  </Tooltip>
                </div>
                <div className={indexStyles.bottomWholeRight}>
                  <p><span onClick={this.setLoginType.bind(this)}>{loginType === 'password'? '验证码登录': '密码登陆'}</span><span>|</span><span
                    onClick={routingJump.bind(null, '/register')}>注册账户</span></p>
                </div>
              </div>
              {/*<BottomContent {...BottomContentProps} type={'login'}/>*/}
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

