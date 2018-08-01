import React from 'react';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim'
import { Card } from 'antd'
import FormList from './FormList'

const Login = (options) => {
  const { dispatch, products } = options
  return (
  <div style={{ background: '#f2f2f2',height: '100%', }}>
    <Card  bordered={false} style={{ width: 400,padding: '0 50px 0 50px', margin: '0 auto',border: '1px solid #ececec' }}>
      <QueueAnim duration={500} type='top'>
        <FormList style={{margin: '0 auto',margin:'0 50px 0 50px'}}/>
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
