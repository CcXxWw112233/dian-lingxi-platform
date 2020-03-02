import React from 'react';
import styles from './index.less';
import { InputNumber } from 'antd';

export default function ManhourSet(props) {

    return (
        <div className={styles.manhourSetWrapper}>
            <InputNumber size="large" min={0} max={999} defaultValue={0} value={props.value} onChange={props.onChange} />
            <span style={{marginLeft:'16px'}}>天</span>
        </div>
    )
}
