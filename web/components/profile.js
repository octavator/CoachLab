import Navbar from './navbar.js'
import Flash from './flash.js'
import { NumberInput, TextInput, Button } from './forms/inputs.js'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFlash: false,
      flashType: '',
      flashMessage: '',
      inviteMail: '',
      user: {
        email: "",
        firstname: "",
        lastname: "",
        session_price: "50"
      },
      form: {
        email: "",
        firstname: "",
        lastname: "",
        session_price: "50"
      }
    }
  }
  componentDidMount() {
    http.get("/api/me").then(res => {
      console.log("me")
      this.setState({user: res.data, form: {...this.state.form, ...res.data}})
    })
    .catch(err => {
      this.showFlashMessage("error", "Une erreur inattendue est survenue")
    })
  }
  sendForm() {
    if (this.state.user.role != "coach") delete this.state.form.session_price
    http.post("/edit-infos", this.state.form)
    .then(res => {
      this.showFlashMessage("success", "Vos informations ont bien été mises à jour.")
    })
    .catch(err => {
      this.showFlashMessage("error", "Une erreur inattendue est survenue")
    })
  }
  sendInviteMail() {
    if (this.state.inviteMail == "") return
    http.post("/signup-invite", {email: this.state.inviteMail}).then(res => {
      if (res.status == 200) {
        this.showFlashMessage("success", "L'invitation a été envoyée avec succès")
        this.setState({inviteMail: ""})  
      } else this.showFlashMessage("error", "Une erreur est survenue lors de l'envoi.")
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  render() {
    console.log(this.state.form)
    return (
      <div>
        <Navbar user={this.state.user} />
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="infos-wrapper">
          <h1 className="page-title">Mes informations</h1>
          <div className="infos-content-wrapper infos-form">
            <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.lastname} bold_label={true} label="Nom"
              onChange={(e) => { this.setState({form: {...this.state.form, lastname: e}}) }} name="lastname" placeholder="Nom" />
            <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.firstname} bold_label={true} label="Prenom"
              onChange={(e) => { this.setState({form: {...this.state.form, firstname: e}}) }} name="firstname" placeholder="Prenom" />
            <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.email} bold_label={true} label="Adresse mail"
              onChange={(e) => { this.setState({form: {...this.state.form, email: e}}) }} name="email" placeholder="Adresse mail" />
            <div className={this.state.user.role != "coach" ? "hidden" : ""}>
              <NumberInput extraClass="white-bg cl-form-input text-3" required={false} value={this.state.form.session_price} bold_label={true} label="Prix d'une séance (€)"
              onChange={(e) => { this.setState({form: {...this.state.form, session_price: e}}) }} name="session_price" max={500} min={10} />
            </div>
            <div className="input-group">
              <div className="button-group mb-2">
                <button onClick={() => { this.sendForm() }} className="cl-button">
                  Valider
                </button>
              </div>
            </div>

            <div className={this.state.user.role == "coach" ? `` : " hidden"}>
              <h2 className="page-title mt-2">Invitez vos coachés !</h2>
              <div className={"invite-mail-block"} >
                <TextInput type="email" extraClass="text-3 white-bg" required={true} value={this.state.inviteMail} 
                  onChange={(e) => { this.setState({inviteMail: e}) }} name="invite_mail" placeholder="Email du coaché" />
                <Button extraClass="text-3" onClick={() => { this.sendInviteMail()}} text="Suivant"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.user-profile');
ReactDOM.render(<Profile/>, domContainer);