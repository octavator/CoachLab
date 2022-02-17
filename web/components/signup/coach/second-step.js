import Stepper from "../stepper.js"
import {TextInput, FileInput} from "../../forms/inputs.js"

class CoachSecondStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      filename: ""
    }
  }
  uploadFile(e) {
    console.log(e)
    console.log(e.name)
    const formData = new FormData()
    formData.append( 
      "myFile", 
      e,
      e.name
    )
    this.setState({filename: e.name, form: {...this.state.form, id_card: formData}})
    http.post("/inscription/file", formData).then(res => {
      console.log(res)
    })
  }
  render() {
    return (
      <div className="step-wrapper">
        <div className="first-step-wrapper">
          <form className="step-form">
            <TextInput type="email" extraClass="cl-form-input" required={true} value={this.state.form.mail} onChange={(e) => { this.setState({form: {...this.state.form, mail: e}}) }} name="email" placeholder="Email" />
            <TextInput type="password" extraClass="cl-form-input" required={true} value={this.state.form.password} onChange={(e) => { this.setState({form: {...this.state.form, password: e}}) }} name="password" placeholder="Mot de passe" />
            <TextInput type="password" extraClass="cl-form-input" required={true} value={this.state.form.password_check} onChange={(e) => { this.setState({form: {...this.state.form, password_check: e}}) }}  name="password_check" placeholder="Confirmez le mot de passe" />            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.firstname} onChange={(e) => { this.setState({form: {...this.state.form, firstname: e}}) }} name="firstname" placeholder="Prénom" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.lastname} onChange={(e) => { this.setState({form: {...this.state.form, lastname: e}}) }} name="lastname" placeholder="Nom" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.phone} onChange={(e) => { this.setState({form: {...this.state.form, phone: e}}) }} placeholder="Téléphone" name="phone" />
            <FileInput accept=".png,.jpeg,.jpg" label="Parcourir..." filename={this.state.filename} onChange={(e) => this.uploadFile(e)} extraClass="bg-white"/>
            <button onClick={() => { this.props.update_form(this.state.form); this.props.change_step(3) }} className="cl-button cl-form-button bg-white">
              Suivant
            </button>
          </form>
        </div>
        <Stepper step="2" />
      </div>
    )
  }
}

export default CoachSecondStep
