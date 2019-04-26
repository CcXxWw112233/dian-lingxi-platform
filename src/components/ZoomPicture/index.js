import React, { Component } from 'react';
import { Tooltip, message } from 'antd';
import styles from './index.less';
import classNames from 'classnames/bind';
import withHover from './../HOC/withHover';

const cx = classNames.bind(styles);

class ZoomPicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgRealWidth: 0, //图片的实际宽度
      imgRealHeight: 0, //图片的实际高度
      imgWidth: 0, //图片应该显示的宽度
      imgHeight: 0, //图片应该显示的高度
      currentImgZoomPercent: '0%', //当前图片缩放的比例
      isCommentMode: false, //是否在图评模式
      isLongClick: false, //是否长按图片
    };
    //判定为长按的时长
    this.asLongClickTime = 500
    //图片点击信息
    this.imgClickInfo = {
      mouseDown: {},
      mouseUp: {},
    }
    //点击图片的 mouseDown 计时器
    this.timer = null
    //图片单击信息
    this.isMouseUp = false
  }
  loadImage = url => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Could not load image at ' + url));
      image.src = url;
    });
  };
  setCurrentImgSize = (opts = {}) => {
    this.setState({ ...opts });
  };
  genCurrentImgZoomPercent = (type = 'reset') => {
    const { currentImgZoomPercent } = this.state;
    const { zoomStep } = this.props;
    const getNumFromStr = (str = '') => {
      let num = 0;
      try {
        num = parseInt(str);
      } catch (e) {
        return 0;
      }
      return num;
    };
    const cond = {
      reset: '100%',
      sup: `${getNumFromStr(currentImgZoomPercent) + getNumFromStr(zoomStep)}%`,
      sub: `${getNumFromStr(currentImgZoomPercent) - getNumFromStr(zoomStep)}%`
    };
    return cond[type];
  };
  handleOperator = key => {
    const { imgRealWidth, imgRealHeight, currentImgZoomPercent } = this.state;
    const cond = {
      resetSize: () => {
        const isCurrentHasOnReset = currentImgZoomPercent === '100%';
        if (isCurrentHasOnReset) return;
        this.setCurrentImgSize({
          imgWidth: imgRealWidth,
          imgHeight: imgRealHeight,
          currentImgZoomPercent: this.genCurrentImgZoomPercent('reset')
        });
      },
      magnify: () => this.handleClickedImg(undefined, 'sup'),
      shrink: () => this.handleClickedImg(undefined, 'sub')
    };
    cond[key]();
    console.log(key, 'operator key.');
  };
  getMoreImgInfo = () => {
    const {
      imgInfo: { url }
    } = this.props;
    const getImgWidthAndHeight = image => {
      if (!(image && image.width)) return;

      const {
        componentInfo: { width: containerWidth, height: containerHeight }
      } = this.props;
      //根据图片的容器尺寸和图片的实际尺寸，确定图片显示的初始尺寸
      const { width, height } = image;
      const { imgInitDisplayWidth, imgInitDisplayHeight } = this.genImgInitSize(
        containerWidth,
        containerHeight,
        width,
        height
      );
      this.setState({
        imgRealWidth: image.width,
        imgRealHeight: image.height,
        imgWidth: imgInitDisplayWidth,
        imgHeight: imgInitDisplayHeight,
        currentImgZoomPercent: `${parseInt(
          (imgInitDisplayWidth / image.width) * 100
        )}%`
      });
    };
    this.loadImage(url)
      .then(image => getImgWidthAndHeight(image))
      .catch(err => console.log(err));
  };
  componentDidMount() {
    //由于后台返回的图片信息中，没有图片的实际宽高等信息，需要手动获取
    this.getMoreImgInfo();
  }
  renderOperatorBar = () => {
    const { hovering } = this.props;
    const { currentImgZoomPercent } = this.state;
    const operatorList = [
      {
        label: '缩小',
        key: 'shrink',
        onClick: () => this.handleOperator('shrink')
      },
      {
        label: currentImgZoomPercent,
        key: 'resetSize',
        toolTipText: '重置到100%大小',
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
    const wrapperClassName = cx({
      operatorBarWrapper: true,
      operatorBarWrapperOpacity: hovering ? false : true
    });
    return (
      <div className={wrapperClassName}>
        {operatorList.map(i => (
          <Tooltip title={i.toolTipText} key={i.key}>
            <div onClick={i.onClick} className={styles.operatorBarCell}>
              {i.label}
            </div>
          </Tooltip>
        ))}
      </div>
    );
  };
  updateImgSize = (imgWidth, imgHeight, zoomStep, type = 'sup') => {
    const { imgRealWidth, imgRealHeight } = this.state;
    //捕获缩放步进单位
    let getUnit = /^\d*(\S*)\s*$/.exec(zoomStep)[1];
    if (!getUnit) {
      //如果只是一个数字或纯数字的字符串那么按百分比处理
      getUnit = '%';
    }
    const unitCond = {
      px: (_, aspectRadio, which) => {
        //如果是 px 为单位， 那么就以宽高最大的为准
        //如果宽小于高
        if (aspectRadio <= 1) {
          if (which === 'height') {
            if (type === 'sub') {
              return imgHeight - parseFloat(zoomStep);
            }
            return imgHeight + parseFloat(zoomStep);
          }
          if (which === 'width') {
            if (type === 'sub') {
              return imgWidth - parseFloat(zoomStep) * aspectRadio;
            }
            return imgWidth + parseFloat(zoomStep) * aspectRadio;
          }
        } else {
          //如果宽大于高
          if (which === 'width') {
            if (type === 'sub') {
              return imgWidth - parseFloat(zoomStep);
            }
            return imgWidth + parseFloat(zoomStep);
          }
          if (which === 'height') {
            if (type === 'sub') {
              return imgHeight - parseFloat(zoomStep) / aspectRadio;
            }
            return imgHeight + parseFloat(zoomStep) / aspectRadio;
          }
        }
      },
      '%': (which, _) =>
        type === 'sup'
          ? which * (1 + parseFloat(zoomStep) / 100)
          : which * (1 - parseFloat(zoomStep) / 100)
    };
    const aspectRadio = imgRealWidth / imgRealHeight;

    //按比例缩放
      return {
        imgWidthUpdated: unitCond[getUnit](imgWidth, aspectRadio, 'width'),
        imgHeightUpdated: unitCond[getUnit](imgHeight, aspectRadio, 'height')
      };
  };
  handleImgOnMouseMove = e => {
    console.log(e, 'mousemove move move...........')
  }
  handleImgOnMouseUp = e => {
    if(e) e.stopPropagation()
    this.isMouseUp = true

    this.setState({
      isLongClick: false,
    })
    if(this.timer) {
      clearInterval(this.timer)
    }
    const storeMouseUpInfo = () => {
      this.imgClickInfo.mouseUp = {
        timeStamp: e.timeStamp,
        x: e.pageX,
        y: e.pageY
      }
    }
    storeMouseUpInfo()
    const isLongClick = ({mouseDown: {timeStamp: mouseDownTimeStamp}, mouseUp: {timeStamp: mouseUpTimeStamp}}, asLongClickTime) => {
      const timeBetween = mouseUpTimeStamp - mouseDownTimeStamp
      return timeBetween > asLongClickTime
    }
    // if(isLongClick(this.imgClickInfo, this.asLongClickTime)) {
    //   return
    // }
    this.handleClickedImg(undefined, 'sup')
    console.log('mouseup', e)
    console.log('mouseup timeStamp', e.timeStamp)
    console.log('mouseup x, y', e.pageX, e.pageY)
  }
  handleImgOnMouseDown = e => {
    if(e) e.stopPropagation()

    this.isMouseUp = false

    const storeMouseDownInfo = () => {
      this.imgClickInfo.mouseDown = {
        timeStamp: e.timeStamp,
        x: e.pageX,
        y: e.pageY
      }
    }
    storeMouseDownInfo()
    const isLongTimeClick = () => {
      let result = false
      const {mouseDown: {timeStamp}} = this.imgClickInfo
      let currentTime = timeStamp
      const that = this
      this.timer = setInterval(() => {
        currentTime += 50
        if(currentTime - timeStamp > this.asLongClickTime && !this.isMouseUp) {
          result = true
          that.setState({
            isLongClick: true,
          })
          clearInterval(this.timer)
        }
      }, 50)
    }
    isLongTimeClick()
    console.log('mousedown timeStamp', e.timeStamp)
    console.log('mousedown x, y', e.pageX, e.pageY)
  }
  handleClickedImg = (e, type = 'sup') => {
    if (e) e.stopPropagation();
    const { zoomStep, zoomMax } = this.props;
    const { imgWidth, imgHeight, currentImgZoomPercent } = this.state;

    //判断图片是否可以进一步缩放
    const isCanUpdateImgSize = (currentImgZoomPercent, zoomStep, zoomMax, type) => {
      const enoughSmallPrompt = '不能缩到更小了';
      const enoughBigPrompt = '已经放大最大了'
    const isCurrentImgZoomIsEnoughSmall = (
      currentImgZoomPercent,
      zoomStep,
      type
    ) =>
      parseInt(currentImgZoomPercent) <= parseInt(zoomStep) && type === 'sub';
    const isCurrentImgZoomIsEnoughBig = (currentImgZoomPercent, zoomStep, zoomMax, type) =>
      (parseInt(zoomMax) - parseInt(currentImgZoomPercent)) <= parseInt(zoomStep) && type === 'sup'
    if (isCurrentImgZoomIsEnoughSmall(currentImgZoomPercent, zoomStep, type)) {
      message.info(enoughSmallPrompt);
      return false;
    }
    if(isCurrentImgZoomIsEnoughBig(currentImgZoomPercent, zoomStep, zoomMax, type)) {
      message.info(enoughBigPrompt)
      return false
    }
    return true
    }

    if(!isCanUpdateImgSize(currentImgZoomPercent, zoomStep, zoomMax, type)) {
      return
    }

    const { imgWidthUpdated, imgHeightUpdated } = this.updateImgSize(
      imgWidth,
      imgHeight,
      zoomStep,
      type
    );
    this.setCurrentImgSize({
      imgWidth: imgWidthUpdated,
      imgHeight: imgHeightUpdated,
      currentImgZoomPercent: this.genCurrentImgZoomPercent(type)
    });
  };
  genImgInitSize = (
    containerWidth,
    containerHeight,
    imgRealWidth,
    imgRealHeight
  ) => {
    //容器的内边距
    const containerPadding = 20;
    //从字符串中解析数字，因为输入可能是 '600px' 之类的字符串
    const parseNum = str => parseFloat(str);

    //图片宽高比
    const aspectRadio = parseNum(imgRealWidth) / parseNum(imgRealHeight);

    const isImgWidthBiggerThanHeight = (width, height) => width >= height;

    //确定图片的宽高，以较长的边为准
    if (isImgWidthBiggerThanHeight(imgRealWidth, imgRealHeight)) {
      const imgInitDisplayWidth =
        parseNum(containerWidth) - containerPadding * 2;
      return {
        imgInitDisplayWidth,
        imgInitDisplayHeight: imgInitDisplayWidth / aspectRadio
      };
    }
    const imgInitDisplayHeight =
      parseNum(containerHeight) - containerPadding * 2;
    return {
      imgInitDisplayWidth: imgInitDisplayHeight * aspectRadio,
      imgInitDisplayHeight
    };
  };
  renderImg = () => {
    const {
      imgInfo: { url }
    } = this.props;
    const { isCommentMode, imgWidth, imgHeight, isLongClick } = this.state;
    const imgStyle = {
      cursor: isCommentMode ? 'crosshair' : isLongClick ? 'grab' : 'zoom-in',
      width: imgWidth,
      height: imgHeight
    };
    const className = {
      content_img: true,
      content_img_cursor_grab: isLongClick ? true : false,
    }
    return (
      <>
        <img
          // onClick={e => this.handleClickedImg(e)}
          onMouseDown={e => this.handleImgOnMouseDown(e)}
          onMouseUp={e => this.handleImgOnMouseUp(e)}
          // onMouseMove={e => this.handleImgOnMouseMove(e)}
          className={className}
          src={url}
          style={imgStyle}
          alt=""
        />
      </>
    );
  };
  render() {
    const {
      imgInfo: { url },
      componentInfo: { width, height }
    } = this.props;
    const {imgWidth, imgHeight} = this.state
    if (!url) return null;
    const wrapperStyle = {
      width,
      height,
    };
    const containerWidthNum = parseFloat(width)
    const containerHeightNum = parseFloat(height)
    const imgWrapperStyle = {
      width: `${imgWidth}px`,
      height: `${imgHeight}px`,
      marginLeft: `${imgWidth > containerWidthNum ? 0 : (containerWidthNum - imgWidth - 4) / 2}px`,
      marginRight: `${imgWidth > containerWidthNum ? 0 : (containerWidthNum - imgWidth - 4) / 2}px`,
      marginTop: `${imgHeight > containerHeightNum ? 0 : (containerHeightNum - imgHeight - 4) / 2}px`,
      marginBottom: `${imgHeight > containerHeightNum ? 0 : (containerHeightNum - imgHeight - 4) / 2}px`,
    }
    return (
      <div className={styles.wrapper} style={wrapperStyle}>
        <div className={styles.content_wrapper}>
        <div className={styles.img_wrapper} style={imgWrapperStyle}>
        {this.renderImg()}
        </div>
        </div>
        <>{this.renderOperatorBar()}</>
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
  zoomStep: '10%', //缩放步进,每次点击放大缩小，图片变化的比例
  zoomMax: '500%', //最大的放大倍数
};

export default withHover(ZoomPicture);
