import React from 'react'
import indexStyles from './index.less'
import WelcomProcess from './WelcomProcess'

export default class ProcessIndex extends React.Component {
  state = {}
  render() {
    return (
      <div className={indexStyles.processOut}>
        <WelcomProcess {...this.props}/>

      </div>
    )
  }
}
