import React from 'react';
import { Button } from 'antd'

const VerificationCode = (props) => {
  const { text, style } = props
  let initTime = text
  const buttonClick = (e) => {
    initTime = 60
    setTimeout(function () {
      initTime --
    }, 1000)
  }
  return (
    <Button style={style} onClick={buttonClick}>{initTime}</Button>
  );
};

VerificationCode.propTypes = {
};

export default VerificationCode;
