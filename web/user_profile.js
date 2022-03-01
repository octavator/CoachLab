import Navbar from './navbar.js'

class UserProfile extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        showFlash: false,
        flashType: '',
        flashMessage: '',
        user: {
          email: "",
          firstname: "",
          lastname: ""
        },
        form: {
          email: "",
          firstname: "",
          lastname: ""
        }
      }
    }
    componentDidMount() {
      http.get("/me").then(res => {
        console.log(res.status)
        console.log(res.data)
        this.setState({user: res.data, form: res.data})
      })
    }
    sendForm() {
      http.post("/edit-infos", this.state.form)
      .then(res => {
        console.log(res.status)
        console.log(res.data)
        this.showFlashMessage("success", "Vos informations ont bien été mises à jour.")
      })
      .catch(err => {
        this.showFlashMessage("error", "Une erreur inattendue est survenue")
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
          <Navbar user={this.state.user} />
          <div className="infos-wrapper">
            <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
            <h1 className="page-title">Mes informations</h1>
            <div className="infos-content-wrapper infos-form">
              <div className="input-group">
                <label className="input-label">Nom</label>
                <input onChange={(e) => { this.setState({form: {...this.state.form, lastname: e.target.value}}) }} value={this.state.form.lastname} type="text"></input>
              </div>
              <div className="input-group">
                <label className="input-label">Prénom</label>
                <input onChange={(e) => { this.setState({form: {...this.state.form, firstname: e.target.value}}) }} value={this.state.form.firstname} type="text"></input>
              </div>
              <div className="input-group">
                <label className="input-label">Adresse mail</label>
                <input onChange={(e) => {this.setState({form: {...this.state.form, email: e.target.value}}) }} value={this.state.form.email} type="text"></input>
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
        </div>
      )
    }
  }
  
  const domContainer = document.querySelector('.user-profile');
  ReactDOM.render(<UserProfile/>, domContainer);