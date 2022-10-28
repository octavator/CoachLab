import Navbar from './navbar.js'
import Flash from './flash.js'

class UserInfos extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFlash: false,
      flashType: '',
      flashMessage: '',
      inviteMail: '',
      user: {
        email: "",
        firstname: "",
        lastname: "",
        role: "",
      },
      infos: {
        id: "",
        email: "",
        firstname: "",
        lastname: "",
        role: "",
        session_price: "",
      },
    }
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(document.location.search)
    const id = urlParams.get("id")
    http.get("/api/me").then(userData => {
      if (userData.status != 200) this.showFlashMessage("error", "Une erreur inattendue est survenue")
      http.get(`/api/user/${id}`).then(res => {
        this.setState({user: userData.data, infos: res.data})
      })
      .catch(err => {
        this.showFlashMessage("error", "Une erreur inattendue est survenue")
      })
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
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="infos-wrapper">
          <h1 className="page-title">Profil de {this.state.infos?.firstname} {this.state.infos?.lastname}</h1>
          <div className="infos-content-wrapper flex flex-column flex-center">
            <div className="profile-info bold mt-2">Nom</div>
            <div className="profile-info mt-1">{this.state.infos?.firstname}</div>
            <div className="profile-info bold mt-2">Email</div>
            <div className="profile-info mt-1">{this.state.infos?.email}</div>
            <div className="profile-info bold mt-2">Type</div>
            <div className="profile-info mt-1">{this.state.infos?.role == "coach" ? "Coach" : "Coaché"}</div>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.user-infos');
ReactDOM.render(<UserInfos/>, domContainer);