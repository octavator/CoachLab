import Modal from '../modal.js'

class EditResaModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      appointment_detailed: this.props.appointment_detailed || {}
    }
  }
  buildVideoId() {
    return (
      !this.state.appointment_detailed?.id 
      ? undefined
      : `/video?roomId=${encodeURIComponent(this.state.appointment_detailed.id)}`
    )
  }
  render() {
    let fields = [
      <div key="sessionTitle">
        <div className="bold mt-1">Nom de la séance:</div>
        <div>{this.state.appointment_detailed.sessionTitle}</div>
      </div>,
      <div key="duration">
        <div className="bold mt-1">Durée:</div>
        <div>{this.state.appointment_detailed.duration + " min"}</div>
      </div>,
      <div key="isVideo">
        <div className="bold mt-1">Visio-conférence:</div>
        <div>{this.state.appointment_detailed.isVideo ? "Oui": "Non"}</div>
      </div>,
      <div className={this.state.appointment_detailed.isVideo ? "hidden" : ""} key="adresse">
        <div className="bold mt-1">Lieu:</div>
        <div>{this.state.appointment_detailed.address}</div>
      </div>,    
      <div key="isMulti">
        <div className="bold mt-1">Séance de groupe:</div>
        <div>{this.state.appointment_detailed.isMulti ? "Oui": "Non"}</div>
      </div>,
      <div key="visioLink"
       className={`details-visioLink-section ${this.state.appointment_detailed.isVideo && this.buildVideoId() ? "" : " hidden"}`}>
        <div className="bold mt-1">Lien de la visio-conférence:</div>
        <div className="clab-link" onClick={() => window.open(`${this.buildVideoId()}`, "_blank")}>
          Cliquez ici pour rejoindre
        </div>
      </div>,
      <div key="payment"
      className={`details-payment-section ${this.state.appointment_detailed.paid?.includes(this.props.user.id) ? " hidden" : ""}`}>
        <div className="bold mt-1">Lien de paiement de la session:</div>
        <div className="clab-link" onClick={() => window.open(`${this.props.payment_link}`, "_blank")}>
          Cliquez ici pour payer
        </div>
      </div>
    ]
    return (
      <Modal toggle={this.props.toggle} closeFunc={this.props.closeFunc}
        fields={fields} title="Votre RDV" id="appointment-details" />
    )
  }
}

export default EditResaModal