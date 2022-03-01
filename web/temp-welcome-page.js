import Navbar from './navbar.js'

class TempWelcomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {},
      flashMessage: "",
      flashType: "",
      showFlash: false
    }
  }
  componentDidMount() {
    http.get("/me").then(res => {
      console.log(res.status)
      console.log(res.data)
      this.setState({user: res.data})
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  render() {
    return (
      <div className="login-wrapper">
        <Navbar user={this.state.user}/>
        <h1 className="page-title welcome-page-title text-1">Vous êtes bien inscrit sur CoachLab !</h1>
        <div className="welcome-page-content text-2">
          Votre inscription a bien été prise en compte. <br/><br/>
          Vous serez prévenu par mail dès que la plateforme ouvrira officiellement ses portes.<br/><br/>
          Merci pour votre intérêt et à très bientôt sur CoachLab !
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.temp-welcome-page-wrapper');
ReactDOM.render(<TempWelcomePage/>, domContainer);