
class SignUp extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        email: "",
        password: "",
        firstname: "",
        lastname: ""
      }
    }
    sendForm() {
      http.post("/sign-up", this.state).then(res => {
        console.log(res.status)
        console.log(res.data)
      })
    }
    render() {
      return (
        <div className="login-wrapper">
          <h1 className="page-title">Inscrivez-vous</h1>
          <div className="login-content-wrapper infos-form">
            <div className="input-group">
              <label className="input-label">Adresse mail</label>
              <input onChange={(e) => { this.setState({email: e.target.value}) }} value={this.state.email} type="text"></input>
            </div>
            <div className="input-group">
              <label className="input-label">Mot de passe</label>
              <input onChange={(e) => { this.setState({password: e.target.value}) }} value={this.state.password} type="password"></input>
            </div>
            <div className="input-group">
              <label className="input-label">Prénom</label>
              <input onChange={(e) => { this.setState({firstname: e.target.value}) }} value={this.state.firstname} type="text"></input>
            </div>
            <div className="input-group">
              <label className="input-label">Nom</label>
              <input onChange={(e) => { this.setState({lastname: e.target.value}) }} value={this.state.lastname} type="text"></input>
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
  
  const domContainer = document.querySelector('.signup-wrapper');
  ReactDOM.render(<SignUp/>, domContainer);