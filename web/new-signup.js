import {TextInput, FileInput} from "./components/forms/inputs.js"
import FirstStep from "./components/signup/first-step.js"
import CoachSecondStep from "./components/signup/coach/second-step.js"
import DefaultSecondStep from "./components/signup/default/second-step.js"
import CoachThirdStep from "./components/signup/coach/third-step.js"
import DefaultThirdStep from "./components/signup/default/third-step.js"
import Navbar from "./navbar.js"

class SignUp extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        form: {},
        steps: [1, 2, 3],
        step: 1,
        flashMessage: "",
        flashType: "",
        showFlash: false
      }
    }
    sendForm() {
      console.log(this.state.form)
      http.post("/sign-up", this.state.form).then(res => {
        console.log(res.status)
        console.log(res.data)
        window.location.href = "/connexion";
      })
      .catch(err => {
        console.log(err.response)
        this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
      })
    }
    setStateForm(new_form) {
      this.setState({form: {...this.state.form, ...new_form}})
    }
    showFlashMessage(type, message) {
      this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
        setTimeout(() => { this.setState({showFlash: false})}, 5000)
      })
    }
    render() {
      console.log("main form: ", this.state.form)
      return (
        <div className="clab-container">
          <Navbar blue_bg={this.state.step == 1 ? false : true} user={{}}/>
          <div className={"flash-message" + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
          {
            this.state.step == 1 ? 
              <FirstStep showFlashMessage={this.showFlashMessage} update_form={(data) => { this.setStateForm(data) }} change_step={(new_step) => { this.setState({step: new_step}) }} />
            :(
              this.state.form.user_role == "coach" ?
                (this.state.step == 2 ? 
                  <CoachSecondStep showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)} update_form={(data) => { this.setStateForm(data) }} change_step={(new_step) => { this.setState({step: new_step}) }} />
                : <CoachThirdStep showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)} send_form={() => this.sendForm()} update_form={(data) => { this.setStateForm(data) }} change_step={(new_step) => { this.setState({step: new_step}) }} />)
              : (this.state.step == 2 ? 
                  <DefaultSecondStep showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)} update_form={(data) => { this.setStateForm(data) }} change_step={(new_step) => { this.setState({step: new_step}) }} />
                : <DefaultThirdStep showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)} send_form={() => this.sendForm()} update_form={(data) => { this.setStateForm(data) }} change_step={(new_step) => { this.setState({step: new_step}) }} />)                
            )
          }
            {/* <TextInput value={this.state.form.firstname} onChange={(e) => { this.setState({form: {...this.state.form, firstname: e.target.value}}) }} label="Prénom" />
            <TextInput value={this.state.form.lastname} onChange={(e) => { this.setState({form: {...this.state.form, lastname: e.target.value}}) }} label="Nom" /> */}
        </div>
      )
    }
  }
  
  const domContainer = document.querySelector('.signup-wrapper');
  ReactDOM.render(<SignUp/>, domContainer);