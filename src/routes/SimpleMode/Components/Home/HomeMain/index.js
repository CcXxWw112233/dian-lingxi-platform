import React, { Component } from 'react'
import PropTypes from 'prop-types'
import globalStyles from '@/globalset/css/globalClassName.less'
import styles from './index.less'
import MainBoard from './MainBoard'
import FeatureBox from './FeatureBox'
import BoardFeatures from './BoardFeatures'
// import defaultWallpaperSrc from '@/assets/simplemode/acd42051256454f9b070300b8121eae2.png'
import { isColor } from '../../../../../utils/util'
import { connect } from 'dva'
import { ENV_BROWSER_APP } from '../../../../../globalset/clientCustorm'
import bgStylels from '../../../index.less'
import { debounce } from 'lodash'

const defaultWallpaperSrc = ''
@connect(mapStateToProps)
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bgStyle: {},
      /** 动画的class类名 */
      animateClassList: []
    }
    this.addAnimateClass = debounce(this.addAnimateClass, 100)
  }
  static propTypes = {
    prop: PropTypes
  }
  componentDidMount() {
    this.lazyLoadBgImg(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.lazyLoadBgImg(nextProps)
  }
  lazyLoadBgImg = (nextProps = {}) => {
    if (!ENV_BROWSER_APP) {
      this.setState({
        bgStyle: {}
      })
      return
    }
    const { currentUserWallpaperContent, userInfo = {} } = nextProps
    if (
      currentUserWallpaperContent == this.props.currentUserWallpaperContent &&
      !!currentUserWallpaperContent
    )
      return
    const _self = this
    const { show } = this.state
    const wallpaper = userInfo.id
      ? userInfo.wallpaper || defaultWallpaperSrc
      : ''
    const wallpaperContent = currentUserWallpaperContent
      ? currentUserWallpaperContent
      : wallpaper
    let bgStyle = {}
    if (isColor(wallpaperContent)) {
      bgStyle = { backgroundColor: wallpaperContent }
      this.setState({ bgStyle })
    } else {
      const temp = new Image()
      temp.src = wallpaperContent
      temp.onload = () => {
        _self.setState({
          bgStyle: { backgroundImage: `url(${wallpaperContent})` }
        })
      }
    }
  }
  setBgImg = () => {
    const { currentUserWallpaperContent, userInfo = {} } = this.props

    const { wallpaper = defaultWallpaperSrc } = userInfo
    const wallpaperContent = currentUserWallpaperContent
      ? currentUserWallpaperContent
      : wallpaper
    let bgStyle = {}
    if (isColor(wallpaperContent)) {
      bgStyle = { backgroundColor: wallpaperContent }
    } else {
      bgStyle = { backgroundImage: `url(${wallpaperContent})` }
    }
    // debugger
    return bgStyle
  }

  /** 动画结束的事件 */
  animateEnd = e => {
    // let { animateClassList } = this.state
    // animateClassList.shift()
    // this.setState({
    //   animateClassList
    // })
  }

  /**
   * 点击事件添加动画
   * @param {React.MouseEvent} e 点击事件
   * @param {*} val 点击的数据
   */
  addAnimateClass = (e, val) => {
    const { animateClassList = [] } = this.state
    const arr = animateClassList.concat(styles.animateToRight)
    this.setState(
      {
        animateClassList: arr
      },
      () => {
        setTimeout(() => {
          arr.shift()
          this.setState({
            animateClassList: arr
          })
        }, 500)
      }
    )
  }
  render() {
    return (
      <div className={`${styles.main_wapper}`}>
        <div className={styles.main_lf_wapper}>
          <MainBoard onClick={() => this.addAnimateClass()}></MainBoard>
        </div>

        <div className={styles.main_rt_Wapper}>
          {this.state.animateClassList.map((item, i) => {
            return (
              <div
                className={`${styles.animateLine} ${item}`}
                key={`item_${i + 1}`}
                onAnimationEnd={this.animateEnd}
              ></div>
            )
          })}

          <FeatureBox setHomeVisible={this.props.setHomeVisible} />
          <BoardFeatures />
        </div>
        <div
          className={`${styles.main_wapper_after} ${!ENV_BROWSER_APP &&
            bgStylels.index_bg}`}
          style={{
            ...this.state.bgStyle
            //  ...this.setBgImg()
          }}
        ></div>
      </div>
    )
  }
}
//  建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系
function mapStateToProps({
  simplemode: {
    simpleHeaderVisiable,
    setWapperCenter,
    currentUserWallpaperContent
  },
  technological: {
    datas: { userInfo = {} }
  }
}) {
  return {
    simpleHeaderVisiable,
    setWapperCenter,
    currentUserWallpaperContent,
    userInfo
  }
}
