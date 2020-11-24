import styles from './index.less'
import React from 'react'
import { Tooltip } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import CheckItem from '@/components/CheckItem'
import AvatarList from '@/components/avatarList'
import { timestampToTime, handleTimeStampToDate } from '@/utils/util.js'
import { filterDueTimeSpan } from '../../../ganttBusiness'
import {
  timestampToTimeNormal,
  transformTimestamp
} from '../../../../../../../utils/util'

const CardDropDetail = ({ list, dispatch, list_id }) => {
  const getCardDetail = ({ id, board_id }) => {
    dispatch({
      type: 'publicTaskDetailModal/updateDatas',
      payload: {
        card_id: id
      }
    })
    dispatch({
      type: 'gantt/updateDatas',
      payload: {
        selected_card_visible: true,
        current_list_group_id: list_id
      }
    })
    dispatch({
      type: 'workbenchPublicDatas/updateDatas',
      payload: {
        board_id
      }
    })
  }
  return (
    <div
      className={`${styles.drop_card} ${globalStyles.global_vertical_scrollbar}`}
    >
      {/* <div className={styles.triangle}></div> */}
      {list.map(value => {
        const {
          is_privilege,
          id,
          type,
          name,
          is_realize,
          executors = [],
          start_time,
          due_time,
          board_id,
          width,
          is_has_start_time,
          is_has_end_time
        } = value
        const new_due_time = transformTimestamp(due_time)
        const is_due =
          !!new_due_time &&
          new Date().getTime() > new_due_time &&
          value.is_realize == '0'
        if (is_due) {
          return (
            <div
              key={id}
              className={styles.specific_example_content_out}
              onClick={() => getCardDetail({ id, board_id })}
            >
              <div className={`${styles.specific_example_content}`}>
                <div
                  className={`${styles.card_item_name} ${globalStyles.global_ellipsis}`}
                >
                  {name}
                </div>
                <div className={`${styles.content_wapper}`}>
                  {timestampToTimeNormal(due_time)}
                </div>
                <div className={`${styles.content_wapper}`}>
                  {is_due && is_realize != '1' ? (
                    <span style={{ color: '#FF7875' }}>逾期</span>
                  ) : (
                    '截止'
                  )}
                </div>
                <div className={`${styles.content_wapper}`}>
                  <AvatarList users={executors} size={20} />
                </div>
              </div>
            </div>
          )
        } else {
          return <></>
        }
      })}
    </div>
  )
}
export default CardDropDetail
