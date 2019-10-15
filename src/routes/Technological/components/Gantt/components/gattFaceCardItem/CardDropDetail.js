import styles from './index.less'
import React from 'react'
import { Tooltip } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import CheckItem from '@/components/CheckItem'
import AvatarList from '@/components/avatarList'
import { timestampToTime, handleTimeStampToDate } from '@/utils/util.js'
import { filterDueTimeSpan } from '../../ganttBusiness'

const CardDropDetail = (props) => {
    const { is_privilege, name, is_realize, executors = [], start_time, due_time, time_span, width, is_has_start_time, is_has_end_time } = props

    const cal_time_span_params = {
        start_time, due_time, is_has_start_time, is_has_end_time, is_realize
    }

    const new_start_time = start_time.toString().length > 10 ? Number(start_time) : Number(start_time) * 1000
    const new_due_time = due_time && (due_time.toString().length > 10 ? Number(due_time) : Number(due_time) * 1000)

    return (
        <div className={styles.drop_card}>
            {/* <div className={styles.triangle}></div> */}
            <div className={`${styles.specific_example_content}`}>
                <div className={`${styles.card_item_status}`} style={{ marginTop: is_realize == '1' ? -2 : 2 }}>
                    <CheckItem is_realize={is_realize} />
                </div>
                <div className={`${styles.card_item_name}`}>
									{`${name}`}
									{
										!(is_privilege == '0') && (
											<Tooltip title="已开启访问控制" placement="top">
													<span style={{ color: 'rgba(0,0,0,0.50)', marginRight: '5px', cursor: 'pointer', marginLeft: '5px' }}>
													<span className={`${globalStyles.authTheme}`}>&#xe7ca;</span>
													</span>
											</Tooltip>
										)
									}
                </div>
                <div>
                    <AvatarList users={executors} size={'small'} />
                </div>
            </div>
            <div className={styles.time_area}
                style={{ background: filterDueTimeSpan(cal_time_span_params).is_overdue && is_realize == '0'? '#FF7875' : '#69C0FF' }}>
                {handleTimeStampToDate(new_start_time)}
                {due_time && '—'}
                {handleTimeStampToDate(new_due_time)}
                <span style={{ marginLeft: 6 }}>
                    {filterDueTimeSpan(cal_time_span_params).due_description}
                </span>
            </div>
        </div>
    )
}
export default CardDropDetail