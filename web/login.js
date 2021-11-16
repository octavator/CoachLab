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
    })
  }
  render() {
    let scheduleForm = [
      <div key="firstname" className="input-group"><label className="input-label">Prénom</label> <input type="text" className="infos-form-input firstname-input"/></div>,
      <div key="lastname" className="input-group"><label className="input-label">Nom de famille</label> <input type="text" className="infos-form-input lastname-input"/></div>,
      <div key="email" className="input-group"><label className="input-label">Adresse email</label> <input type="text" className="infos-form-input email-input"/></div>,
      <div key="isVideo" className="input-group radio-group"><label className="input-label">Visio-conférence</label><div className="radio-choices">
        <label className="radio-label" for="isVideo">Oui</label><input type="radio" defaultChecked value="true" id="isVideo" name="isVideo" className="cl-radio"/>
        <label className="radio-label" for="isNotVideo">Non</label><input id="isNotVideo" value="false" name="isVideo" type="radio" className="cl-radio"/>
      </div></div>,
      <div key="sendbtn" className="input-group"><div className="button-group"> <button onClick={() => { this.toggleModal() }} className="cl-button primary">Valider</button></div></div>
    ]
    return (
      <div className="login-wrapper">
        <h1 className="page-title">Connectez-vous</h1>
        <div className="login-content-wrapper infos-form">
          <div className="input-group">
            <label className="input-label">Adresse mail</label>
            <input onChange={(e) => { this.setState({email: e.target.value}) }} value={this.state.email} type="text"></input>
          </div>
          <div className="input-group">
            <label className="input-label">Mot de passe</label>
            <input onChange={(e) => { this.setState({password: e.target.value}) }} value={this.state.password} type="text"></input>
          </div>
          <div className="input-group">
            <div className="button-group">
              <button onClick={() => { this.sendForm() }} className="cl-button primary">
                Valider
              </button>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.login-wrapper');
ReactDOM.render(<Login/>, domContainer);