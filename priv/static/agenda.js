import AgendaModal from './modal-appointment.js'
//const AgendaModal = require('./modal-appointment.js');

class Agenda extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        show_schedule_modal: true
    }
  }

  render() {
    return (
      <div class="agenda-wrapper">
        <AgendaModal toggle={this.state.show_schedule_modal} />
        <div class="agenda-content">
        <div class="agenda-header">
            <div class="agenda-header-section hour-column"></div>
            <div class="agenda-header-section">Lundi</div>
            <div class="agenda-header-section">Mardi</div>
            <div class="agenda-header-section">Mercredi</div>
            <div class="agenda-header-section">Jeudi</div>
            <div class="agenda-header-section">Vendredi</div>
            <div class="agenda-header-section">Samedi</div>
            <div class="agenda-header-section">Dimanche</div>
        </div>
        <div class="agenda-content-wrapper">
            <div class="agenda-content-column hour-column">
                <div class="hour-cell">8h&nbsp;</div>
                <div class="hour-cell">9h&nbsp;</div>
                <div class="hour-cell">10H&nbsp;</div>
                <div class="hour-cell">11h&nbsp;</div>
                <div class="hour-cell">12h&nbsp;</div>
                <div class="hour-cell">13h&nbsp;</div>
                <div class="hour-cell">14h&nbsp;</div>
                <div class="hour-cell">15h&nbsp;</div>
                <div class="hour-cell">16h&nbsp;</div>
                <div class="hour-cell">17h&nbsp;</div>
                <div class="hour-cell">18h&nbsp;</div>
                <div class="hour-cell">19h&nbsp;</div>
                <div class="hour-cell">20h&nbsp;</div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell unavailable">
                    <div class="schedule-cell-content"></div>
                </div>
                <div class="schedule-cell unavailable">
                    <div class="schedule-cell-content"></div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
            <div class="agenda-content-column">
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
                <div class="schedule-cell">
                    <div class="schedule-cell-content empty">+</div>
                </div>
            </div>
        </div>
    </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.agenda-wrapper');
ReactDOM.render(<Agenda/>, domContainer);