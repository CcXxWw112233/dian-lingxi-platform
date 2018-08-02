import React from 'react';
import styles from './index.less'

const Copyright = () => {
  return (
    <div className={styles.CopyrightOuter}>
      产品&nbsp;&nbsp;资源&nbsp;&nbsp;价格&nbsp;&nbsp;|&nbsp;&nbsp;©&nbsp;&nbsp;2018&nbsp;&nbsp;ProductName&nbsp;&nbsp;粤ICP备00000000号
    </div>
  );
};

Copyright.propTypes = {
};

export default Copyright;
