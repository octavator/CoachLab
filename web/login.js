import Navbar from './navbar.js'
import {TextInput} from './components/forms/inputs.js'


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
      console.log(res.status)
      console.log(res.data)
      window.location.href = "/bienvenue";
    })
    .catch(err => {
      console.log(err)
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
        <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
        <h1 className="page-title text-2">Connectez-vous</h1>
        <div className="login-content-wrapper infos-form">
          <div className="input-group">
            <label className="input-label text-3">Adresse mail</label>
            <input className="cl-input text-3" onChange={(e) => { this.setState({form: {...this.state.form, email: e.target.value}}) }} value={this.state.form.email} name="email" type="email"></input>
          </div>
          <div className="input-group">
            <label className="input-label text-3">Mot de passe</label>
            <input className="cl-input text-3" onChange={(e) => { this.setState({form: {...this.state.form, password: e.target.value}}) }} value={this.state.form.password} name="password" type="password"></input>
          </div>
          <div className="input-group">
            <div className="button-group">
              <button onClick={() => { this.sendForm() }} className="cl-button text-3 primary">
                Valider
              </button>
            </div>
          </div>
        <div className="sign-up-section text-3" onClick={() => {window.location.href = "/inscription"}}>Cliquez-ici pour créer votre compte</div>
        </div>
      </div>
    )
  }
  /* 
          <div className="login-content-wrapper infos-form">
          <TextInput extraClass=" text-3 " 
          onChange={(value) => { this.setState({form: {...this.state.form, email: value}}) }}
          value={this.state.form.email} type="email" name="email" label="Adresse mail" />
          <TextInput extraClass=" text-3 " 
          onChange={(value) => { this.setState({form: {...this.state.form, password: value}}) }}
          value={this.state.form.password} type="password" name="password" label="Adresse mail" />

          <div className="button-group">
            <Button text="Valider" extraClass="cl-button text-3 primary" onClick={() => { this.sendForm()}} />
          </div>
        <div className="sign-up-section text-4" onClick={() => {window.location.href = "/inscription"}}>Cliquez-ici pour créer votre compte</div>

  */
}

const domContainer = document.querySelector('.login-wrapper');
ReactDOM.render(<Login/>, domContainer);