import {TextInput} from "./components/forms/inputs.js"
import Navbar from "./navbar.js"
import Flash from "./flash.js"

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        email: "",
        password: "",
        firstname: "",
        lastname: ""  
      },
      flashMessage: "",
      flashType: "",
      showFlash: false
    }
  }
  sendForm() {
    http.post("/sign-up", this.state.form).then(res => {
      console.log(res.status)
      console.log(res.data)
      window.location.href = "/connexion";
    })
    .catch(err => {
      console.log(err.response)
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
      <div>
        <Navbar user={{}}/>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <h1 className="page-title">Inscrivez-vous</h1>
        <div className="login-content-wrapper infos-form">
          <div className="input-group">
            <label className="input-label">Adresse mail</label>
            <input onChange={(e) => { this.setState({form: {...this.state.form, email: e.target.value}}) }} value={this.state.form.email} type="email"></input>
          </div>
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <input onChange={(e) => { this.setState({form: {...this.state.form, password: e.target.value}}) }} value={this.state.form.password} type="password"></input>
          </div>
          <TextInput value={this.state.form.firstname} onChange={(e) => { this.setState({form: {...this.state.form, firstname: e.target.value}}) }} label="Prénom" />
          <TextInput value={this.state.form.lastname} onChange={(e) => { this.setState({form: {...this.state.form, lastname: e.target.value}}) }} label="Nom" />
          <div className="input-group">
            <div className="button-group">
              <button onClick={() => { this.sendForm() }} className="cl-button">
                Valider
              </button>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
  
const domContainer = document.querySelector('.signup-wrapper');
ReactDOM.render(<SignUp/>, domContainer);