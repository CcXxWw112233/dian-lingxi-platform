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

const Register = (options) => {
  const { dispatch, products } = options
  return (
    <div className={globalClassNmae.page_style_2}>
      <div  style={{ maxWidth: 472,margin: '0 auto',width: '100%',background: '#FFFFFF',
        border: '1px solid rgba(217,217,217,1)',
        borderRadius: '4px'}}>
        <TopContent text={'欢迎加入'} productName={'productname'}/>
        <FormList />
        <BottomContent type={'register'}/>
      </div>
      <Copyright />
    </div>
  );
};

// export default Products;
export default connect(({ login }) => ({
  login,
}))(Register);

