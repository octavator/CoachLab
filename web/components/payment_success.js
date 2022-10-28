import Navbar from './navbar.js'
import Flash from './flash.js'

//@TODO: use Stribe webhooks with signatures instead of API call w/ query params (unsecured)

class PaymentSuccess extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        firstname: "",
        lastname: "",
        role: "default"
      },
      showFlash: false,
      flashType: '',
      flashMessage: '',
      reservation: {}
    }
  }
  componentDidMount() {
    window.location.href = "/mes_sessions"

    //Unused for now
    const urlParams = new URLSearchParams(document.location.search)
    const resa_id = urlParams.get("id")
    http.get("/api/me").then(userData => {
      this.setState({user: userData.data}, () => {
        http.get(`/api/reservation/${encodeURIComponent(resa_id)}`).then(res => {
          this.setState({reservation: res.data})
        })
      })
    }).catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => this.setState({showFlash: false}), 5000)
    })
  }
  render() {
    let date = this.state.reservation.id && this.state.reservation.id.split(" ")[0] || ""
    let time = this.state.reservation.id && this.state.reservation.id.split(" ")[1].split("+")[0] || ""
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="">
          Votre paiement a bien été effectué. <br/>
          Vous êtes maintenant inscrit au coaching avec {this.state.reservation.coach_name} pour le {date} à {time}.
          Vous allez être redirigé vers votre page de coachings.
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<PaymentSuccess/>, domContainer);