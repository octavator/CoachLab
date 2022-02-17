import Stepper from "../stepper.js"
import {TextInput, Button} from "../../forms/inputs.js"

class DefaultSecondStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      flashMessage: "",
      flashType: "",
      showFlash: false
    }
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  validate() {
    let required_keys = ["mail", "password", "password_check", "firstname", "lastname", "phone"]
    let isValid = required_keys.every(key => {return this.state[key] != undefined})
    // if (!isValid) this.props.showFlashMessage("error", "Veuillez renseigner tous les champs")
    return isValid
  }
  sendForm(e) {
    if (this.validate()) {
      this.props.update_form(this.state.form) && this.props.change_step(3)
    }
  }
  render() {
    return (
      <div className="step-wrapper">
        <div className="first-step-wrapper">
          <form className="step-form" onSubmit={(e) => e.preventDefault()}>
            <TextInput type="email" extraClass="cl-form-input" required={true} value={this.state.form.mail} onChange={(e) => { this.setState({form: {...this.state.form, mail: e}}) }} name="email" placeholder="Email" />
            <TextInput type="password" extraClass="cl-form-input" required={true} value={this.state.form.password} onChange={(e) => { this.setState({form: {...this.state.form, password: e}}) }} name="password" placeholder="Mot de passe" />
            <TextInput type="password" extraClass="cl-form-input" required={true} value={this.state.form.password_check} onChange={(e) => { this.setState({form: {...this.state.form, password_check: e}}) }}  name="password_check" placeholder="Confirmez le mot de passe" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.firstname} onChange={(e) => { this.setState({form: {...this.state.form, firstname: e}}) }} name="firstname" placeholder="Prénom" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.lastname} onChange={(e) => { this.setState({form: {...this.state.form, lastname: e}}) }} name="lastname" placeholder="Nom" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.phone} onChange={(e) => { this.setState({form: {...this.state.form, phone: e}}) }} placeholder="Téléphone" name="phone" />
            <Button extraClass="cl-form-button bg-white" onClick={(e) => { this.sendForm(e)}} text="Suivant" />
          </form>
        </div>
        <Stepper step="2" />
      </div>
    )
  }
}

export default DefaultSecondStep