import Modal from '../modal.js'
import {TextInput, Button} from '../forms/inputs.js'

class ShowResaModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sessionTitle: this.props.appointment_detailed?.sessionTitle || "",
      address: this.props.appointment_detailed?.address || "",
      appointment_detailed: {},
      coached_ids: this.props.appointment_detailed?.coached_ids || [],
      search_user_name: "",
      show_users: false,
      matching_users: []
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.appointment_detailed !== this.props.appointment_detailed) {
      this.setState({
        address: this.props.appointment_detailed?.address,
        sessionTitle: this.props.appointment_detailed?.sessionTitle,
        coached_ids: this.props.appointment_detailed?.coached_ids
      })
    }
  }
  buildVideoId() {
    return (!this.props.appointment_detailed.id ? undefined
     : `/video?roomId=${encodeURIComponent(this.props.appointment_detailed.id)}`)
  }
  subscribeResa() {
    http.get(`/api/subscribe-resa?id=${this.props.appointment_detailed.id}`)
    .then(res => {
      if (res.status != 200) return this.props.showFlashMessage("error", "Une erreur inconnue est survenue.")
      this.props.updateResa({...this.props.appointment_detailed, coached_ids: [...this.props.appointment_detailed.coached_ids, this.state.user.id]})
      this.props.showFlashMessage("success", "Vous êtes bien inscrit à la séance. N'oubliez pas de la régler au moins 48h avant.")
    })
    .catch(err => {
      this.props.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  getMatchingUsers(input) {
    if (input.length >= 1) {
      http.get(`/user/search?user_name=${encodeURIComponent(input)}`).then(res => {
        if (res.data.length > 0) this.setState({matching_users: res.data.filter((u) => this.state.coached_ids?.includes(u.id)), show_users: true})
      })
      .catch(err => {
        this.props.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
      })
    }
    this.setState({search_user_name: input})
  }

  updateResa() {
    http.post("/api/update-resa", {
      id: this.props.appointment_detailed.id,
      sessionTitle: this.state.sessionTitle,
      address: this.state.address,
      coached_ids: this.state.coached_ids
    })
    .then(res => {
      if (res.status != 200) return this.props.showFlashMessage("error", "Une erreur inconnue est survenue.")
      this.props.updateResa({
        ...this.props.appointment_detailed,
        sessionTitle: this.state.sessionTitle,
        address: this.state.address,
        coached_ids: this.state.coached_ids
      })
      this.props.showFlashMessage("success", "Votre rendez-vous a bien été modifié.")
    })
    .catch(err => {
      this.props.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  render() {
    let fields = [
      <div key="sessionTitle">
        <TextInput value={this.state.sessionTitle} onChange={(e) => {this.setState({sessionTitle: e}) }}
          label="Nom de la séance:" bold_label="true" disabled={this.props.appointment_detailed.coach_id != this.props.user.id} extraClass=" white-bg" Placeholder="Thème de la session"
        />,
      </div>,
      <div key="duration">
        <div className="bold mt-1">Durée:</div>
        <div>{this.props.appointment_detailed.duration + " min"}</div>
      </div>,
      <div key="isVideo">
        <div className="bold mt-1">Visio-conférence:</div>
        <div>{this.props.appointment_detailed.isVideo ? "Oui": "Non"}</div>
      </div>,
      <div className={this.props.appointment_detailed.isVideo ? "hidden" : ""} key="adresse">
        <div className="bold mt-1">Lieu:</div>
        <div>{this.props.appointment_detailed.address}</div>
      </div>,    
      <div key="isMulti">
        <div className="bold mt-1">Séance de groupe:</div>
        <div>{this.props.appointment_detailed.isMulti ? "Oui": "Non"}</div>
      </div>,
      <div key="visioLink"
      className={`details-visioLink-section ${this.props.appointment_detailed.isVideo && this.buildVideoId() ? "" : " hidden"}`}>
        <div className="bold mt-1">Lien de la visio-conférence:</div>
        <div className="clab-link" onClick={() => window.open(`${this.buildVideoId()}`, "_blank")}>
          Cliquez ici pour rejoindre
        </div>
      </div>,
      <div key="address"
      className={`details-address-section ${this.props.appointment_detailed.isVideo ? "hidden" : ""}`}>
        <div className="bold mt-1"></div>
        <TextInput value={this.state.address} onChange={(e) => {this.setState({address: e}) }}
          label="Adresse de la séance:" bold_label="true" disabled={this.props.appointment_detailed.coach_id != this.props.user.id}
          extraClass={`white-bg ${this.props.appointment_detailed.isVideo ? "hidden" : ""}`} Placeholder="Thème de la session"
        />,
      </div>,      
    
      <div key="payment"
      className={`details-payment-section ${this.props.appointment_detailed.paid?.includes(this.props.user.id) || 
       this.props.appointment_detailed.coach_id == this.props.user.id ? " hidden" : ""}`}>
        <div className="bold mt-1">Lien de paiement de la session:</div>
        <div className="clab-link" onClick={() => window.open(`${this.props.payment_link}`, "_blank")}>
          Cliquez ici pour payer
        </div>
      </div>,
      <div className={`select-input-autocomplete-container ${this.state.user.role == "coach" ? "" : "hidden"}`}>
        <TextInput extraClass="text-3 autocomplete-text-input" value={this.state.search_user_name} placeholder="Nom du coaché" 
          onChange={(e) => { this.getMatchingUsers(e) }} />
        <div className={`select-autocomplete-wrapper ${this.state.show_users ? "" : "hidden"}`}>
          {
            this.state.matching_users.map((matching_user) => 
              <div
                key={matching_user.id}
                className="select-autocomplete-option text-3"
                onClick={() => 
                  this.setState({
                    search_user_name: `${matching_user.firstname} ${matching_user.lastname}`,
                    coached_ids: [...this.state.coached_ids, matching_user.id],
                    show_users: false
                  })
                } 
              >
                {`${matching_user.firstname} ${matching_user.lastname}`}
              </div>
            )
          }        
        </div>
      </div>,
      <div className="input-group">
        <Button extraClass="cl-button mt-2" 
         onClick={() => { this.props.user.id == this.props.appointment_detailed.coach_id ? this.updateResa() : this.subscribeResa() }} 
         text="Valider" 
        />
      </div>
    
    ]
    return (
      <Modal toggle={this.props.toggle} closeFunc={() => this.props.closeFunc()}
        fields={fields} title="Votre RDV" id="appointment-details" />
    )
  }
}

export default ShowResaModal