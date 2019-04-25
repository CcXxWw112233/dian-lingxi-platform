import React, { Component } from 'react';
import styles from './index.less';
import classNames from 'classnames/bind';
import yay from './../../assets/yay.jpg';

const cx = classNames.bind(styles);

class ZoomPicture extends Component {
  render() {
    const { pictureSrc } = this.props;
    const imgStyle = {};
    return (
      <div className={styles.wrapper}>
        <div className={styles.content_wrapper}>
          <img src={pictureSrc} style={imgStyle} alt='' />
        </div>
      </div>
    );
  }
}

ZoomPicture.defaultProps = {
  pictureSrc: yay
};

export default ZoomPicture;
