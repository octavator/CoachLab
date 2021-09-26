import http from "../http.js"
import Navbar from './navbar.js'
import ShowResaModal from './modals/show_resa.js'
import Flash from './flash.js'
import {resIdToDate, formatDate} from '../utils.js'

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
      reservations: [],
      agenda: {},
      payment_link: "",
      appointment_detailed: {},
      appointment_details_modal: false
    }
  }
  componentDidMount() {
    http.get("/api/me/agenda")
    .then(res => {
      this.setState({user: res.data.user, agenda: res.data.agenda}, () => {
        let ids = Object.values(this.state.agenda)
        ids.forEach(id => {
          http.get(`/api/reservation/${encodeURIComponent(id)}`).then(res => {
            this.setState({reservations: [...this.state.reservations, res.data]})
          })
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
  showResaModal(resa) {
    if (resa.paid?.includes(this.state.user.id)) return this.setState({ appointment_details_modal: true, appointment_detailed: resa })
    http.get(`/api/payment_link/${encodeURIComponent(resa.id)}`)
   .then(res => {
      this.setState({ payment_link: res.data, appointment_details_modal: true, appointment_detailed: resa})
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  getImageExt(filepath) {
    if (!filepath) return ""
    const tokens = filepath.split(".")
    return tokens[tokens.length - 1]
  }
  render() {
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <ShowResaModal toggle={this.state.appointment_details_modal} closeFunc={() => this.setState({appointment_details_modal: false})} updateResa={() => {}}
         user={this.state.user} appointment_detailed={this.state.appointment_detailed} payment_link={this.state.payment_link} showFlashMessage={this.showFlashMessage}/>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="session-list">
          <h1 className="page-title text-1">{"Vos sessions"}</h1>
          <div className="session-list-wrapper">
            {
              this.state.reservations.sort((a, b) => resIdToDate(b.id).getTime() - resIdToDate(a.id).getTime()).map((resa, idx) => 
              {
                let is_paid = (resa.paid || []).includes(this.state.user.id)
                return <div key={idx} onClick={() => this.showResaModal(resa) } className="session-list-row">
                  <div className="session-list-avatar">
                    <img className="round-avatar" 
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="priv/static/images/avatar_placeholder.png";
                      }}
                      src={`priv/static/images/${resa.coach_id}/${resa.coach_avatar}`}/>
                  </div>
                  <div className="session-list-infos text-2">
                    {`${resa.name || "Session coaching"} avec ${resa.coach_name}`}
                    <div className="session-details flex flex-row flex-space-between flex-center-y">
                      <div className="session-list-infos mt-1">
                        {formatDate(resIdToDate(resa.id))}
                      </div>
                      <div className={`appointment-pictos`}>
                        <div className={`appointment-picto ${resa?.isMulti ? "multi" : "single"}`}>
                          <img src={`priv/static/images/${resa?.isMulti ? "session_groupe_bleu.svg" : "session_individuelle_bleu.svg"}`} />
                        </div>
                        <div className="appointment-picto session-list-picto video">
                          <img src={`priv/static/images/${resa?.isVideo ? "session_online_bleu.svg" : "session_irl_bleu.svg"}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                      
                  <div className={`green-check round-icon ml-2 ${!is_paid ? " hidden" : ""}`}><i className="fa fa-check" aria-hidden="true"/></div>
                  <div className={`red-cross round-icon ml-2 ${is_paid ? " hidden" : ""}`}><i className="fa fa-times" aria-hidden="true"/></div>
                </div>
              }
              )
            }
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
const root = ReactDOM.createRoot(domContainer)
root.render(<MySessions />)