import http from "../http.js"
import Navbar from './navbar.js'
import Flash from './flash.js'
import {Button} from "./forms/inputs.js"

class Invoice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showFlash: false,
      flashType: '',
      flashMessage: '',
      user: {
        firstname: "",
        lastname: "",
        role: "coach"
      },
      resa: {}
    }
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(document.location.search)
    const resa_id = urlParams.get("resa_id")

    http.get("/api/me")
    .then(userData => {
      http.get(`/api/reservation/${encodeURIComponent(resa_id)}`)
      .then(resaData => {
        this.setState({user: userData.data, resa: resaData.data})
      })
      .catch(err => {
        this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
      })  
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
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
        <Navbar user={this.state.user} blue_bg={true} />
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        Vous pouvez accéder à votre Facture pour la réservation du XXXX avec XXXX en cliquant sur ce bouton.
        <Button text="Télécharger" onClick={() => window.print()}/> 

        <div className="invoice-wrapper">
          <div className="seller-wrapper">
            <b>CoachLab</b> <br/>
            Adresse: <br/>
            SIREN: <br/>
            Téléphone: <br/> 
            Email: contact@coachlab.fr <br/>
          </div>
          <div className="buyer-wrapper">
            Prénom: {this.state.user.firstname}<br/>
            Nom: {this.state.user.lastname}<br/>
          </div>
          <div className="transaction-details-wrapper">
            <table>
              <tr>
                <th>Désignation du produit</th>
                <th>Quantité</th>
                <th>Prix HT</th>
                <th>Prix TTC</th>
              </tr>
              <tr>
                <td>{`Séance de coaching ${this.state.resa["isMulti"] ? "de groupe" : "individuelle"}`}</td>
                <td>1</td>
                <td>{`${((this.state.resa?.price || 50) * 0.8).toFixed(2)}€`}</td>
                <td>{`${(this.state.resa?.price || 50).toFixed(2)}€`}</td>
              </tr>
            </table>
          </div>
          <div className="transaction-summary">
            {`Total HT: ${((this.state.resa?.price || 50) * 0.8).toFixed(2)}€`} <br/>
            TVA: 20% <br/>
            {`Total TTC: ${(this.state.resa?.price || 50).toFixed(2)}€`} <br/>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.invoice');
const root = ReactDOM.createRoot(domContainer)
root.render(<Invoice />)