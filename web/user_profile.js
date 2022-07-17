import Navbar from './components/navbar.js'
import { NumberInput, TextInput } from './components/forms/inputs.js'

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
          lastname: "",
          session_price: "50"
        },
        form: {
          email: "",
          firstname: "",
          lastname: "",
          session_price: "50"
        }
      }
    }
    componentDidMount() {
      http.get("/me").then(res => {
        this.setState({user: res.data, form: {...res.data, session_price: "50"}})
      })
      .catch(err => {
        this.showFlashMessage("error", "Une erreur inattendue est survenue")
      })
    }
    sendForm() {
      if (this.state.user.role != "coach") delete this.state.form.session_price
      http.post("/edit-infos", this.state.form)
      .then(res => {
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
      console.log(this.state.form)
      return (
        <div>
          <Navbar user={this.state.user} />
          <div className="infos-wrapper">
            <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
            <h1 className="page-title">Mes informations</h1>
            <div className="infos-content-wrapper infos-form">
              <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.lastname} bold_label={true} label="Nom"
                onChange={(e) => { this.setState({form: {...this.state.form, lastname: e}}) }} name="lastname" placeholder="Nom" />
              <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.firstname} bold_label={true} label="Prenom"
                onChange={(e) => { this.setState({form: {...this.state.form, firstname: e}}) }} name="firstname" placeholder="Prenom" />
              <TextInput extraClass="white-bg cl-form-input text-3" required={true} value={this.state.form.email} bold_label={true} label="Adresse mail"
                onChange={(e) => { this.setState({form: {...this.state.form, email: e}}) }} name="email" placeholder="Adresse mail" />
              <div className={this.state.user.role != "coach" ? "hidden" : ""}>
                <NumberInput extraClass="white-bg cl-form-input text-3" required={false} value={this.state.form.session_price} bold_label={true} label="Prix d'une séance"
                onChange={(e) => { this.setState({form: {...this.state.form, session_price: e}}) }} name="session_price" max={500} min={10} />
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