import Navbar from './components/navbar.js'
import Flash from './components/flash.js'
import {TextInput, Button} from './components/forms/inputs.js'


class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: "",
        password: ""          
      },
      flashMessage: "",
      flashType: "",
      showFlash: false
    }
  }
  sendForm() {
    http.post("/sign-in", this.state.form)
    .then(res => {
      if (res.status == 200) window.location.href = "/bienvenue"
      else this.showFlashMessage("error", "Une erreur est survenue. Vérifiez vos identifiants.")
    })
    .catch(err => {
      this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  render() {
    return (
      <div>
        <Navbar user={{}}/>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <h1 className="page-title">Connectez-vous</h1>
        <div className="login-content-wrapper infos-form">
          <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.email} bold_label={true} label="Adresse mail"
            onChange={(e) => { this.setState({form: {...this.state.form, email: e}}) }} name="email" type="email" placeholder="Adresse mail" />
          <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.password} bold_label={true} label="Mot de passe"
            onChange={(e) => { this.setState({form: {...this.state.form, password: e}}) }} name="password" type="password" placeholder="Mot de passe" />
          <Button extraClass="text-3 mt-1 white-bg" onClick={() => { this.sendForm()}} text="Suivant" />
          <div className="sign-up-section text-2-5" onClick={() => {window.location.href = "/inscription"}}>
            <b>Pas encore de compte ? Cliquez-ici pour créer le votre</b>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.login-wrapper');
ReactDOM.render(<Login/>, domContainer);