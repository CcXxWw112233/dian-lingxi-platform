import React from 'react';
import { connect } from 'dva';
import QueueAnim from  'rc-queue-anim'
import { Row,  Col} from 'antd'
import { Card } from 'antd'
import globalClassNmae from '../../globalset/css/globalClassName.less'
import Copyright from '../../components/Copyright'
import TopContentTwo from  '../../components/TopContentTwo'
import CheckMain from './CheckMain'

const RegisterSuccess = (options) => {
  const { dispatch, products } = options
  return (
    <div className={globalClassNmae.page_style_1} style={{paddingTop: 108}}>
      <div  style={{ maxWidth: 472,margin: '0 auto',width: '100%',}}>
        <TopContentTwo />
        <CheckMain />
      </div>
      <Copyright />
    </div>
  );
};

// export default Products;
export default connect(({ login }) => ({
  login,
}))(RegisterSuccess);

