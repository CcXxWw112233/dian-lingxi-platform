import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from '../SimpleHeader/index'
import MyWorkbenchBoxs from '../MyWorkbenchBoxs/index'
import WallpaperSelect from '../WallpaperSelect/index'
import WorkbenchBoxSelect from '../WorkbenchBoxSelect/index'
import CreateNewBoard from '../CreateNewBoard/index'
import WorkbenchBoxContentModal from '..//WorkbenchBoxContentModal/index'


const getEffectOrReducerByName = name => `technological/${name}`

class WorkbenchPage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {
            model, dispatch,
            simpleHeaderVisiable,
            myWorkbenchBoxsVisiable,
            wallpaperSelectVisiable,
            workbenchBoxSelectVisiable,
            createNewBoardVisiable,
            setWapperCenter,
            chatImVisiable
        } = this.props;

        return (
            <WorkbenchBoxContentModal />
        )
    }
};

export default connect(({ simplemode: {
   
} }) => ({
   

}))(WorkbenchPage)