import styles from './index.less'
import React from 'react'
import { Tooltip } from 'antd'
import globalStyles from '@/globalset/css/globalClassName.less'
import CheckItem from '@/components/CheckItem'
import AvatarList from '@/components/avatarList'
import {timestampToTime} from '@/utils/util.js'
const CardDropDetail = (props) => {
    const { name, is_realize, executors = [], start_time, due_time, time_span, width, is_privilege } = props
    const is_out_due_time = () => {
        if(!due_time) {
            return false
        }
        const now = new Date().getTime()
        const new_due_time = due_time.length < 13?due_time * 1000: due_time
        return now > new_due_time
    }
    return (
        <div className={styles.drop_card}>
            <div className={styles.triangle}></div>
            <div className={`${styles.specific_example_content}`}>
                <div className={`${styles.card_item_status}`} style={{marginTop: is_realize == '1'?-2:2}}>
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
                style={{background: is_out_due_time()? '#FF7875': '#69C0FF' }}>
                {timestampToTime(start_time)}{due_time && '—'}{timestampToTime(due_time)}
            </div>
        </div>
    )
}
export default CardDropDetail