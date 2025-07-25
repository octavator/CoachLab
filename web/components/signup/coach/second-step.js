import Stepper from "../stepper.js"
import {TextInput, FileInput, Button} from "../../forms/inputs.js"

class CoachSecondStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      filename: ""
    }
  }
  validate() {
    let required_keys = ["idcard"]
    let isValid = required_keys.every(key => !!this.state.form[key])
    if (!isValid) this.props.showFlashMessage("error", "Veuillez télécharger votre carté d'identité")
    return isValid
  }
  sendForm() {
    if (!this.validate()) return
    this.props.update_form(this.state.form)
    this.props.change_step(3)
  }
  uploadFile(e) {
    const formData = new FormData()
    const filename = `idcard_${this.state.form.lastname}_${e.name}`.replace(" ", "-").replace("/", "")
    formData.append("myFile", e, filename)

    fetch("/inscription/file", {
      body: formData,
      method: "POST"
    }).then(res => {
      if (res.status == 200) return this.setState({filename: filename, form: {...this.state.form, idcard: filename}})
      this.props.showFlashMessage("error", "Une erreur est survenue lors de l'envoi de votre fichier.")
    }).catch(() => 
      this.props.showFlashMessage("error", "Une erreur est survenue lors du téléchargement")
    )
  }
  render() {
    return (
      <div className="step-wrapper">
        <div className="first-step-wrapper">
        <form className="step-form" onSubmit={(e) => e.preventDefault() }>
          <div className="step-sections-wrapper">
            <TextInput extraClass="cl-form-input  text-3" required={true} value={this.state.form.lastname} 
             onChange={(e) => this.setState({form: {...this.state.form, lastname: e}}) } name="lastname" placeholder="Nom" />
            <TextInput extraClass="cl-form-input  text-3" required={true} value={this.state.form.firstname}
             onChange={(e) => this.setState({form: {...this.state.form, firstname: e}}) } name="firstname" placeholder="Prénom" />
            <TextInput extraClass="cl-form-input  text-3" required={true} value={this.state.form.phone} 
             onChange={(e) => this.setState({form: {...this.state.form, phone: e}}) } placeholder="Téléphone" name="phone" />
            <TextInput type="email" extraClass="cl-form-input text-3" required={true} value={this.state.form.email} 
             onChange={(e) => this.setState({form: {...this.state.form, email: e}}) } name="email" placeholder="Email" />
            <TextInput type="password" extraClass="cl-form-input  text-3" required={true} value={this.state.form.password} 
             onChange={(e) => this.setState({form: {...this.state.form, password: e}}) } name="password" placeholder="Mot de passe" />
            <TextInput type="password" extraClass="cl-form-input  text-3" required={true} value={this.state.form.password_check} 
             onChange={(e) => this.setState({form: {...this.state.form, password_check: e}}) }  name="password_check" placeholder="Confirmez le mot de passe" />       
            <FileInput accept=".png,.jpeg,.jpg,.pdf" text="Parcourir..." filename={this.state.filename && this.state.filename.split("_").pop()}
             onChange={(e) => this.uploadFile(e)} extraClass="bg-white text-2 pt-2"
             label="Merci de télécharger une copie de votre pièce d'identité (recto)" name="file" />
            <Button onClick={() => this.sendForm()} extraClass="cl-button cl-form-button text-3 bg-white"
              text="Suivant"/>
          </div>
          </form>
        </div>
        <Stepper step="2" />
      </div>
    )
  }
}

export default CoachSecondStep
