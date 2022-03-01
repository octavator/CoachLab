import { TextInput, FileInput, TextArea, Button } from "../../forms/inputs.js"
import Stepper from "../stepper.js"

class DefaultThirdStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        specialties: [],
      },
      filenames: {},
    }
  }
  uploadFile(key, e) {
    const formData = new FormData()
    let new_filenames = {...this.state.filenames}
    let new_form = {...this.state.form}
    const filename = `${key}_${this.props.user_form.lastname}_${e.name}`.replace(" ", "-")
    new_filenames[key] = filename
    formData.append( 
      "myFile",
      e,
      filename
    )
    new_form[key] = filename
    http.post("/inscription/file", formData).then(res => {
      if (res.status == 200) this.setState({filenames: new_filenames, form: new_form})
      else  this.props.showFlashMessage("error", "Une erreur est survenue avec l'envoi de votre fichier.")
    })
  }
  updateSpecialty(value, index) {
    let new_specialties = this.state.form.specialties
    new_specialties[index] = value
    this.setState({form: {...this.state.form, specialties: new_specialties}}) 
  }
  validate() {
    let required_keys = []
    let isValid = required_keys.every(key => {return this.state.form[key] != undefined}) && this.state.form.specialties.length > 0
    if (!isValid) this.props.showFlashMessage("error", "Veuillez renseigner tous les champs")
    return isValid
  }
  sendForm() {
    if (this.validate()) {
      this.props.update_form(this.state.form, true)
    }
  }
  render() {
    return (
      <div className="step-wrapper">
      <div className="first-step-wrapper">
        <form className="step-form" onSubmit={(e) => { e.preventDefault() }}>
          <div className="step-sections-wrapper">
            <div className="step-section-wrapper ">
              <div className="step-section-label text-2">Quelles sont vos spécialités ?</div>
              <TextInput extraClass="cl-form-input  text-3" required={true} value={this.state.form.specialties[0]} 
               onChange={(e) => { this.updateSpecialty(e, 0) }} name="specialties_0" placeholder="" />
              <TextInput extraClass="cl-form-input  text-3" required={false} value={this.state.form.specialties[1]} 
               onChange={(e) => { this.updateSpecialty(e, 1) }} name="specialties_1" placeholder="" />
              <TextInput extraClass="cl-form-input  text-3" required={false} value={this.state.form.specialties[2]} 
               onChange={(e) => { this.updateSpecialty(e, 2) }} name="specialties_2" placeholder="" />
              <TextInput extraClass="cl-form-input  text-3" required={false} value={this.state.form.specialties[3]} 
               onChange={(e) => { this.updateSpecialty(e, 3) }} name="specialties_3" placeholder="" />
            </div>
            <div className="step-section-wrapper">
              <div className="step-section-label text-2">Merci de télécharger votre diplôme,<br/> certification et/ou tout document<br/> attestant de votre autorisation<br/> à pratiquer</div>
              <FileInput accept=".png,.jpeg,.jpg" text="Parcourir..." filename={this.state.filenames["certification"] && this.state.filenames.certification.split("_").pop()}
              onChange={(e) => this.uploadFile("certification", e)} extraClass="bg-white  text-3"/>
            </div>
            <div className="step-section-wrapper">
              <div className="step-section-label  text-2">Merci de télécharger une photo professionnelle</div>
              <FileInput accept=".png,.jpeg,.jpg" text="Parcourir..." filename={this.state.filenames["avatar"] && this.state.filenames.avatar.split("_").pop()}
              onChange={(e) => this.uploadFile("avatar", e)} extraClass="bg-white  text-3"/>
            </div>
          </div>
          <div className="step-sections-wrapper">
            <div className="step-section-wrapper">
              <div className="step-section-label  text-2">
                Présentez-vous brièvement <span className="">(100 caractères maximum)</span>
              </div>
              <TextArea value={this.state.form.desc} maxlength={100} onChange={(value) => {this.setState({form: {...this.state.form, desc: value}})}}/>
            </div>
            <div className="step-section-wrapper">
              <div className="step-section-label  text-2">
                Merci de télécharger une copie de votre RIB
              </div>
              <FileInput accept=".png,.jpeg,.jpg" text="Parcourir..." filename={this.state.filenames["rib"] && this.state.filenames.rib.split("_").pop()}
              onChange={(e) => this.uploadFile("rib", e)} extraClass="bg-white  text-3"/>
            </div>
            <Button extraClass="cl-button cl-form-button bg-white  text-3"
              onClick={() => { this.sendForm() }} text="Suivant" />
          </div>
        </form>
      </div>
      <Stepper step="3" />
    </div>
    )
  }
}

export default DefaultThirdStep