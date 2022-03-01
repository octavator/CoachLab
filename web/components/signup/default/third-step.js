import Stepper from "../stepper.js"
import {FileInput, TextInput, TextArea, Button} from "../../forms/inputs.js"

class DefaultThirdStep extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {},
      filename: "",
      coaches: [],
      show_coaches: false,
      search_coach_name: "",
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
  getMatchingCoaches(input) {
    if (input.length >= 3) {
      http.get(`/coach/search?coach_name=${encodeURIComponent(input)}`).then(res => {
        console.log(res.status)
        console.log(res.data)
        if (res.data.length > 0) this.setState({coaches: res.data, show_coaches: true})
      })
      .catch(err => {
        console.log(err.response)
        this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
      })  
    }
    this.setState({search_coach_name: input})
  }
  uploadFile(e) {
    console.log(e)
    const formData = new FormData()
    const filename = `avatar_${this.props.user_form.lastname}_${e.name}`.replace(" ", "-")
    formData.append( 
      "myFile", 
      e,
      filename
    )
    http.post("/inscription/file", formData).then(res => {
      if (res.status == 200) this.setState({filename: filename, form: {...this.state.form, avatar: filename}})
    })
  }
  validate() {
    let isValid = this.state.filename && (this.state.form.coaches || this.state.form.coach_desc)
    if (!isValid) this.props.showFlashMessage("error",
     "Veuillez télécharger une photo, et choisir un coach ou préciser votre besoin")
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
          <div className="step-title text-2">
            Recherchez-vous un coach en particulier ?
          </div>
          <div className="default-choices-container">
            <div className="default-choice-container">
              <div className="default-choice-label default-choice-label-yes text-2">
                Oui
              </div>
              <div className="select-input-autocomplete-container">
                <TextInput extraClass="text-3 autocomplete-text-input" required={true} value={this.state.search_coach_name} placeholder="Nom du coach" 
                 onChange={(e) => { this.getMatchingCoaches(e) }} />
                  <div className={"select-autocomplete-wrapper" + (this.state.show_coaches ? "" : " hidden")}>
                    {
                      this.state.coaches.map((coach) => {
                        return (
                          <div className="select-autocomplete-option text-3" onClick={() => {
                             this.setState({
                              search_coach_name: `${coach.firstname} ${coach.lastname}`,
                              form: {...this.state.form, coaches: [coach.id]},
                              show_coaches: false
                            }) 
                          }}>
                            {`${coach.firstname} ${coach.lastname}`}
                          </div>
                      )})
                    }
                
                 </div>
              </div>
            </div>
            <div className="default-choice-container">
              <div className="default-choice-label default-choice-label-no text-2">
                Non
              </div>
              <TextArea extraClass="text-3 " placeholder="Que recherchez-vous ? (100 caractères maximum)"
                onChange={(value) => {this.setState({form: {...this.state.form, coach_desc: value}})}} value={this.state.form.coach_desc} rows="10"/>
              <div className="default-choice-no-description text-4">
                Nous nous engageons à vous recontacter pour vous proposer les coachs certifiés les plus adaptés à votre demande<br/>
                <span className="default-choice-description-legend">(48h maximum par téléphone)</span>
              </div>
            </div>
          </div>
          <div className="picture-upload-container">
            <div className="file-upload-container">
              <FileInput accept=".png,.jpeg,.jpg" text="Parcourir..." filename={this.state.filename && this.state.filename.split("_").pop()}
               onChange={(e) => this.uploadFile(e)} extraClass="text-3 bg-white" label="Merci de télécharger une photo de vous" />
            </div>
          </div>
          <div className="page-button-container">
            <Button text="Suivant" onClick={() => { this.sendForm() }} extraClass="text-3 cl-button cl-form-button bg-white" />
          </div>
          <Stepper step="3" />
        </div>
    )
  }
}

export default DefaultThirdStep