import React from 'react';
import { connect } from 'dva';
import QueueAnim from  'rc-queue-anim'
import { Row,  Col} from 'antd'
import { Card } from 'antd'
import FormList from './FormList'
import globalClassNmae from '../../globalset/css/globalClassName.less'

const Login = (options) => {
  const { dispatch, products } = options
  return (
    <div className={globalClassNmae['page_style_1']}>
      <Card  bordered={false} style={{ border: '1px solid #ececec',maxWidth: 472,margin: '0 auto',width: '100%'}}>
        <QueueAnim duration={500} type='top'>
          <FormList />
        </QueueAnim>
      </Card>
    </div>
  );
};

// export default Products;
export default connect(({ login }) => ({
  login,
}))(Login);

{/*<div style={{ background: '#ECECEC', padding: '30px' }}>*/}
{/*<card title="Card title"  style={{ width: 300 }}>*/}
{/*<QueueAnim delay={500} type='top'>*/}
{/*<div key="a">依次进场</div>*/}
{/*<div key="b">依次进场</div>*/}
{/*<div key="c">依次进场</div>*/}
{/*<div key="d">依次进场</div>*/}
{/*<div key="e">依次进场</div>*/}
{/*<div key="f">依次进场</div>*/}
{/*</QueueAnim>*/}
{/*</card>*/}
{/*</div>*/}
