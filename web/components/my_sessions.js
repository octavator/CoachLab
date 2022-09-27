import Navbar from './navbar.js'
import Modal from './modal.js'
import Flash from './flash.js'
import {TextInput, Button} from './forms/inputs.js'

class MySessions extends React.Component {
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
      search_input: "",
      agenda: {},
      appointment_detailed: {},
      appointment_details_modal: false
    }
  }
  componentDidMount() {
    http.get("/api/me/agenda").then(res => {
      this.setState({user: res.data.user, agenda: res.data.agenda})
    }).catch(err => {
      this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => this.setState({showFlash: false}), 5000)
    })
  }
  buildVideoId() {
    return (!this.state.appointment_detailed.id ? undefined
     : `/video?roomId=${encodeURIComponent(this.state.appointment_detailed.id + "+" + this.state.appointment_detailed.coach_id)}`)
  }
  render() {
    console.log(this.state.agenda)
    let detailsForm = [
      <div key="sessionTitle">
        <div className="bold mt-1">Nom de la séance</div>
        <div>{this.state.appointment_detailed.sessionTitle}</div>
      </div>,
      <div key="duration">
        <div className="bold mt-1">Durée:</div>
        <div>{this.state.appointment_detailed.duration + "min"}</div>
      </div>,
      <div key="isVideo">
        <div className="bold mt-1">Visio-conférence:</div>
        <div>{this.state.appointment_detailed.isVideo ? "Oui": "Non"}</div>
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
      </div>
    ]
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <Modal toggle={this.state.appointment_details_modal} closeFunc={() => this.setState({appointment_details_modal: false})}
          fields={detailsForm} title="Votre RDV" id="appointment-details" />
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="session-list">
          <h1 className="page-title text-1">{"Vos sessions"}</h1>
          <div className="session-list-wrapper">
            {
              Object.values(this.state.agenda).map((session, idx) => 
                <div key={idx} onClick={() => this.setState({appointment_details_modal: true, appointment_detailed: session}) } className="session-list-row">
                  <div className="session-list-avatar">
                    <img className="round-avatar" 
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="priv/static/images/avatar_placeholder.png";
                      }}
                      src="priv/static/images/avatar_placeholder.png"/>
                  </div>
                  <div className="session-list-name text-2">{`${session.name || "Session coaching"} avec ${session.coach_name}`}</div>
                </div>
              )
              // src={`priv/static/images/${session.coach_id}/avatar.${this.getImageExt(session.avatar)}`}/>
            }
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<MySessions/>, domContainer);