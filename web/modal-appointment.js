class AgendaModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        toggle: false
    }
  }

  render() {
    console.log("toggle", (this.props.toggle))
    if (this.props.toggle) {
      return (
        <div className="modal" id="appointment-modal">
          <div className="appointment-modal-content">
            <h1 className="landing-title">Prendre un RDV</h1>
            <div className="infos-form">
                <div className="input-group">
                    <label className="input-label">Prénom</label>
                    <input type="text" className="infos-form-input firstname-input"/>
                </div>
                <div className="input-group">
                    <label className="input-label">Nom de famille</label>
                    <input type="text" className="infos-form-input lastname-input"/>
                </div>
                <div className="input-group">
                    <label className="input-label">Adresse email</label>
                    <input type="text" className="infos-form-input email-input"/>
                </div>
                <div className="button-group">
                    <button onClick={() => { this.props.closeFunc() }} className="cl-button primary">Valider</button>
                </div>
            </div>
          </div>
        </div>
        );
    } else return ''
  }
}

export default AgendaModal

// const domContainer = document.querySelector('#appointment-modal');
// ReactDOM.render(<AgendaModal toggle={true} />, domContainer);