import { Icon } from 'antd'
import PropTypes from 'prop-types'
import styles from './index.less'
export default function Index(props) {
  const { is_realize, setStatus } = props
  return (
    <span
      style={{ cursor: 'pointer' }}
      onClick={setStatus}
      className={is_realize ? styles.nomalCheckBoxActive : styles.nomalCheckBox}
    >
      <Icon
        type="check"
        style={{
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 'bold'
        }}
      />
    </span>
  )
}
Index.defaultProps = {
  setStatus() {}
}
Index.propTypes = {
  is_realize: PropTypes.bool,
  setStatus: PropTypes.func
}
