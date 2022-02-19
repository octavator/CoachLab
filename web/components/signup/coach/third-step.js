import Stepper from "../stepper.js"

class DefaultThirdStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {}
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
  validate() {
    let required_keys = []
    let isValid = required_keys.every(key => {return this.state.form[key] != undefined})
    if (!isValid) this.props.showFlashMessage("error", "Veuillez renseigner tous les champs")
    return isValid
  }
  sendForm() {
    if (this.validate()) {
      this.props.update_form(this.state.form)
      this.props.send_form()
    }
  }
  render() {
    return (
      <div className="step-wrapper">
      <div className="first-step-wrapper">
        <form className="step-form" onSubmit={(e) => { e.preventDefault() }}>
          {/* <FileInput accept=".png,.jpeg,.jpg" text="Parcourir..." filename={this.state.filename} onChange={(e) => this.uploadFile(e)} extraClass="bg-white"
            label="Merci de télécharger une copie de votre pièce d'identité" /> */}
          <button onClick={() => { this.sendForm() }} className="cl-button cl-form-button bg-white">
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