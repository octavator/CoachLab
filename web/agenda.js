import Modal from './modal.js'
import Navbar from './navbar.js'

class Agenda extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        show_schedule_modal: false,
        show_details_modal: false,
        schedule: {},
        currentDay: new Date(),
        currentWeek: undefined,
        year: 2021,
        showFlash: false,
        flashType: '',
        flashMessage: '',
        appointment_detailed: {},
        form: {
          duration: "30",
          isVideo: true,
          id: ""
        },
        user: {
          firstname: "",
          lastname: ""
        },
        weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
        monthdays: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    }
  }
  componentDidMount() {
    http.get("/me").then(res => {
      http.get("/me/agenda").then(agendaData => {
        const curWeek = this.getCurrentWeek(this.state.currentDay)
        this.setState({currentWeek: curWeek, user: res.data, schedule: agendaData.data})
      })
    })
  }
  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  showNextWeek() {
    const new_day = this.addDays(this.state.currentDay, 7)
    const new_week = this.getCurrentWeek(new_day)
    this.setState({currentDay: new_day, currentWeek: new_week})
  }
  showPrevWeek() {
    const new_day = this.addDays(this.state.currentDay, -7)
    const new_week = this.getCurrentWeek(new_day)
    this.setState({currentDay: new_day, currentWeek: new_week})
  }
  getCurrentWeek(targetDay) {
    let dayIndex = (targetDay.getDay() - 1)
    dayIndex = dayIndex < 0 ? 6 : dayIndex
    return this.state.weekdays.map((_day, i) => {
      return this.addDays(targetDay, i - dayIndex)
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  sendForm() {
    http.post("/new-resa", {id: this.state.form.id, resa: this.state.form, email: this.state.user.email})
    .then(res => {
      let schedule = this.state.schedule
      schedule[this.state.form.id] = this.state.form
      this.showFlashMessage("success", "Votre rendez-vous a bien été enregistré.")
      this.setState({schedule: schedule})
    })
    .catch(err => {
      this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
    })
  }
  buildResaId(day, hour) {
    if (!this.state.currentWeek) return "null"
    let weekIdx = this.state.weekdays.indexOf(day)
    let date = this.state.currentWeek[weekIdx]
    date.setHours(hour, 0, 0)
    return(date.toLocaleString())
  }
  render() {
    let detailsForm = [
      <div key="duration" className="details-duration-section">
        <div className="details-duration-label">Durée:</div>
        <div className="details-duration-value">{this.state.appointment_detailed.duration}</div>
      </div>,
        <div key="isVideo" className="details-isVideo-section">
            <div className="details-isVideo-label">Visio-conférence:</div>
            <div className="details-isVideo-value">{this.state.appointment_detailed.isVideo ? "Oui": "Non"}</div>
        </div>,
        <div key="visioLink" className={"details-visioLink-section" + (this.state.appointment_detailed.isVideo ? "" : " hidden")  }>
            <div className="details-visioLink-label">Lien de la visio-conférence:</div>
            <div className="details-visioLink-value">{this.state.appointment_detailed.isVideo ? "http://superlienvideo.caramel": ""}</div>
        </div>,
    ]
    let scheduleForm = [
      <div key="duration" className="input-group select-input">
        <label className="input-label">Durée</label>
        <select onChange={(e) => { this.setState({form: {...this.state.form, duration: e.target.value}}) }} name="duration" className="infos-form-select duration-select">
          <option value="30">30min</option>
          <option value="45">45min</option>
          <option value="60">1h</option>
        </select>
      </div>,
      <div key="isVideo" className="input-group radio-group">
        <label className="input-label">Visio-conférence</label>
          <div className="radio-choices" onChange={(e) => { this.setState({form: {...this.state.form, isVideo: e.target.value}}) }}>
            <label className="radio-label" htmlFor="isVideo">Oui</label>
            <input type="radio" defaultChecked value={true} id="isVideo" name="isVideo" className="cl-radio"/>
            <label className="radio-label" htmlFor="isNotVideo">Non</label>
            <input id="isNotVideo" value={false} name="isVideo" type="radio" className="cl-radio"/>
          </div>
        </div>,
      <div key="sendbtn" className="input-group">
        <div className="button-group">
          <button onClick={() => { this.sendForm() ; this.setState({show_schedule_modal: false}) }} className="cl-button primary">Valider</button>
        </div>
      </div>
    ]
    let cellClass = "schedule-cell-content "
    let firstDate = this.state.currentWeek ? this.state.currentWeek[0].getDate() : ""
    let lastDate = this.state.currentWeek ? this.state.currentWeek[6].getDate() : ""
    let lastDateMonth = this.state.currentWeek ? this.state.currentWeek[6].getMonth() : ""
    let lastDateYear = this.state.currentWeek ? this.state.currentWeek[6].getFullYear() : ""
    return (
      <div>
        <Navbar user={this.state.user} />
        <div className="agenda-wrapper">
          <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
          <h1 className="page-title">Agenda de&nbsp;<span className="agenda-name">{this.state.user.firstname + ' ' + this.state.user.lastname}</span></h1>
          <h2 className="page-title">
            Semaine du {firstDate} au {lastDate} {this.state.months[lastDateMonth]} {lastDateYear}    
          </h2>
          <div className="week-selectors">
            <div onClick={() => {this.showPrevWeek()}} className="previous-week">&lt;&nbsp;Semaine précédente</div>
            <div onClick={() => {this.showNextWeek()}} className="next-week">Semaine suivante&nbsp;&gt;</div>
          </div>
          <Modal toggle={this.state.show_schedule_modal} closeFunc={() => {this.setState({show_schedule_modal: false})}}
            fields={scheduleForm} title="Prendre un RDV" id="appointment"/>
          <Modal toggle={this.state.show_details_modal} closeFunc={() => {this.setState({show_details_modal: false})}}
            fields={detailsForm} title="Votre RDV" id="appointment-details"/>
          <div className="agenda-header">
            <div className="agenda-header-section hour-column"></div>
            { this.state.weekdays.map(day => {
              return <div key={day} className="agenda-header-section">{day}</div> 
            })}
          </div>

          <div className="agenda-content-wrapper">
              <div className="agenda-content-column hour-column">
                { this.state.hours.map(hour => {
                  return <div key={hour} className="hour-cell">{hour}h&nbsp;</div> 
                })}
              </div>

              { this.state.weekdays.map(day => {
                return (
                  <div key={day} className="agenda-content-column">
                    { this.state.hours.map(hour => {
                      let slot_id = this.buildResaId(day, hour)
                      let slot = this.state.schedule[slot_id]
                      return (
                        <div key={hour} className="schedule-cell">
                          <div onClick={() => { !slot
                           ? this.setState({show_schedule_modal: true, form: {...this.state.form, id: slot_id}})
                          :  this.setState({show_details_modal: true, appointment_detailed: slot}) }}
                            className={(!slot) && cellClass + ' empty' || cellClass}>
                              { slot ? 
                              `RDV de ${slot.duration}min ${["true", true].includes(slot.isVideo) ? "avec" : "sans"} visio-conférence`
                              : "+"}
                          </div>
                        </div>
                      )
                    }) }
                  </div>
                )
              })}
            </div>
        </div>
    </div>
    )
  }
}

const domContainer = document.querySelector('.agenda-wrapper');
ReactDOM.render(<Agenda/>, domContainer);