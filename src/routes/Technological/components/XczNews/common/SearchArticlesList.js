// 搜索的文章列表

import React, { Component } from 'react'
import commonStyles from './common.less'
import { Icon } from 'antd'
import { connect } from 'dva'

@connect(({ xczNews = [] }) => ({
  xczNews
}))
export default class SearchArticlesList extends Component {
  // 时间戳转换为日期格式
  getdate(timestamp) {
    var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y, M, D
    Y = date.getFullYear()
    M =
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1
    D = date.getDate()
    return Y + '-' + M + '-' + D + ' '
  }

  // 分页加载操作
  onScroll = () => {
    // console.log('滚动')
    // 滚动条在Y轴上的滚动距离
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    // console.log(scrollTop, '滚动条在Y轴上的滚动距离')
    // 文档的总高度
    const scrollHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight
    // console.log(scrollHeight, '文档高度')
    // 浏览器视口高度
    const windowHeight =
      document.documentElement.clientHeight || document.body.clientHeight
    // console.log(windowHeight, '浏览器视口高度')

    const { dispatch, xczNews, location } = this.props
    const {
      is_onscroll_do_paging,
      page_no,
      searchList = {},
      defaultArr = []
    } = xczNews
    let new_page_no = page_no || 0

    // scrollTop >= (scrollHeight - windowHeight)
    if (scrollHeight - 40 <= scrollTop + windowHeight) {
      // console.log('page_no', page_no)

      if (!is_onscroll_do_paging) {
        return false
      }

      dispatch({
        type: 'xczNews/updateDatas',
        payload: {
          is_onscroll_do_paging: false,
          page_no: ++new_page_no
          // defaultArr: defaultArr.concat([...defaultArr], [...searchList.records])
        }
      })
      if (location.pathname != '/technological/xczNews/area') {
        setTimeout(() => {
          dispatch({
            type: 'xczNews/getHeaderSearch',
            payload: {}
          })
        }, 300)
      } else {
        setTimeout(() => {
          dispatch({
            type: 'xczNews/getAreasArticles',
            payload: {}
          })
        }, 300)
      }
    }
  }

  // 监听滚动事件 防抖
  componentDidMount() {
    const { dispatch, xczNews } = this.props
    const { searchList = {}, defaultArr = [] } = xczNews
    this.scrollWrapper = this.refs.scrollWrapper

    // dispatch({
    //     type: 'xczNews/updateDatas',
    //     payload: {
    //         // defaultArr: [...searchList.records]
    //     }
    // })
    window.addEventListener('scroll', this.onScroll)
  }

  // 销毁滚动事件
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll)
  }

  // 点击返回的操作
  handleBack = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'xczNews/updateDatas',
      payload: {
        inputValue: '',
        hotFlag: true,
        highRiseFlag: true,
        authorityFlag: true, // 权威的开关
        dataBaseFlag: true, // 资料库的开关
        areaFlag: true
      }
    })
  }

  // 渲染 的组件
  renderInfo() {
    const { xczNews, location = {} } = this.props
    const {
      searchList = {},
      defaultArr = [],
      onSearchButton,
      contentVal,
      page_size,
      page_no
    } = xczNews
    const { total, records } = searchList

    let name = ''

    if (location.pathname == '/technological/xczNews/hot') {
      name = '热点'
    } else if (location.pathname == '/technological/xczNews/highRise') {
      name = '高层'
    } else if (location.pathname == '/technological/xczNews/authority') {
      name = '权威'
    } else if (location.pathname == '/technological/xczNews/dataBase') {
      name = '资料库'
    }
    return (
      // <div id="scrollWrapper" ref="scrollWrapper" style={{maxHeight: windowHeight, overflowY: 'auto', marginTop: '16px'}} className={globalStyles.global_vertical_scrollbar}>
      <div id="scrollWrapper" ref="scrollWrapper">
        <div className={commonStyles.mainContainer}>
          {location.pathname != '/technological/xczNews/area' &&
            contentVal &&
            onSearchButton && (
              <p style={{ marginLeft: 25, paddingTop: 15 }}>
                <i
                  style={{
                    fontStyle: 'normal',
                    display: 'inline-block',
                    marginRight: 10,
                    cursor: 'pointer',
                    fontSize: 12
                  }}
                  onClick={() => {
                    this.handleBack()
                  }}
                >
                  <Icon type="left" />
                  返回
                </i>
                <span>{`在"${name}"中含"${contentVal}"的全部结果共"${total}"条`}</span>
              </p>
            )}
          {defaultArr.map(item => {
            // console.log(item)
            return (
              <div className={commonStyles.info}>
                <div className={commonStyles.news}>
                  <div className={commonStyles.ul}>
                    {!item.hasImg ? (
                      <div className={commonStyles.li}>
                        <div className={commonStyles.right}>
                          <div className={commonStyles.message}>
                            <i className={commonStyles.dot}></i>
                            <a
                              className={commonStyles.text}
                              target="_blank"
                              rel="noreferrer"
                              href={item.origin_url}
                            >
                              {item.title}
                            </a>
                          </div>
                          <div className={commonStyles.dot_note}>
                            <span>{item.origin_name}</span>
                            <span>{this.getdate(item.publish_time)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={commonStyles.li}>
                        <div className={commonStyles.left}>
                          <img src="" />
                        </div>
                        <div className={commonStyles.right}>
                          <div className={commonStyles.message}>
                            <a
                              className={commonStyles.img_text}
                              target="_blank"
                              rel="noreferrer"
                              href={item.origin_url}
                            >
                              {item.title}
                            </a>
                          </div>
                          <div className={commonStyles.img_note}>
                            <span>{item.origin_name}</span>
                            <span>{this.getdate(item.publish_time)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          {searchList &&
          searchList.records &&
          searchList.records.length < page_size ? (
            <p style={{ textAlign: 'center', paddingTop: 20 }}>
              没有更多数据啦...
            </p>
          ) : (
            <p style={{ textAlign: 'center', paddingTop: 20 }}>疯狂加载中...</p>
          )}
        </div>
      </div>
    )
  }

  render() {
    return <div>{this.renderInfo()}</div>
  }
}
