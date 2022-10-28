import Navbar from './components/navbar.js'
import Flash from './components/flash.js'

import {TextInput, Button} from "./components/forms/inputs.js"

class TempWelcomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      inviteMail: "",
      flashMessage: "",
      flashType: "",
      showFlash: false
    }
  }
  componentDidMount() {
    http.get("/api/me").then(res => {
      this.setState({user: res.data})
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
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
    return (
      <div className="login-wrapper">
        <Navbar user={this.state.user}/>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <h1 className="page-title welcome-page-title text-1">Vous êtes bien inscrit sur CoachLab !</h1>
        <div className="welcome-page-content text-2">
          Votre inscription a bien été prise en compte. <br/><br/>
          Vous serez prévenu par mail dès que la plateforme ouvrira officiellement ses portes.<br/><br/>
          Merci pour votre intérêt et à très bientôt sur CoachLab !
        </div>
        <div className={`invite-mail-block ${this.state.user.role == "coach" ? `` : " hidden"}`} >
          <TextInput type="email" extraClass="text-3 white-bg" required={true} value={this.state.inviteMail} 
            onChange={(e) => { this.setState({inviteMail: e}) }} name="invite_mail" placeholder="Invitez votre coaché" />
          <Button extraClass="text-3" onClick={() => { this.sendInviteMail()}} text="Suivant"/>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.temp-welcome-page-wrapper');
ReactDOM.render(<TempWelcomePage/>, domContainer);