class Modal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggle: false
    }
  }

  render() {
    return (
      <div className={this.props.toggle ? "modal" : "modal hidden" } id={`${this.props.id}-modal`}>
        <div className="modal-content">
          <div className="close-btn" onClick={this.props.closeFunc}>
            <i className="fa fa-times" aria-hidden="true"/>
          </div>
          <h1 className="page-title">{this.props.title}</h1>
          <div className="infos-form">
            { this.props.fields.map(field => field) }
          </div>
        </div>
      </div>
    )
  }
}

export default Modal