import React from 'react'
import styles from './index.less'
import globalStyles from '../../../../../../../globalset/css/globalClassName.less'

export default class WhiteBoardPages extends React.Component {
  state = {}

  /**
   * 更新第几页
   * @param {*} val
   */
  setActivePage = val => {
    const { onChangePage } = this.props
    onChangePage && onChangePage(val)
  }

  removePage = val => {
    const { onDelete } = this.props
    onDelete && onDelete(val)
  }

  addPage = () => {
    const { onAddPage } = this.props
    onAddPage && onAddPage()
  }

  render() {
    const { pages } = this.props
    return (
      <div className={styles.page_container}>
        <div className={styles.pages_content}>
          {pages.map((item, index) => {
            return (
              <div
                className={`${styles.page_item} ${
                  +this.props.pageNumber === +item.index ? styles.active : ''
                }`}
                key={item.index}
                onClick={() => this.setActivePage(item)}
              >
                <span>{index + 1}</span>
                <div>
                  {item.url ? (
                    <img src={item.url} alt="" />
                  ) : (
                    <b>第{index + 1}页</b>
                  )}
                </div>
                <span
                  className={`${globalStyles.authTheme} ${styles.removePage}`}
                  onClick={e => {
                    e.stopPropagation()
                    this.removePage(item.index)
                  }}
                >
                  &#xe816;
                </span>
              </div>
            )
          })}
        </div>
        <div className={styles.addPageBtn} onClick={this.addPage}>
          <span className={globalStyles.authTheme}>&#xe7d1;</span> 加一页
        </div>
      </div>
    )
  }
}
