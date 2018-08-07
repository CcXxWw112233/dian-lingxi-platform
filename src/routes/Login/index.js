import React from 'react';
import { connect } from 'dva';
import QueueAnim from  'rc-queue-anim'
import { Row,  Col} from 'antd'
import { Card } from 'antd'
import FormList from './FormList'
import globalClassNmae from '../../globalset/css/globalClassName.less'
import TopContent from '../../components/TopContent'
import BottomContent from '../../components/BottomContent'
import Copyright from '../../components/Copyright'

const getEffectOrReducerByName = name => `login/${name}`
const Login = (options) => {
  const { dispatch } = options
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
          route:path,
        },
      })
    }
  }
  return (
    <div className={globalClassNmae['page_style_1']}>
      <div  style={{ maxWidth: 472,margin: '0 auto',width: '100%',background: '#FFFFFF',
        border: '1px solid rgba(217,217,217,1)',
        borderRadius: '4px'}}>
        <TopContent text={'欢迎来到'} productName={'productname'}/>
        <FormList {...formListProps}/>
        <BottomContent {...BottomContentProps} type={'login'}/>
      </div>
      <Copyright />
    </div>
  );
};

// export default Products;
export default connect(({ login }) => ({
  login,
}))(Login);

