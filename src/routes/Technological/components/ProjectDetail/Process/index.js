import React from 'react'
import indexStyles from './index.less'
import WelcomProcess from './WelcomProcess'
import EditProcess from './EditProcess'

export default class ProcessIndex extends React.Component {
  state = {}
  render() {
    return (
      <div className={indexStyles.processOut}>
        {/*<WelcomProcess {...this.props}/>*/}
        <EditProcess {...this.props}/>
      </div>
    )
  }
}
