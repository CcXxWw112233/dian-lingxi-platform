import React from 'react'
import { MilestoneTotalHeight } from '../../constans'
import CanvasTitle from './CanvasTitle'
import styles from './index.less'

/** 运营总图的左侧项目和分组树形列表 */
export default class BoardGroupTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      top: 0
    }
  }
  componentDidMount() {}

  render() {
    const {
      datas = [],
      onMouseEnter,
      activeId,
      onMouseLeave,
      onMouseOut,
      onMouseOver
    } = this.props
    return (
      <div className={styles.board_group_container}>
        <div className={styles.container_title_top}>
          {/* 预留的title */}
          <CanvasTitle
            style={{ width: '100%', height: '100%', overflow: 'hidden' }}
          />
        </div>
        <div className={styles.container_content}>
          {datas.map(item => {
            return (
              <div
                onMouseEnter={() => onMouseEnter && onMouseEnter(item)}
                onMouseLeave={() => onMouseLeave && onMouseLeave()}
                onMouseOut={() => onMouseOut && onMouseOut()}
                onMouseOver={() => onMouseOver && onMouseOver(item)}
                className={`${styles.tree_data_tabs} ${
                  activeId === item.list_id ? styles.active : ''
                }`}
                key={item.list_id}
                style={{ height: item.height }}
              >
                {item.list_name}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
