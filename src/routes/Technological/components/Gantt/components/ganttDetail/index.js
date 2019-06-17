import React from 'react'
import GanttDetailModal from '../../../../../../components/PublicDetailModal'
import MainContent from './MainContent'
export default class GanttDetail extends React.Component {
  state = {}

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {}

  render() {
    return(
      <div>
        <GanttDetailModal
          mainContent={<MainContent />}
        />
      </div>
    )
  }
}
