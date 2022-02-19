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
  validate() {
    let required_keys = ["id_card"]
    let isValid = required_keys.every(key => {return this.state.form[key] != undefined})
    if (!isValid) this.props.showFlashMessage("error", "Veuillez renseigner tous les champs")
    return isValid
  }
  sendForm() {
    if (this.validate()) {
      this.props.update_form(this.state.form)
      this.props.change_step(3)
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
    this.setState({filename: e.name, form: {...this.state.form, id_card: "idcard_" + e.name}})
    http.post("/inscription/file", formData).then(res => {
      console.log(res)
    })
  }
  render() {
    return (
      <div className="step-wrapper">
        <div className="first-step-wrapper">
        <form className="step-form" onSubmit={(e) => { e.preventDefault() }}>
            <TextInput type="email" extraClass="cl-form-input" required={true} value={this.state.form.email} onChange={(e) => { this.setState({form: {...this.state.form, email: e}}) }} name="email" placeholder="Email" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.firstname} onChange={(e) => { this.setState({form: {...this.state.form, firstname: e}}) }} name="firstname" placeholder="Prénom" />
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.lastname} onChange={(e) => { this.setState({form: {...this.state.form, lastname: e}}) }} name="lastname" placeholder="Nom" />
            <TextInput type="password" extraClass="cl-form-input" required={true} value={this.state.form.password} onChange={(e) => { this.setState({form: {...this.state.form, password: e}}) }} name="password" placeholder="Mot de passe" />
            <TextInput type="password" extraClass="cl-form-input" required={true} value={this.state.form.password_check} onChange={(e) => { this.setState({form: {...this.state.form, password_check: e}}) }}  name="password_check" placeholder="Confirmez le mot de passe" />       
            <TextInput extraClass="cl-form-input" required={true} value={this.state.form.phone} onChange={(e) => { this.setState({form: {...this.state.form, phone: e}}) }} placeholder="Téléphone" name="phone" />
            <FileInput accept=".png,.jpeg,.jpg" text="Parcourir..." filename={this.state.filename} onChange={(e) => this.uploadFile(e)} extraClass="bg-white"
             label="Merci de télécharger une copie de votre pièce d'identité" />
            <button onClick={() => { this.sendForm() }} className="cl-button cl-form-button bg-white">
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
