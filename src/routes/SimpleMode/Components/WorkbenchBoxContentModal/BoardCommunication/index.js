import React from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';


const BoardCommunication = (props) => {

    return (

        <div className={indexStyles.boardCommunicationWapper}>
            <div className={indexStyles.indexCoverWapper}>
                <div className={indexStyles.icon}>
                    <img src='/src/assets/simplemode/communication_cover_icon@2x.png' style={{width: '80px', height: '84px'}} />
                </div>
                <div className={indexStyles.descriptionWapper}>
                    <div className={indexStyles.linkTitle}>选择 <a className={indexStyles.alink}>项目文件</a> 或 <a className={indexStyles.alink}>点击上传</a> 文件</div>
                    <div className={indexStyles.detailDescription}>选择或上传图片格式文件、PDF格式文件即可开启圈点交流</div>
                </div>
            </div>
        </div>
    )
}

export default connect(({ }) => ({}))(BoardCommunication)
