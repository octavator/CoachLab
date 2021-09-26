import http from "../http.js"
import Modal from './modal.js'
import ShowResaModal from './modals/show_resa.js'
import Navbar from './navbar.js'
import Flash from './flash.js'
import {scrollTo} from '../utils.js'
import {SelectInput, RadioButton, TextInput, Button} from './forms/inputs.js'

//@TODO: allow to select a month from another year than current

class Agenda extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new_resa_modal: false,
      can_edit_new_resa: true,
      can_edit_new_resa_name: false,
      appointment_details_modal: false,
      target_id: undefined,
      schedule: {},
      day: new Date(new Date().setHours(0,0,0,0)),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      showFlash: false,
      flashType: '',
      flashMessage: '',
      matching_users: [],
      show_users: false,
      search_user_name: "",
      coached_users: {},
      reservations: {},
      appointment_detailed: {},
      form: this.defaultForm(),
      user: {firstname: "", lastname: "", role: "default"},
      target_user: {firstname: "", lastname: ""},
      weekdays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
      months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      durations: [{label: "30min", value: "30"}, {label: "45min", value: "45"}, {label: "1h", value: "60"}, ] // {label: "1h30", value: "90"} breaks agenda
    }
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(document.location.search)
    const target_id = urlParams.get("target_id")
    const nth_child = Math.max(this.state.day.getDate() - 3, 0)

    if (!target_id) {
      http.get("/api/me/agenda").then(agendaData => {
        this.setState({schedule: agendaData.data.agenda, user: agendaData.data.user})
      }).catch(err => {
        this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
      })
    } else {
      http.get("/api/me").then(res => {
        http.get(`/api/coach/agenda/${target_id}`).then(agendaData => {
          this.setState({
            target_user: agendaData.data.user,
            schedule: agendaData.data.agenda,
            target_id: target_id,
            user: res.data,
            form: {...this.state.form}
          })
        }).catch(err => {
          this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
        })
      }).catch(err => {
        this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
      })
    }
    scrollTo(".new-agenda-header", `.new-agenda-header-month:nth-child(${nth_child})`)
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  getAllDaysInMonth(month, year) {
    return Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => new Date(year, month, i + 1)
    );
  }
  slotClickEvent(slot, slot_id) {
    if (this.getSlotClickableClass(slot) == "") return

    if (!this.state.target_id && slot) return (this.setState({appointment_details_modal: true, appointment_detailed: slot}))

    if (!slot) this.setState({new_resa_modal: true, can_edit_new_resa: true, form: {...this.state.form, id: slot_id}})

    else this.setState({appointment_details_modal: true, appointment_detailed: slot})
  }
  getSelectedYear(idx) {
    const today = new Date()
    let is_next_year = idx > 11 && this.state.year <= today.getFullYear()
    let is_prev_year = idx <= 11 && this.state.year > today.getFullYear()
    // return this.state.year + (is_next_year ? Math.trunc(idx / 11) : (is_prev_year ? Math.trunc(idx / 11) * -1 : 0))
    return this.state.year + (is_next_year ? 1 : (is_prev_year ? -1 : 0))
  }
  getSlotClickableClass(slot) {
    const coachOwnAgenda = !this.state.target_id && this.state.user?.role == "coach"
    const coachOpenSlot = !slot || slot.isMulti
    const is_clickable = coachOwnAgenda || this.state.target_id && coachOpenSlot
    return (is_clickable ? " clickable" : "")
  }
  resNewSlot() {
    let ids = !this.state.target_id && this.state.user?.role == "coach" ? this.state.form.coached_ids : [this.state.user.id]
    http.post("/api/new-resa", {
      id: this.state.form.id,
      resa: {...this.state.form, coached_ids: ids},
      user_id: this.state.target_id || this.state.user.id
    }).then(res => {
      if (res.status != 200) return this.showFlashMessage("error", "Une erreur inconnue est survenue.")
      let schedule = {...this.state.schedule, [this.state.form.id]: this.state.form.id}
      let reservations = {...this.state.reservations, [this.state.form.id]: {...this.state.form, coached_ids: ids}}
      this.showFlashMessage("success", "Votre rendez-vous a bien été enregistré.")
      this.setState({schedule: schedule, reservations: reservations, new_resa_modal: false, form: this.defaultForm(), search_user_name: ""})  
    })
    .catch(err => {
      this.showFlashMessage("error", err.response && err?.response?.data  || "Une erreur inattendue est survenue.")
    })
  }
  getMatchingUsers(input) {
    if (input.length >= 1) {
      http.get(`/users/search?user_name=${encodeURIComponent(input)}&coach_id=${this.state.target_id || this.state.user.id}`).then(res => {
        if (res.data.length > 0) this.setState({matching_users: res.data, show_users: true})
      })
      .catch(err => {
        this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
      })
    } else this.setState({show_users: false})
    this.setState({search_user_name: input})
  }
  getAppointmentTitle(slot) {
    if (!slot) return ""
    if (slot.isMulti) return (slot.sessionTitle != "" ? slot.sessionTitle : "Session de groupe")
    if (this.state.target_id && !slot.coached_ids.includes(this.state.user.id)) return ""
    return `Session avec ${slot.coached_ids.includes(this.state.user.id) && "vous" || this.state.coached_users[slot.coached_ids[0]]}`
  }
  buildResaId(date, hour) {
    const resa_date = new Date(date)
    resa_date.setHours(hour, 0, 0)
    const coach_id = this.state.target_id ? this.state.target_id : this.state.user.id
    return `${resa_date.toLocaleString('fr-FR', { timeZone: 'UTC' })}+${coach_id}`
  }
  defaultForm() {
    return {
      duration: "60",
      isVideo: true,
      isMulti: false,
      sessionTitle: "",
      address: "",
      id: "",
      coached_ids: []
    }
  }
  render() {
    let scheduleForm = [
      <TextInput bold_label={true} value={this.state.form.sessionTitle} onChange={(e) => {this.setState({form: {...this.state.form, sessionTitle: e}}) }}
        label="Nom de la séance" disabled={!this.state.can_edit_new_resa && !this.state.can_edit_new_resa_name} extraClass=" white-bg" Placeholder="Session fitness pour débutants"/>,
      <SelectInput bold_label={true} value={this.state.durations.find(d => d.value == this.state.form.duration).label} disabled={!this.state.can_edit_new_resa} 
        options={this.state.durations.map(duration => {return {label: duration.label, value: duration.value}} )}
        onClick={(e) => { this.setState({form: {...this.state.form, duration: e}}) }} label="Durée" />,
      <RadioButton bold_label={true} value={this.state.form.isVideo} onClick={(e) => {this.setState({form: {...this.state.form, isVideo: e}}) }}
        label="Visio-conférence ?" yesLabel="Oui" noLabel="Non" disabled={!this.state.can_edit_new_resa} />,
      <TextInput bold_label={true} value={this.state.form.address} onChange={(e) => {this.setState({form: {...this.state.form, address: e}}) }}
        label={ this.state.form.isVideo ? undefined : `Addresse de la séance`} disabled={!this.state.can_edit_new_resa && !this.state.can_edit_new_resa_name}
        extraClass={`white-bg ${this.state.form.isVideo ? "hidden" : ""}`} Placeholder="20 avenue Jean Moulin, Paris"/>,
      <RadioButton bold_label={true} value={this.state.form.isMulti} onClick={(e) => {this.setState({form: {...this.state.form, isMulti: e}}) }}
        label="Séance de groupe ?" yesLabel="Oui" noLabel="Non" disabled={!this.state.can_edit_new_resa || this.state.target_id} />,
      <div className={`select-input-autocomplete-container ${!this.state.target_id && this.state.user?.role == "coach" ? "" : "hidden"}`}>
        <TextInput extraClass="text-3 autocomplete-text-input white-bg" value={this.state.search_user_name} 
        bold_label={true} label="Ajoutez un coaché" placeholder="Nom du coaché" 
          onChange={(e) => { this.getMatchingUsers(e) }} />
        <div className={`select-autocomplete-wrapper labeled ${this.state.show_users ? "" : "hidden"}`}>
          {
            this.state.matching_users.map((matching_user) => 
              <div
                key={matching_user.id}
                className="select-autocomplete-option text-3"
                onClick={() => 
                  this.setState({
                    search_user_name: `${matching_user.firstname} ${matching_user.lastname}`,
                    form: {...this.state.form, coached_ids: [matching_user.id]},
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
        <Button extraClass="cl-button mt-2" onClick={() => { this.resNewSlot() }} text="Valider" />
      </div>
    ]
    const this_month_days = this.getAllDaysInMonth(this.state.month, this.state.year)
    return (
      <div className="new-agenda-wrapper">
        <Navbar user={this.state.user} blue_bg={true} />
        <Modal toggle={this.state.new_resa_modal} closeFunc={() => this.setState({new_resa_modal: false, form: this.defaultForm()})}
          fields={scheduleForm} title="Prendre un RDV" id="appointment"/>
        <ShowResaModal toggle={this.state.appointment_details_modal} closeFunc={() => this.setState({appointment_details_modal: false})}
         user={this.state.user} appointment_detailed={this.state.appointment_detailed}
         showFlashMessage={(e, m) => this.showFlashMessage(e, m)} updateResa={(resa) => {this.setState({appointment_details_modal: false, reservations: {...this.state.reservations, [resa.id]: resa}})}}/>
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <h1 className={`page-title blue-bg ${this.state.target_id ? "" : "hidden"}`}>
          Agenda de&nbsp;<span className="agenda-name-white">{this.state.target_user.firstname + ' ' + this.state.target_user.lastname}</span>
        </h1>
        <div className="new-agenda-container">
          {/* MONTH SELECTION */}
          <h1 className="new-agenda-title text-1">
            <SelectInput extraClass={"text-2 "} value={this.state.months[this.state.month]} 
              options={this.state.months.map((month, idx) => { return {label: month, value: idx} } )}
              onClick={(e) => {this.setState({month: e})}} />
          </h1>

          {/* DAY SELECTION */}
          <div className="new-agenda-header">
            {
              this_month_days?.map((month_day, idx) => {
                return (
                  <div key={idx} onClick={() => { this.setState({day: month_day}) } } 
                   className={`new-agenda-header-month text-2 ${this.state?.day.getDate() == idx + 1 && this.state?.day.getMonth() == this.state?.month ? "selected" : ""}`} >
                    <div className="new-agenda-month-letter">{this.state?.weekdays[month_day.getDay()].at(0).toUpperCase()}</div>
                    <div className="new-agenda-month-number">{month_day.getDate()}</div>
                  </div>
                )
              })
            }
          </div>

          {/* CALENDAR */}
          <div className="hours-schedule-container">
            {
              this.state.hours.map((hour, idx) => {
                const slot_id = this.buildResaId(this.state.day, hour)
                const resa_id = this.state.schedule[slot_id]
                if (resa_id && !this.state.reservations[resa_id]) {
                  http.get(`/api/reservation/${encodeURIComponent(resa_id)}`)
                  .then(res => {
                    if (!res.data.isMulti) {
                      http.get(`/api/user/${res.data.coached_ids[0]}`).then(user_data => {
                        this.setState({coached_users: {...this.state.coached_users, [res.data.coached_ids[0]]: `${user_data.data.firstname} ${user_data.data.lastname}`}})
                      })
                    }
                    this.setState({reservations: {...this.state.reservations, [resa_id]: res.data}})
                  })
                } 
                let slot = this.state.reservations[resa_id]
                let is_paid = (slot && slot.paid || []).length >= (slot && slot.coached_ids || []).length
                let appointment_message = this.getAppointmentTitle(slot)
                return (
                  <div key={idx} className="hour-schedule">
                    <div className="hour-schedule-item text-2-5">{`${hour}:00`}</div>
                    <div className={"appointment-schedule-item text-2-5 " + 
                     (resa_id ? "reserved " : "empty ") + this.getSlotClickableClass(resa_id) }
                     onClick={() => this.slotClickEvent(slot, slot_id)}>
                      <div>{appointment_message}</div>
                      <div className={`appointment-pictos ${slot && (slot.isMulti || !this.state.target_id) ? "" : "hidden"}`}>
                        <div className={`appointment-picto ${slot && (slot.isMulti ? "multi" : "single")}`}>
                          <img src={`priv/static/images/${slot && slot.isMulti ? "session_groupe_blanc.svg" : "session_individuelle_blanc.svg"}`} />
                        </div>
                        <div className="appointment-picto video">
                          <img src={`priv/static/images/${slot && slot.isVideo ? "session_online_blanc.svg" : "session_irl_blanc.svg"}`} />
                        </div>
                      </div>
                    </div>
                    <div className="appointment-payment flex flex-center">
                      <div className={`green-check round-icon ml-1 ${!slot || !is_paid  ? " hidden" : ""}`}><i className="fa fa-check" aria-hidden="true"/></div>
                      <div className={`red-cross round-icon ml-1 ${is_paid ? " hidden" : ""}`}><i className="fa fa-times" aria-hidden="true"/></div>
                      </div>
                    </div>
                )
              })
            }
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
const root = ReactDOM.createRoot(domContainer)
root.render(<Agenda />)