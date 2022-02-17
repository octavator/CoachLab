import Stepper from "../stepper.js"

class DefaultThirdStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="step-wrapper">
      <div className="first-step-wrapper">
        <form className="step-form">
          
          <button onClick={() => { this.props.update_form(this.state.form);this.props.send_form()}} className="cl-button cl-form-button bg-white">
            Suivant
          </button>
        </form>
      </div>
      <Stepper step="3" />
    </div>
    )
  }
}

export default DefaultThirdStep