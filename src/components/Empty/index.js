import * as React from 'react'
import styles from './index.less'

/**
 * 空状态的组件
 * @example
 * <Empty description="暂无数据" imageStyle={{width: 300}} image={emptyImage}/>
 */
export default props => {
  const { image, imageStyle, description = '暂无数据' } = props
  return (
    <div className={styles.emptyContainer}>
      <div className={styles.content}>
        <div className={styles.emptyContainerImage}>
          <img
            src={image || require('../../assets/notdata.png')}
            style={{ imageStyle }}
          />
        </div>
        <div className={styles.description}>{description}</div>
      </div>
    </div>
  )
}
