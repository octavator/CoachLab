import AgendaModal from './modal-appointment.js'
//const AgendaModal = require('./modal-appointment.js');

class Agenda extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        show_schedule_modal: false,
        schedule: null,
        weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
        hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
    }
  }

  render() {
    let cellClass = "schedule-cell-content "
    return (
      <div className="agenda-wrapper">
        <AgendaModal toggle={this.state.show_schedule_modal} closeFunc={() => {this.setState({show_schedule_modal: false})}} />
        <div className="agenda-header">
          <div className="agenda-header-section hour-column"></div>
  
          { this.state.weekdays.map(day => {
              return <div className="agenda-header-section">{day}</div> 
            })
          }
        </div>

        <div className="agenda-content-wrapper">
            <div className="agenda-content-column hour-column">
              { this.state.hours.map(hour => {
                return <div className="hour-cell">{hour}h&nbsp;</div> 
                })
              }
            </div>

            { this.state.weekdays.map(day => {
              return (
                <div className="agenda-content-column">
                  { this.state.hours.map(hour => {
                    return (
                      <div className="schedule-cell">
                        <div onClick={() => { (!this.state.schedule || !this.state.schedule[day][hour]) && this.setState({show_schedule_modal: true}) }} 
                          className={(!this.state.schedule || !this.state.schedule[day][hour]) && cellClass + ' empty' || cellClass}>+</div>
                      </div>
                    )
                  }) }
                </div>
              )
            })
            }
        </div>
    </div>
    )
  }
}

const domContainer = document.querySelector('.agenda-wrapper');
ReactDOM.render(<Agenda/>, domContainer);