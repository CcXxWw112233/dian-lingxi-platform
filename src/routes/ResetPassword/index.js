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

const ResetPassword = (options) => {
  const { dispatch, products } = options
  return (
    <div className={globalClassNmae['page_style_1']}>
      <div  style={{ maxWidth: 472,margin: '0 auto',width: '100%',background: '#FFFFFF',
        border: '1px solid rgba(217,217,217,1)',
        borderRadius: '4px'}}>
        <TopContent text={'重置密码'} hidenDescription={true}/>
        <FormList />
        <div style={{height: 40}}></div>
        {/*<BottomContent type={'register'}/>*/}
      </div>
      <Copyright />
    </div>
  );
};

// export default Products;
export default connect(({ login }) => ({
  login,
}))(ResetPassword);

