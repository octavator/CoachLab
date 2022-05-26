/*
  TextInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    type: "password" - field's type // optionnal (text)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal ("")
  }
*/

class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className="text-input-wrapper">
        <div className="input-group">
          <label className={"input-label" + (this.props.label ? "" : " hidden")}>{this.props.label}</label>
          <input className={"cl-input " + (this.props.extraClass ? this.props.extraClass : "text-3")} required={this.props.required} name={this.props.name || ""}
           onChange={(e) => { this.props.onChange(e.target.value)}} placeholder={this.props.placeholder} value={this.props.value} type={this.props.type || "text"}></input>
        </div>
      </div>              
    )
  }
}

/*
  SelectInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    type: "password" - field's type // optionnal (text)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal ("")
  }
*/

class SelectInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show_dropdown: false
    }
  }
  render() {
    return (
      <div className="select-input-wrapper">
        <div className="input-group">
          <label className={"input-label" + (this.props.label ? "" : " hidden")}>{this.props.label}</label>

          <div className={"cl-select " + (this.props.extraClass ? this.props.extraClass : "text-3")} required={this.props.required} name={this.props.name || ""}
          onClick={() => {this.setState({show_dropdown: !this.state.show_dropdown})}}>
            <div className="cl-selected-option">{this.props.value}
              <i className={"fa fa-angle-up" + (this.state.show_dropdown ? "" : " hidden")}></i>
              <i className={"fa fa-angle-down" + (this.state.show_dropdown ? " hidden" : "")}></i>
            </div>
            
            <div className={"cl-options-container" + (this.state.show_dropdown ? "" : " hidden")}>
              {this.props.options.map((option, option_idx) => {
                return (
                  <div key={option_idx} className={"cl-option text-2"}
                  onClick={() => { this.props.onClick(option.value)}} >
                    {option.label}
                </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>              
    )
  }
}

/*
  FileInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
  }
*/

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className={"file-input-wrapper "  + (this.props.extraClass.includes("bg-white") ? "white-text" : "")}>
        <div className={"file-label text-2 " + (this.props.label ? "" : "hidden")} >{this.props.label}</div>
        <div className="file-upload-section">
          <label className={"file-input-label " + (this.props.extraClass ? this.props.extraClass : "text-3")}>
            <input className={"cl-file-input "} required={this.props.required} onChange={(e) => { this.props.onChange(e.target.files[0])}}
              type="file" name={this.props.name || "file"} accept={this.props.accept} ></input>
            <span className="text-3">{this.props.text}</span>
          </label>
          <div className={"file-input-filename text-3 " + (this.props.filename ? "" : "hidden")}>{"Le fichier a bien été enregistré"}</div>
          </div>
        
      </div>
    )
  }
}

/*
  TextArea component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal (""),
    rows: "10" - default number of rows that can be seen at once in the text area // optionnal (""),
  }
*/

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className="text-area-wrapper">
        <div className="input-group">
          <label className={"input-label " + (this.props.label ? "text-3" : " hidden")}>{this.props.label}</label>
          <textarea className={"cl-textarea " + (this.props.extraClass ? this.props.extraClass : "text-3")} required={this.props.required} name={this.props.name || ""}
           onChange={(e) => { this.props.onChange(e.target.value)}} placeholder={this.props.placeholder} value={this.props.value} rows={this.props.rows || "10"}></textarea>
        </div>
      </div>              
    )
  }
}

/*
  Button component

  props: {
    onClick: () => {...}  - field's related onClick function // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    disabled: "Firstname" - is field disabled // optionnal (false)
    text: "Suivant" - button content // optionnal ("")
  }
*/

class Button extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    return (
      <div className="button-wrapper">
        <button className={"cl-button " + (this.props.extraClass ? this.props.extraClass : "text-3")} disabled={this.props.disabled || false}
          onClick={() => { this.props.onClick()}} >
          {this.props.text}
        </button>
      </div>              
    )
  }
}

export {TextInput, FileInput, TextArea, Button, SelectInput}