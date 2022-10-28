/*
  TextInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    type: "password" - field's type // optionnal (text)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: true - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal ("")
    disabled: can edit field // optionnal (false)
  }
*/

class TextInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="text-input-wrapper">
        <div className="input-group">
          <label className={`input-label ${this.props.label ? (this.props.bold_label ? "bold" : "") : "hidden"}`}>
            {this.props.label}
          </label>

          <input
           className={`cl-input ${this.props.extraClass ? this.props.extraClass : "text-3"}`}
           required={this.props.required}
           disabled={this.props.disabled}
           name={this.props.name || ""}
           placeholder={this.props.placeholder}
           value={this.props.value}
           type={this.props.type || "text"}
           onChange={(e) => this.props.onChange(e.target.value)}
           onKeyDown={(e) => this.props.onKeyDown && this.props.onKeyDown(e)}
          />
        </div>
      </div>              
    )
  }
}

/*
  NumberInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    type: "password" - field's type // optionnal (text)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: true - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal ("")
    disabled: can edit field // optionnal (false)
    max: max value // optionnal (500)
    min: min value // optionnal (10)
  }
*/

class NumberInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="text-input-wrapper">
        <div className="input-group">
          <label className={`input-label ${this.props.label ? (this.props.bold_label ? "bold" : "") : "hidden"}`}>
            {this.props.label}
          </label>

          <input
           className={`cl-input ${this.props.extraClass ? this.props.extraClass : "text-3"}`}
           required={this.props.required} 
           disabled={this.props.disabled}
           name={this.props.name || ""}
           min={this.props.min || 10}
           max={this.props.max || 500}
           value={this.props.value}
           type={this.props.type || "number"}
           onChange={(e) => this.props.onChange(e.target.value)}
          />
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
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal ("")
    disabled: true // optionnal (false)
  }
*/

class SelectInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = { show_dropdown: false }
  }
  render() {
    return (
      <div className="select-input-wrapper">
        <div className="input-group">
          <label className={`input-label mt-1 ${this.props.label ? (this.props.bold_label ? "bold" : "") : "hidden"}`}>
            {this.props.label}
          </label>

          <div className={`cl-select ${this.props.extraClass ? this.props.extraClass : "text-3"}`}
           onClick={() => !this.props.disabled && this.setState({show_dropdown: !this.state.show_dropdown})}>
            <div className="cl-selected-option">
              {this.props.value}
              <i className={`fa fa-angle-${this.state.show_dropdown ? "up" : "down"} ${this.props.disabled ? "hidden" : ""}`} />
            </div>
            <div className={`cl-options-container ${this.state.show_dropdown ? "" : "hidden"}`}>
              { this.props.options.map((option, option_idx) => 
                <div key={option_idx} className="cl-option" onClick={() => this.props.onClick(option.value)}>
                  {option.label}
                </div>
              ) }
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
    required: true - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
  }
*/

class FileInput extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className={`file-input-wrapper ${this.props.extraClass.includes("bg-white") ? "white-text" : ""}`}>
        <div className={`file-label text-2 ${this.props.label ? "" : "hidden"}`}>
          {this.props.label}
        </div>

        <div className="file-upload-section">
          <label className={`file-input-label ${this.props.extraClass ? this.props.extraClass : "text-3"}`}>
            <input
             className="cl-file-input"
             required={this.props.required}
             type="file"
             name={this.props.name || "file"}
             accept={this.props.accept}
             onChange={(e) => this.props.onChange(e.target.files[0])}
            />
            <span className="text-3">{this.props.text}</span>
          </label>
          <div className={`file-input-filename text-3 ${this.props.filename ? "" : "hidden"}`}>
            Le fichier a bien été enregistré
          </div>
        </div>
      </div>
    )
  }
}

/*
  TextArea component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    bold_label: true - field's label in bold // optionnal (false)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: true - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal (""),
    rows: "10" - default number of rows that can be seen at once in the text area // optionnal ("10"),
  }
*/

class TextArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="text-area-wrapper">
        <div className="input-group">
          <label className={`input-label ${this.props.label ? (this.props.bold_label ? "bold" : "") : "hidden"}`}>
            {this.props.label}
          </label>
          <textarea
           className={`cl-textarea ${this.props.extraClass ? this.props.extraClass : "text-3"}`}
           required={this.props.required}
           name={this.props.name || ""}
           placeholder={this.props.placeholder}
           value={this.props.value}
           rows={this.props.rows || "10"}
           onChange={(e) => this.props.onChange(e.target.value)}
          />
        </div>
      </div>              
    )
  }
}

/*
  RadioButton component

  props: {
    label: "Activé" - field's label // optionnal (hidden)
    bold_label: true - field's label in bold // optionnal (false)
    onClick: () => {...}  - field's related onClick function // required
    value: true - Current value // optionnal (true)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    yesLabel: "Oui" - label Yes response // optionnal ("")
    noLabel: "No" - label no response // optionnal ("")
    disabled: true // optional (false)
  }
*/

class RadioButton extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="input-group">
        <label className={`input-label mt-1 ${this.props.label ? (this.props.bold_label ? " bold" : "") : " hidden"}`}>
          {this.props.label}
        </label>
        <div className="radio-choices">
          <div className={`radio-choice ${this.props.disabled && !this.props.value ? "hidden" : ""}`}
           onClick={() =>  this.props.onClick(true)}>
            <label className={`radio-label ${this.props.yesLabel ? "" : "hidden"}`}>
              {this.props.yesLabel || ""}
            </label>
            <div className={`cl-radio ml-1 ${this.props.value ? "selected" : ""}`}>
              <div className="cl-radio-inner" />
            </div>
          </div>
          <div className={`radio-choice ${this.props.disabled && this.props.value ? "hidden" : ""}`}
           onClick={() =>  this.props.onClick(false)}>
            <label className={`radio-label ${this.props.noLabel ? "" : "hidden"}`}>
              {this.props.noLabel || ""}
            </label>
            <div className={`cl-radio ml-1 ${!this.props.value ? "selected" : ""}`}>
              <div className="cl-radio-inner" />
            </div>
          </div>
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
    this.state = {}
  }
  render() {
    return (
      <div className="button-wrapper">
        <button
         className={`cl-button ${this.props.extraClass ? this.props.extraClass : "text-3"}`}
         disabled={this.props.disabled || false}
         onClick={() => { this.props.onClick()}}>
          {this.props.text}
        </button>
      </div>              
    )
  }
}

export {TextInput, FileInput, TextArea, Button, SelectInput, RadioButton, NumberInput}