class Stepper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="stepper-wrapper">
        <div onClick={() => { this.props.change_step && this.props.change_step(1) }} className={"stepper-step first-step active"}></div>
        <div onClick={() => { this.props.change_step && this.props.change_step(2) }} className={"stepper-step second-step" +  (this.props.step > 1 ? " active" : "")}></div>
        <div onClick={() => { this.props.change_step && this.props.change_step(3) }} className={"stepper-step third-step" +  (this.props.step > 2 ? " active" : "")}></div>
      </div>
    )
  }
}

export default Stepper