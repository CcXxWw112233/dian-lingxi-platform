import React from 'react';
import dva, { connect } from "dva/index"
import indexStyles from './index.less';
import MiniBoxNavigations from '../MiniBoxNavigations/index'
import BoardCommunication from './BoardCommunication/index'

const WorkbenchBoxContentModal = (props) => {
    const { workbenchBoxContentWapperModalStyle } = props;
    console.log(workbenchBoxContentWapperModalStyle);
    console.log("indexStyles",indexStyles.workbenchBoxContentModalWapper);

    return (

        <div className={indexStyles.workbenchBoxContentModalContainer}>
            <MiniBoxNavigations />
            <div className={indexStyles.workbenchBoxContentModalWapper} style={workbenchBoxContentWapperModalStyle ? workbenchBoxContentWapperModalStyle : {}}>
                <div className={indexStyles.workbenchBoxContentWapper}>

                    <BoardCommunication/>
                    
                </div>
            </div>
        </div>
    )
}

export default connect(({ simplemode: { workbenchBoxContentWapperModalStyle } }) => ({ workbenchBoxContentWapperModalStyle }))(WorkbenchBoxContentModal)
