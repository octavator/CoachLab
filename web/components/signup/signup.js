import http from "../../http.js"
import FirstStep from "./first-step.js"
import CoachSecondStep from "./coach/second-step.js"
import DefaultSecondStep from "./default/second-step.js"
import CoachThirdStep from "./coach/third-step.js"
import DefaultThirdStep from "./default/third-step.js"
import Navbar from "../navbar.js"
import Flash from "../flash.js"

class SignUp extends React.Component {
    constructor(props) {
      super(props)
      const urlParams = new URLSearchParams(document.location.search)
      const role = urlParams.get("role")
      const coach_id = urlParams.get("coach")
      let form = role && coach_id ? {role: role, coaches: [coach_id]} : {coaches: []}
      let step = role ? 2 : 1
      this.state = {
        form: form,
        steps: [1, 2, 3],
        step: step,
        flashMessage: "",
        flashType: "",
        showFlash: false
      }
    }
    sendForm() {
      http.post("/sign-up", this.state.form)
      .then(res => {
        if (res.status == 200) return window.location.href = "/coachlab/bienvenue"
        this.showFlashMessage("error", "Une erreur inattendue est survenue.") 
      })
      .catch(err =>
        this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
      )
    }
    setStateForm(new_form, is_complete = false) {
      if (!is_complete) return this.setState({form: {...this.state.form, ...new_form}})
      this.setState({form: {...this.state.form, ...new_form}}, () => this.sendForm())
    }
    showFlashMessage(type, message) {
      this.setState({showFlash: true, flashMessage: message, flashType: type}, () =>
        setTimeout(() => this.setState({showFlash: false}), 5000)
      )
    }
    render() {
      return (
        <div className="clab-container">
          <Navbar blue_bg={this.state.step == 1 ? false : true} user={{}}/>
          <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
          {
            this.state.step == 1 ? 
              <FirstStep showFlashMessage={this.showFlashMessage}
               update_form={(data) => this.setStateForm(data) }
               change_step={(new_step) => this.setState({step: new_step}) } />
            : (
              this.state.form.role == "coach" ?
                (this.state.step == 2 ? 
                  <CoachSecondStep user_form={this.state.form}
                   showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)}
                   update_form={(data, is_complete) => this.setStateForm(data, is_complete) }
                   change_step={(new_step) => this.setState({step: new_step}) } />
                : <CoachThirdStep user_form={this.state.form}
                   showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)}
                   update_form={(data, is_complete) => this.setStateForm(data, is_complete) }
                   change_step={(new_step) => this.setState({step: new_step}) } />
                )
              : (this.state.step == 2 ? 
                  <DefaultSecondStep user_form={this.state.form}
                   showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)} 
                   update_form={(data, is_complete = false) => this.setStateForm(data, is_complete) } 
                   change_step={(new_step) => this.setState({step: new_step}) } 
                  />
                : <DefaultThirdStep user_form={this.state.form}
                   showFlashMessage={(type, msg) => this.showFlashMessage(type, msg)}  
                   update_form={(data, is_complete) => this.setStateForm(data, is_complete) }
                   change_step={(new_step) => this.setState({step: new_step}) }
                  />
              )
            )
          }
        </div>
      )
    }
  }
  
  const domContainer = document.querySelector('.signup-wrapper');
  const root = ReactDOM.createRoot(domContainer)
  root.render(<SignUp />)

  export default SignUp