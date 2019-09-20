
import DetailInfoModal from './DetailInfoModal'

const DetailInfo = (props) => {

  const { modalVisible, dispatch } = props
  return (
    <DetailInfoModal modalVisible={modalVisible} dispatch={dispatch} />
  )

}

export default DetailInfo
