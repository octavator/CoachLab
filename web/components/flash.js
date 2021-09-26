class Flash extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className={`flash-message text-3 ${this.props.showFlash ? `${this.props.flashType}` : "hidden"}`}>
        {this.props.flashMessage}
      </div>
    )
  }
}

export default Flash