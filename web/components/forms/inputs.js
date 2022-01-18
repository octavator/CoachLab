class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show_dropdown: false
    }
  }
  render() {
    return (
      <div className="text-input-wrapper">
        <div className="input-group">
          <label className="input-label">{this.props.label}</label>
          <input onChange={(e) => { this.props.on_change(e)}} placeholder={this.props.placeholder} value={this.props.value} type="text"></input>
        </div>
      </div>              
    )
  }
}

export default TextInput
// const domContainer = document.querySelector('.TextInput-wrapper');
// ReactDOM.render(<TextInput/>, domContainer);