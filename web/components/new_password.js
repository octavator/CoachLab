import Navbar from './navbar.js'
import Flash from './flash.js'
import {TextInput, Button} from "./forms/inputs.js"

class NewPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFlash: false,
      flashType: '',
      flashMessage: '',
      email: ''
    }
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  sendForm() {
    http.get(`/api/send_password_reset?mail=${encodeURIComponent(this.state.email)}`).then(res => {
      this.showFlashMessage("success", "Un email vous a été envoyé.")
    })
    .catch(err => {
      this.showFlashMessage("error", "Une erreur inattendue est survenue")
    })
  }
  render() {
    return (
      <div>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="infos-wrapper flex flex-center flex-column">
          <TextInput type="email" extraClass="text-3 white-bg" required={true} value={this.state.email} 
            onChange={(e) => { this.setState({email: e}) }}  placeholder="coach@gmail.com"
             name="email" bold_label={true} label="Votre email" />
          <Button extraClass="text-3 white-bg cl-form-button" onClick={() => { this.sendForm()}} text="Envoyer" />
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.new-password');
ReactDOM.render(<NewPassword/>, domContainer);