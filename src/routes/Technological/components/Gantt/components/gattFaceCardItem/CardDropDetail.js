import styles from './index.less'
import React from 'react'
import globalStyles from '@/globalset/css/globalClassName.less'
import CheckItem from '@/components/CheckItem'
import AvatarList from '@/components/avatarList'
import { timestampToTime } from '@/utils/util.js'

const CardDropDetail = (props) => {
    const { name, is_realize, executors = [], start_time, due_time, time_span, width } = props
    const is_out_due_time = () => {
        if (!due_time) {
            return false
        }
        const now = new Date().getTime()
        const new_due_time = due_time.length < 13 ? due_time * 1000 : due_time
        return now > new_due_time
    }

    const filterDueTimeSpan = () => {
        let due_description = ''
        if (!!!due_time) {
            return {
                is_overdue: false,
                due_description
            }
        }
        const now = new Date().getTime()
        const new_start_time = start_time.toString().length > 10 ? Number(start_time) : Number(start_time) * 1000
        const new_due_time = due_time.toString().length > 10 ? Number(due_time) : Number(due_time) * 1000

        // 计算逾期
        const due_time_span = now - new_due_time
        let aready_due_time = due_time_span / (24 * 60 * 60 * 1000)
        const aready_due_date = Math.floor(aready_due_time)
        const aready_due_hour = ((aready_due_time - aready_due_date) * 24).toFixed(1)

        // 计算全长
        const start_due_time_span_time = new_due_time - new_start_time
        let start_due_time_span = start_due_time_span_time / (24 * 60 * 60 * 1000)
        const span_date = Math.floor(start_due_time_span)
        const span_hour = ((start_due_time_span - span_date) * 24).toFixed(1)
     
        if (due_time_span < 0) { //
            if(!!!start_time)  {
                due_description = ''
            } else {
                due_description =  `共${span_date}天${span_hour}小时`
            }
            return {
                is_overdue: false,
                due_description
            }
        } else {
            return {
                is_overdue: true,
                due_description: `已逾期${aready_due_date}天${aready_due_hour}小时`
            }
        }
    }

    return (
        <div className={styles.drop_card}>
            <div className={styles.triangle}></div>
            <div className={`${styles.specific_example_content}`}>
                <div className={`${styles.card_item_status}`} style={{ marginTop: is_realize == '1' ? -2 : 2 }}>
                    <CheckItem is_realize={is_realize} />
                </div>
                <div className={`${styles.card_item_name}`}>
                    {`${name}`}
                </div>
                <div>
                    <AvatarList users={executors} size={'small'} />
                </div>
            </div>
            <div className={styles.time_area}
                style={{ background: is_out_due_time() ? '#FF7875' : '#69C0FF' }}>
                {timestampToTime(start_time)}{due_time && '—'}{timestampToTime(due_time)}
                <span style={{ marginLeft: 6 }}>
                    {filterDueTimeSpan().due_description}
                </span>
            </div>
        </div>
    )
}
export default CardDropDetail