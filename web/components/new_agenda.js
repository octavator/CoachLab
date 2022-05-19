import Modal from './modal.js'
import Navbar from './navbar.js'

class Agenda extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        new_resa_modal: false,
        appointment_details_modal: false,
        target_id: undefined,
        schedule: {},
        day: new Date(new Date().setHours(0,0,0,0)),
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        showFlash: false,
        flashType: '',
        flashMessage: '',
        appointment_detailed: {},
        form: {
          duration: "30",
          isVideo: true,
          id: ""
        },
        user: {firstname: "", lastname: ""},
        target_user: {firstname: "", lastname: ""},
        weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"],
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]
    }
  }
  componentDidMount() {
    const urlParams = new URLSearchParams(document.location.search)
    const target_id = urlParams.get("target_id")
    if (!target_id) {
      http.get("/me/agenda").then(agendaData => {
        this.setState({schedule: agendaData.data.agenda})
      }).catch(err => {
        this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
      })
    } else {
      http.get("/me").then(res => {
        this.setState({
          user: res.data,
        })
        http.get(`/coach/agenda/${target_id}`).then(agendaData => {
          this.setState({
            target_user: agendaData.data.user,
            schedule: agendaData.data.agenda,
            target_id: target_id
          })
        }).catch(err => {
          this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
        })
      }).catch(err => {
        this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
      })
    }
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
    console.log("target id:", this.state.target_id)
    console.log("slot:", slot)
    if (this.state.target_id) {
      !slot && this.setState({new_resa_modal: true, form: {...this.state.form, id: slot_id}})
    } else {
      slot && this.setState({appointment_details_modal: true, appointment_detailed: slot})
    }
  }
  getSelectedYear(idx) {
    const today = new Date()
    let is_next_year = idx > 11 && this.state.year <= today.getFullYear()
    let is_prev_year = idx <= 11 && this.state.year > today.getFullYear()
    // return this.state.year + (is_next_year ? Math.trunc(idx / 11) : (is_prev_year ? Math.trunc(idx / 11) * -1 : 0))
    return this.state.year + (is_next_year ? 1 : (is_prev_year ? -1 : 0))
  }
  getSlotClickableClass(slot) {
    const is_clickable =  this.state.target_id && !slot || !this.state.target_id && slot
    return (is_clickable ? " clickable" : "")
  }
  resNewSlot() {
    http.post("/new-resa", {id: this.state.form.id, resa: this.state.form, user_id: this.state.target_user.id})
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
  buildResaId(date, hour) {
    const resa_date = new Date(date)
    resa_date.setHours(hour, 0, 0)
    return(resa_date.toLocaleString())
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
          <button onClick={() => { this.resNewSlot() ; this.setState({new_resa_modal: false}) }} className="cl-button primary">Valider</button>
        </div>
      </div>
    ]
    const this_month_days = this.getAllDaysInMonth(this.state.month, this.state.year)
    const today = new Date()
    console.log("agenda keys", Object.keys(this.state.schedule))
    return (
      <div className="new-agenda-wrapper">
        <Navbar user={this.state.user} blue_bg={true} />
        <Modal toggle={this.state.new_resa_modal} closeFunc={() => {this.setState({new_resa_modal: false})}}
            fields={scheduleForm} title="Prendre un RDV" id="appointment"/>
        <Modal toggle={this.state.appointment_details_modal} closeFunc={() => {this.setState({appointment_details_modal: false})}}
            fields={detailsForm} title="Votre RDV" id="appointment-details"/>
        <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
        <h1 className={"page-title blue-bg " + (this.state.target_id ? "" : "hidden")}>
          Agenda de&nbsp;<span className="agenda-name-white">{this.state.target_user.firstname + ' ' + this.state.target_user.lastname}</span>
        </h1>
        <div className="new-agenda-container">
          <h1 className="new-agenda-title text-1">{this.state.months[this.state.month]}</h1>
          <div className="new-agenda-header">
            { this.state.months.concat(this.state.months).map((month, idx) => {
              return (
              <div key={idx} className={"new-agenda-header-month text-2 " +
               ((this.state.month + ((this.state.year - today.getFullYear()) * 12)) == idx && " selected" || "")}
                onClick={() => {this.setState({month: idx % 12, year: this.getSelectedYear(idx)})}}
              >
                <div className="new-agenda-month-letter">{month.at(0).toUpperCase()}</div>
                <div className="new-agenda-month-number">{this.state.months.indexOf(month) + 1}</div>
              </div>
              )
            })}
          </div>
          <div className="new-schedule-container">
            <div className="new-days-schedule-container">
              {
                this.state.weekdays.map((weekday, idx) => {
                  return (
                    <div key={idx} className={"new-agenda-days-row"}>
                      <div className="new-agenda-days-header text-2">{weekday.at(0).toUpperCase()}</div>
                      {
                        (this_month_days || []).filter(date => { return date.getDay() - 1 == idx || (date.getDay() == 0 && idx == 6)})
                        .map((this_month_weekday, idx) => {
                          const date = this_month_weekday.getDate()
                          console.log(this_month_weekday.getTime())
                          // console.log(this.state.day.getTime())
                          console.log((this_month_weekday.getTime() == this.state.day.getTime()))
                          
                          return (
                          <div key={idx} className={"new-agenda-day text-3" + ((this_month_weekday.getTime() == this.state.day.getTime()) ? " selected bold-font" : "")}
                           onClick={() => {this.setState({day: new Date(this.state.year, this.state.month, date)})}}
                           >{date}</div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
            <div className="hours-schedule-container">
              {
                this.state.hours.map((hour, idx) => {
                  console.log(slot_id)
                  const slot_id = this.buildResaId(this.state.day, hour)
                  const slot = this.state.schedule[slot_id] || (idx == 3)
                  const appointment_message = slot && !this.state.target_id ? "Session coaching Mme Martin" : ""
                  return (
                    <div key={idx} className="hour-schedule">
                      <div className="hour-schedule-item text-2-5">{`${hour}:00`}</div>
                      <div className={"appointment-schedule-item text-2-5 " + 
                        (slot ? "reserved" : "empty") + this.getSlotClickableClass(slot) }
                        onClick={() => {this.slotClickEvent(slot, slot_id)}}>
                          {appointment_message}
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
          
          {/* <div className="new-agenda-header">
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
                          ? this.setState({new_resa_modal: true, form: {...this.state.form, id: slot_id}})
                          :  this.setState({appointment_details_modal: true, appointment_detailed: slot}) }}
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
            </div> */}
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<Agenda/>, domContainer);

// let cellClass = "schedule-cell-content "
// let firstDate = this.state.currentWeek ? this.state.currentWeek[0].getDate() : ""
// let lastDate = this.state.currentWeek ? this.state.currentWeek[6].getDate() : ""
// let lastDateMonth = this.state.currentWeek ? this.state.currentWeek[6].getMonth() : ""
// let lastDateYear = this.state.currentWeek ? this.state.currentWeek[6].getFullYear() : ""
// return (
//   <div>
//     <Navbar user={this.state.user} />
//     <div className="agenda-wrapper">
//       <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
//       <h1 className="page-title">Agenda de&nbsp;<span className="agenda-name">{this.state.user.firstname + ' ' + this.state.user.lastname}</span></h1>
//       <h2 className="page-title">
//         Semaine du {firstDate} au {lastDate} {this.state.months[lastDateMonth]} {lastDateYear}    
//       </h2>
//       <div className="week-selectors">
//         <div onClick={() => {this.showPrevWeek()}} className="previous-week">&lt;&nbsp;Semaine précédente</div>
//         <div onClick={() => {this.showNextWeek()}} className="next-week">Semaine suivante&nbsp;&gt;</div>
//       </div>
//       <Modal toggle={this.state.new_resa_modal} closeFunc={() => {this.setState({new_resa_modal: false})}}
//         fields={scheduleForm} title="Prendre un RDV" id="appointment"/>
//       <Modal toggle={this.state.appointment_details_modal} closeFunc={() => {this.setState({appointment_details_modal: false})}}
//         fields={detailsForm} title="Votre RDV" id="appointment-details"/>
//       <div className="agenda-header">
//         <div className="agenda-header-section hour-column"></div>
//         { this.state.weekdays.map(day => {
//           return <div key={day} className="agenda-header-section">{day}</div> 
//         })}
//       </div>

//       <div className="agenda-content-wrapper">
//           <div className="agenda-content-column hour-column">
//             { this.state.hours.map(hour => {
//               return <div key={hour} className="hour-cell">{hour}h&nbsp;</div> 
//             })}
//           </div>

//           { this.state.weekdays.map(day => {
//             return (
//               <div key={day} className="agenda-content-column">
//                 { this.state.hours.map(hour => {
//                   let slot_id = this.buildResaId(day, hour)
//                   let slot = this.state.schedule[slot_id]
//                   return (
//                     <div key={hour} className="schedule-cell">
//                       <div onClick={() => { !slot
//                        ? this.setState({new_resa_modal: true, form: {...this.state.form, id: slot_id}})
//                       :  this.setState({appointment_details_modal: true, appointment_detailed: slot}) }}
//                         className={(!slot) && cellClass + ' empty' || cellClass}>
//                           { slot ? 
//                           `RDV de ${slot.duration}min ${["true", true].includes(slot.isVideo) ? "avec" : "sans"} visio-conférence`
//                           : "+"}
//                       </div>
//                     </div>
//                   )
//                 }) }
//               </div>
//             )
//           })}
//         </div>
//     </div>
// </div>
// )