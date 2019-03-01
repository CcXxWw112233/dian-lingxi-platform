import React from 'react'
import indexStyles from './index.less'
import WelcomProcess from './WelcomProcess'
import EditProcess from './EditProcess'
import ProcessStartConfirm from './ProcessStartConfirm'
import ProcessDetail from './ProcessDetail'

export default class ProcessIndex extends React.Component {
  state = {}
  render() {
    const { datas: { processPageFlagStep } } = this.props.model
    const filterPage = (processPageFlagStep) => {
      let containner = (<div></div>)
      switch (processPageFlagStep) {
        case '1':
          containner = (<WelcomProcess {...this.props}/>)
          break
        case '2':
          containner = (<EditProcess {...this.props}/>)
          break
        case '3':
          containner = (<ProcessStartConfirm {...this.props}></ProcessStartConfirm>)
          break
        case '4':
          containner = (<ProcessDetail {...this.props}/>)
          break
        default:
          containner = (<WelcomProcess {...this.props}/>)
          break
      }
      return containner
    }
    return (
      <div className={indexStyles.processOut}>
        {filterPage(processPageFlagStep)}
        {/*<WelcomProcess {...this.props}/>*/}
        {/*<EditProcess {...this.props}/>*/}
        {/*<ProcessStartConfirm {...this.props}></ProcessStartConfirm>*/}
        {/*<ProcessDetail {...this.props}/>*/}
      </div>
    )
  }
}
