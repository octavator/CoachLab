import Modal from './components/modal.js'
import Navbar from './components/navbar.js'

class CoachAgenda extends React.Component {
  constructor(props) {
    super(props)
    let url = window.location.href
    let slugs = url.split("=")
    let coach_id = atob(slugs[slugs.length - 1])
    this.state = {
        show_schedule_modal: false,
        schedule: {},
        currentDay: new Date(),
        currentWeek: undefined,
        year: 2021,
        form: {
          duration: "30",
          isVideo: true,
          id: "",
          coach_id: coach_id
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
    http.get(`/coach/agenda?coach_id=${btoa(this.state.form.coach_id.replace("=", ""))}`).then(res => {

      console.log(res.status)
      console.log(res.data)
      const curWeek = this.getCurrentWeek(this.state.currentDay)
      this.setState({currentWeek: curWeek, user: res.data.user, schedule: res.data.agenda})
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
  toggleModal() {
    this.setState({show_schedule_modal: false})
  }
  sendForm() {
    console.log(this.state.form)
    http.post("/new-resa", {id: this.state.form.id, resa:  this.state.form, email: this.state.user.email}).then(res => {
      console.log(res)
      let schedule = this.state.schedule
      schedule[this.state.form.id] = this.state.form
      this.setState({schedule: schedule})
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
      <div key="sendbtn" className="input-group"><div className="button-group"> <button onClick={() => { this.sendForm() ; this.toggleModal() }} className="cl-button primary">Valider</button></div></div>
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
          <h1 className="page-title">Agenda de {this.state.user.firstname + ' ' + this.state.user.lastname}</h1>
          <h2 className="page-title">
            <span onClick={() => {this.showPrevWeek()}}>&lt;</span>
              Semaine du {firstDate} au {lastDate} {this.state.months[lastDateMonth]} {lastDateYear}    
             <span onClick={() => {this.showNextWeek()}}>&gt;</span>
          </h2>
          <Modal toggle={this.state.show_schedule_modal} closeFunc={() => {this.toggleModal()}}
            fields={scheduleForm} title="Prendre un RDV" id="appointment"/>
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
                        <div key={hour} className={"schedule-cell" + (slot && ' unavailable' || '')} >
                          <div onClick={() => { !slot
                           && this.setState({show_schedule_modal: true, form: {...this.state.form, id: slot_id}}) }} 
                            className={(!slot) && cellClass + ' empty' || cellClass + ' unavailable'}>
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
ReactDOM.render(<CoachAgenda/>, domContainer);