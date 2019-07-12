import dva, { connect } from "dva/index"
import indexStyles from './index.less'

const CreateNewBoard = (props) => {

    return(
        <div className={indexStyles.createNewBoardWapper}>
        </div>
    );
}

export default connect(({ }) => ({}))(CreateNewBoard)