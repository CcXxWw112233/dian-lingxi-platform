import React, { Component } from 'react';
import styles from './index.less';
import classNames from 'classnames/bind';
import withHover from './../HOC/withHover';

const cx = classNames.bind(styles);

class ZoomPicture extends Component {
  handleOperator = key => {
    console.log(key, 'operator key.');
  };
  renderOperatorBar = () => {
    const operatorList = [
      {
        label: '缩小',
        key: 'shrink',
        onClick: () => this.handleOperator('shrink')
      },
      {
        label: '100%',
        key: 'resetSize',
        onClick: () => this.handleOperator('resetSize')
      },
      {
        label: '放大',
        key: 'magnify',
        onClick: () => this.handleOperator('magnify')
      },
      {
        label: '添加圈点评论',
        key: 'addCommit',
        onClick: () => this.handleOperator('addCommit')
      },
      {
        label: '隐藏圈点',
        key: 'hideCommit',
        onClick: () => this.handleOperator('hideCommit')
      },
      {
        label: '全屏',
        key: 'fullScreen',
        onClick: () => this.handleOperator('fullScreen')
      }
    ];
    return (
      <div className={styles.operatorBarWrapper}>
        {operatorList.map(i => (
          <div key={i.key} onClick={i.onClick}>
            {i.label}
          </div>
        ))}
      </div>
    );
  };
  render() {
    const {
      imgInfo: { url },
      componentInfo: { width, height }
    } = this.props;
    if (!url) return null;
    const imgStyle = {};
    const wrapperStyle = {
      width,
      height
    };
    const { hovering } = this.props;
    console.log(hovering, 'hovering');
    return (
      <div className={styles.wrapper} style={wrapperStyle}>
        <div className={styles.content_wrapper}>
          <img
            className={styles.content_img}
            src={url}
            style={imgStyle}
            alt=""
          />
        </div>
        <div>{this.renderOperatorBar()}</div>
      </div>
    );
  }
}

ZoomPicture.defaultProps = {
  imgInfo: {}, //需要预览的图片信息,
  componentInfo: {
    //组件信息
    width: '600px',
    height: '600px'
  },
  //缩放步进
};

export default withHover(ZoomPicture);
