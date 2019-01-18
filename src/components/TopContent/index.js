import React from 'react';
import indexStyles from './index.less'
import logoImg from '../../assets/library/lingxi_logo.png'
//页面顶部样式，参见login
const TopContent = (props) => {
  const { text, productName, hidenDescription } = props
  return (
    <div>
      <div className={indexStyles.circle}>
        <img src={logoImg}/>
      </div>
      <div className={indexStyles.productName}>{text}{productName?(<span style={{marginLeft: 10}}>{productName}</span>):('')}</div>
      {!hidenDescription ? (<div className={indexStyles.description} >投资建设领域的全链条服务商</div>) : (
        <div style={{  marginBottom: 36}}></div>
      )}
    </div>
  );
};

TopContent.propTypes = {
};

export default TopContent;
