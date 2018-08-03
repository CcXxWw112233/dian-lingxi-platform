import React from 'react';
import indexStyles from './index.less'
import { Icon } from 'antd'

//第三方登陆授权
const BottomContent = (props) => {
  const { type } = props
  return (
    <div className={indexStyles.bottomWhole}>
      <div className={indexStyles.bottomWholeLeft}>
        <Icon type="wechat"  style={{ fontSize: 20, color: '#BFBFBF',cursor: 'pointer' }} />
        <Icon type="qq"   style={{ fontSize: 20, color: '#BFBFBF', marginLeft: 8 ,cursor: 'pointer'}}/>
        <Icon type="qq"  style={{ fontSize: 20, color: '#BFBFBF', marginLeft: 8,cursor: 'pointer' }}/>
      </div>
      <div className={indexStyles.bottomWholeRight}>
        {type === 'login'? ( <p><span>忘记密码？</span><span>|</span><span>注册登录</span></p>) : (<span>已有账户，直接登陆</span>)}
      </div>
    </div>
  );
};

BottomContent.propTypes = {
};

export default BottomContent;
