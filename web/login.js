import Navbar from './navbar.js'

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
        <div className={"flash-message" + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
        <h1 className="page-title">Connectez-vous</h1>
        <div className="login-content-wrapper infos-form">
          <div className="input-group">
            <label className="input-label">Adresse mail</label>
            <input onChange={(e) => { this.setState({form: {...this.state.form, email: e.target.value}}) }} value={this.state.form.email} name="email" type="text"></input>
          </div>
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <input onChange={(e) => { this.setState({form: {...this.state.form, password: e.target.value}}) }} value={this.state.form.password} name="password" type="password"></input>
          </div>
          <div className="input-group">
            <div className="button-group">
              <button onClick={() => { this.sendForm() }} className="cl-button primary">
                Valider
              </button>
            </div>
          </div>
        <div className="sign-up-section" onClick={() => {window.location.href = "/inscription"}}>Cliquez-ici pour créer votre compte</div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.login-wrapper');
ReactDOM.render(<Login/>, domContainer);