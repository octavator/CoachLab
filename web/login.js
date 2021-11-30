class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: "",
      password: ""
    }
  }
  sendForm() {
    http.post("/sign-in", this.state).then(res => {
      console.log(res.status)
      console.log(res.data)
      window.location.href = "/";
      console.log("Connecté avec succès")
    })
  }
  render() {
    return (
      <div className="login-wrapper">
        <h1 className="page-title">Connectez-vous</h1>
        <div className="login-content-wrapper infos-form">
          <div className="input-group">
            <label className="input-label">Adresse mail</label>
            <input onChange={(e) => { this.setState({email: e.target.value}) }} value={this.state.email} name="email" type="text"></input>
          </div>
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <input onChange={(e) => { this.setState({password: e.target.value}) }} value={this.state.password} name="password" type="password"></input>
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