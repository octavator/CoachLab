import Stepper from "../stepper.js"
import {FileInput, TextInput, TextArea} from "../../forms/inputs.js"

class DefaultThirdStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      filename: ""
    }
  }
  uploadFile(e) {
    console.log(e)
    const formData = new FormData()
    formData.append( 
      "myFile", 
      e,
      e.name
    )
    this.setState({filename: e.name, form: {...this.state.form, user_picture: formData}})
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
          <div className="step-title">
            Recherchez-vous un coach en particulier ?
          </div>
          <div className="default-choices-container">
            <div className="default-choice-container">
              <div className="default-choice-label default-choice-label-yes">
                Oui
              </div>
              <div className="file-upload-container">
                <TextInput extraClass="" required={true} value={this.state.form.coach_name} onChange={(e) => { this.setState({form: {...this.state.form, coach_name: e.target.value}}) }} placeholder="Nom du coach" />
              </div>
            </div>
            <div className="default-choice-container">
              <div className="default-choice-label default-choice-label-no">
                Non
              </div>
              <TextArea extraClass="" placeholder="Que recherchez-vous ? (100 caractères maximum)" value={this.state.form.coach_desc} rows="10"/>
              <div className="default-choice-no-description">
                Nous nous engageons à vous recontacter pour vous proposer les coachs certifiés les plus adaptés à votre demande<br/>
                <span className="default-choice-description-legend">(48h maximum, téléphone)</span>
              </div>
            </div>
          </div>
          <div className="picture-upload-container">
            <div className="picture-upload-label" >
              Merci de télécharger une photo de vous
            </div>
            <div className="file-upload-container">
              <FileInput accept=".png,.jpeg,.jpg" label="Parcourir..." filename={this.state.filename} onChange={(e) => this.uploadFile(e)} extraClass="bg-white"/>
            </div>
          </div>
          <div className="page-button-container">
            <button onClick={() => { this.props.update_form(this.state.form);this.props.send_form()}} className="cl-button cl-form-button bg-white">
              Suivant
            </button>
          </div>
          <Stepper step="3" />
        </div>
    )
  }
}

export default DefaultThirdStep