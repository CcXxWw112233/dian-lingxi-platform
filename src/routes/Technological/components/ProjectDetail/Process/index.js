import React from 'react'
import indexStyles from './index.less'
import WelcomProcess from './WelcomProcess'
import EditProcess from './EditProcess'
import ProcessStartConfirm from './ProcessStartConfirm'
import ProcessDetail from './ProcessDetail'

export default class ProcessIndex extends React.Component {
  state = {}
  render() {
    return (
      <div className={indexStyles.processOut}>
        {/*<WelcomProcess {...this.props}/>*/}
        <EditProcess {...this.props}/>
        {/*<ProcessStartConfirm {...this.props}></ProcessStartConfirm>*/}
        {/*<ProcessDetail {...this.props}/>*/}
      </div>
    )
  }
}
