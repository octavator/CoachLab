import http from "./http.js"
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
  componentDidMount() {
    http.get("/api/me").then(res => {
      if (res.status == 200) return window.location.href = "/coachlab/bienvenue"
    })
  }
  sendForm() {
    http.post("/sign-in", this.state.form)
    .then(res => {
      if (res.status == 200) return window.location.href = "/coachlab/bienvenue"
      this.showFlashMessage("error", "Une erreur est survenue. Vérifiez vos identifiants.")
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState(
      {showFlash: true, flashMessage: message, flashType: type}, () =>
      setTimeout(() => this.setState({showFlash: false}), 5000)
    )
  }
  render() {
    return (
      <div>
        <Navbar user={{}}/>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <h1 className="page-title">Connectez-vous</h1>
        <div className="login-content-wrapper infos-form">

          <TextInput label="Adresse mail"
            onKeyDown={(e) => e.key === 'Enter' && this.sendForm() }
            extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.email} bold_label={true}
            onChange={(e) => this.setState({form: {...this.state.form, email: e}}) }
            name="email" type="email" placeholder="Adresse mail" />

          <TextInput label="Mot de passe"
            onKeyDown={(e) => e.key === 'Enter' && this.sendForm() }
            extraClass="white-bg cl-form-input text-3"
            required={true}
            value={this.state.form.password}
            bold_label={true}
            onChange={(e) => this.setState({form: {...this.state.form, password: e}}) }
            name="password" type="password" placeholder="Mot de passe" />

          <Button text="Suivant"
            extraClass="text-3 mt-1 white-bg" onClick={() => this.sendForm()} />

          <a className="sign-up-section text-2-5" href="/coachlab/inscription">
            <b>Je n'ai pas encore de compte</b>
          </a>

          <a className="sign-up-section text-3" href="/coachlab/nouveau-mot-de-passe">
            <b>J'ai oublié mon mot de passe !</b>
          </a>

        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.login-wrapper');
const root = ReactDOM.createRoot(domContainer)
root.render(<Login />)
