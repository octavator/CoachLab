import Stepper from "./stepper.js"

class FirstStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="first-step-wrapper">
        <div className="first-step-btns-wrapper" >
          <div className="first-step-coach-btn role-step-btn" onClick={() => { this.props.update_form({user_role: "coach"}); this.props.change_step(2) }} >
            <div className="role-step-btn-text">Vous êtes coach ?</div>
          </div>
          <div className="first-step-default-btn role-step-btn" onClick={() => { this.props.update_form({user_role: "default"}); this.props.change_step(2) }}>
            <div className="role-step-btn-text">Vous souhaitez vous faire coacher ?</div>
          </div>
        </div>
        <Stepper step="1" />
      </div>
    )
  }
}

export default FirstStep