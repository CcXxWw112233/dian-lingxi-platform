import React from 'react'
import PropTypes from 'prop-types'
import styles from './index.less'
import globalStyles from '@/globalset/css/globalClassName.less'

export default function Index(props) {
  const {
    selects = [],
    list_data = [],
    show_prefix,
    wrapper_styles = {},
    item_styles = {},
    targetclassname
  } = props
  const name = selects.reduce(
    function(total, current, cur_index) {
      const item = list_data.find(item => item.list_id == current) || {} //找到匹配项
      const { list_name } = item
      return total + `${cur_index !== 0 ? '/' : ''}${list_name}`
    },
    show_prefix || selects.length > 1 ? '@' : ''
  )
  return (
    <div
      title={name}
      className={styles.main}
      style={{ ...wrapper_styles }}
      data-targetclassname={targetclassname}
    >
      {selects.map((item, index) => {
        const list_name = list_data.find(item2 => item2.list_id == item)
          ?.list_name
        return (
          <div
            data-targetclassname={targetclassname}
            key={item}
            className={`${styles.item_name} ${globalStyles.global_ellipsis}`}
            style={{ ...item_styles }}
          >
            {(show_prefix || selects.length > 1) && (
              <>{index == 0 ? '@' : '/'}</>
            )}
            {list_name}
          </div>
        )
      })}
    </div>
  )
}

Index.propTypes = {
  selects: PropTypes.array, //已选
  list_data: PropTypes.array, //数据源
  wrapper_styles: PropTypes.object, //外部样式
  item_styles: PropTypes.object, //每个名称的样式
  targetclassname: PropTypes.string //为了兼容任务条引入
}
Index.defaultProps = {
  show_prefix: false, //不强制加前缀@
  wrapper_styles: {},
  item_styles: {}
}
