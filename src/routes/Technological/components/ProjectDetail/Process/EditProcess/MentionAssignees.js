
import React from 'react'
import { Mention } from 'antd'
const { toString, toContentState } = Mention;

export default class MentionAssignees extends React.Component {

  mentionOnChange(contentState){
    const str = toString(contentState)
    this.props.mentionOnChange(str)
  }

  render() {
    const { defaultAssignees, suggestions, mentionOnChange } = this.props

    return(
      <div>
      <Mention
        style={{ width: '100%', height: 70 }}
        onChange={this.mentionOnChange.bind(this)}
        value={toContentState(defaultAssignees)}
        suggestions={suggestions}
      />
    </div>)

  }
}
