//页面顶部样式，参见注册成功后
import React from 'react';
import indexStyles from './index.less'

const TopContentTwo = (props) => {
  const { text, productName } = props
  return (
    <div>
      <div className={indexStyles.circleDec}>
        <div className={indexStyles.circle}></div>
        <div className={indexStyles.productName}>productName</div>
      </div>
      <div className={indexStyles.description}>投资建设领域的全链条服务商</div>
    </div>
  );
};

TopContentTwo.propTypes = {
};

export default TopContentTwo;
