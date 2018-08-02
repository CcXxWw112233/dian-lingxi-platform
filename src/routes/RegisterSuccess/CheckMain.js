import React from 'react';
import { Icon, Button } from 'antd'
import indexStyles from './index.less'

const CheckMain = () => {
  return (
    <div>
      <div className={indexStyles.checkCircle}>
        <Icon type="check" style={{fontSize: 30, color: '#ffffff', fontWeight:'Bold'}}/>
      </div>
      <div className={indexStyles.tip_1}>你的账户：hi@ericux.com 注册成功</div>
      <div className={indexStyles.tip_2}>激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮箱中的链接激活账户。</div>
      <div className={indexStyles.buttonOuter}>
        <Button type="primary" style={{height: 40,marginRight: 16}}>查看邮箱</Button><Button  style={{height: 40}}>返回登陆</Button>
      </div>
    </div>
  );
};

CheckMain.propTypes = {
};

export default CheckMain;
