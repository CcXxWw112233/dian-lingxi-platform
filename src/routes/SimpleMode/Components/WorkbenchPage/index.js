import React, { Component } from "react";
import { connect } from "dva/index"
import indexStyles from './index.less'
import SimpleHeader from '../SimpleHeader/index'
import MyWorkbenchBoxs from '../MyWorkbenchBoxs/index'
import WallpaperSelect from '../WallpaperSelect/index'
import WorkbenchBoxSelect from '../WorkbenchBoxSelect/index'
import CreateNewBoard from '../CreateNewBoard/index'
import WorkbenchBoxContentModal from '..//WorkbenchBoxContentModal/index'
import { getLocationUrlQueryString } from '@/utils/util'


const getEffectOrReducerByName = name => `technological/${name}`

class WorkbenchPage extends Component {

    constructor(props) {
        super(props);
        let boxid = getLocationUrlQueryString("box");
        this.state = {
            currentSelectedWorkbenchBoxId: boxid || 0
        }
    }

    componentWillMount() {
        const { dispatch } = this.props;
        const { currentSelectedWorkbenchBoxId = 0 } = this.state;

        if (currentSelectedWorkbenchBoxId === 0) {
            dispatch({
                type: 'simplemode/routingJump',
                payload: {
                    route: '/technological/simplemode/home'
                }
            });
        }
    }

    render() {
        return (
            <WorkbenchBoxContentModal currentSelectedWorkbenchBoxId={this.state.currentSelectedWorkbenchBoxId} />
        )
    }
};

export default connect(({ simplemode: {

} }) => ({


}))(WorkbenchPage)