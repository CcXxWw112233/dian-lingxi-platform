
import DetailInfoModal from './DetailInfoModal'

const DetailInfo = (props) => {

  const { modalVisible, invitationType, invitationId, } = props
  return (
    <DetailInfoModal modalVisible={modalVisible} invitationType={invitationType} invitationId={invitationId} />
  )
}

export default DetailInfo
