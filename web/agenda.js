import Modal from './modal.js'

class Agenda extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        show_schedule_modal: false,
        schedule: null,
        form: {
          duration: "30",
          isVideo: true
        },
        weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"]
    }
  }
  toggleModal() {
    this.setState({show_schedule_modal: false})
  }
  sendForm() {
    console.log(this.state.form)
    // http.post("/sign-up", this.state).then(res => {
    // })
  }
  render() {
    let cellClass = "schedule-cell-content "
    let scheduleForm = [
      // <div key="firstname" className="input-group"><label className="input-label">Prénom</label> <input type="text" className="infos-form-input firstname-input"/></div>,
      // <div key="lastname" className="input-group"><label className="input-label">Nom de famille</label> <input type="text" className="infos-form-input lastname-input"/></div>,
      // <div key="email" className="input-group"><label className="input-label">Adresse email</label> <input type="text" className="infos-form-input email-input"/></div>,
      <div key="duration" className="input-group select-input">
        <label className="input-label">Durée</label>
        <select onChange={(e) => { console.log(e) && this.setState({form: {...this.state.form, duration: e.target.value}}) }} name="duration" className="infos-form-select duration-select">
          <option value="30">30min</option>
          <option value="45">45min</option>
          <option value="60">1h</option>
        </select>
      </div>,
      <div key="isVideo" className="input-group radio-group"><label className="input-label">Visio-conférence</label><div className="radio-choices">
        <label className="radio-label" htmlFor="isVideo">Oui</label><input type="radio" defaultChecked value="true" id="isVideo" name="isVideo" className="cl-radio"/>
        <label className="radio-label" htmlFor="isNotVideo">Non</label><input id="isNotVideo" value="false" name="isVideo" type="radio" className="cl-radio"/>
      </div></div>,
      <div key="sendbtn" className="input-group"><div className="button-group"> <button onClick={() => { this.sendForm() && this.toggleModal() }} className="cl-button primary">Valider</button></div></div>
    ]
    return (
      <div className="agenda-wrapper">
        <h1 className="page-title">Agenda du coach John Doe</h1>
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
                    return (
                      <div key={hour} className="schedule-cell">
                        <div onClick={() => { (!this.state.schedule || !this.state.schedule[day][hour]) && this.setState({show_schedule_modal: true}) }} 
                          className={(!this.state.schedule || !this.state.schedule[day][hour]) && cellClass + ' empty' || cellClass}>+</div>
                      </div>
                    )
                  }) }
                </div>
              )
            })}
        </div>
    </div>
    )
  }
}

const domContainer = document.querySelector('.agenda-wrapper');
ReactDOM.render(<Agenda/>, domContainer);