var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function")}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}return call&&(typeof call==="object"||typeof call==="function")?call:self}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}/*
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
    disabled: can edit field // optionnal (false)
  }
*/var TextInput=function(_React$Component){_inherits(TextInput,_React$Component);function TextInput(props){_classCallCheck(this,TextInput);var _this=_possibleConstructorReturn(this,(TextInput.__proto__||Object.getPrototypeOf(TextInput)).call(this,props));_this.state={};return _this}_createClass(TextInput,[{key:"render",value:function render(){var _this2=this;return React.createElement("div",{className:"text-input-wrapper"},React.createElement("div",{className:"input-group"},React.createElement("label",{className:"input-label"+(this.props.label?this.props.bold_label?" bold":"":" hidden")},this.props.label),React.createElement("input",{className:"cl-input "+(this.props.extraClass?this.props.extraClass:"text-3"),required:this.props.required,disabled:this.props.disabled,name:this.props.name||"",onChange:function onChange(e){_this2.props.onChange(e.target.value)},placeholder:this.props.placeholder,value:this.props.value,type:this.props.type||"text"})))}}]);return TextInput}(React.Component);/*
  NumberInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    type: "password" - field's type // optionnal (text)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
    placeholder: "type here" - field's HTTP placeholder // optionnal ("")
    disabled: can edit field // optionnal (false)
    max: max value // optionnal (500)
    min: min value // optionnal (10)
  }
*/var NumberInput=function(_React$Component2){_inherits(NumberInput,_React$Component2);function NumberInput(props){_classCallCheck(this,NumberInput);var _this3=_possibleConstructorReturn(this,(NumberInput.__proto__||Object.getPrototypeOf(NumberInput)).call(this,props));_this3.state={};return _this3}_createClass(NumberInput,[{key:"render",value:function render(){var _this4=this;return React.createElement("div",{className:"text-input-wrapper"},React.createElement("div",{className:"input-group"},React.createElement("label",{className:"input-label"+(this.props.label?this.props.bold_label?" bold":"":" hidden")},this.props.label),React.createElement("input",{className:"cl-input "+(this.props.extraClass?this.props.extraClass:"text-3"),required:this.props.required,disabled:this.props.disabled,name:this.props.name||"",min:this.props.min||10,max:this.props.max||500,onChange:function onChange(e){_this4.props.onChange(e.target.value)},value:this.props.value,type:this.props.type||"number"})))}}]);return NumberInput}(React.Component);/*
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
*/var SelectInput=function(_React$Component3){_inherits(SelectInput,_React$Component3);function SelectInput(props){_classCallCheck(this,SelectInput);var _this5=_possibleConstructorReturn(this,(SelectInput.__proto__||Object.getPrototypeOf(SelectInput)).call(this,props));_this5.state={show_dropdown:false};return _this5}_createClass(SelectInput,[{key:"render",value:function render(){var _this6=this;return React.createElement("div",{className:"select-input-wrapper"},React.createElement("div",{className:"input-group"},React.createElement("label",{className:"input-label"+(this.props.label?this.props.bold_label?" bold":"":" hidden")},this.props.label),React.createElement("div",{className:"cl-select "+(this.props.extraClass?this.props.extraClass:"text-3"),required:this.props.required,name:this.props.name||"",onClick:function onClick(){_this6.setState({show_dropdown:!_this6.state.show_dropdown})}},React.createElement("div",{className:"cl-selected-option"},this.props.value,React.createElement("i",{className:"fa fa-angle-up"+(this.state.show_dropdown?"":" hidden")}),React.createElement("i",{className:"fa fa-angle-down"+(this.state.show_dropdown?" hidden":"")})),React.createElement("div",{className:"cl-options-container"+(this.state.show_dropdown?"":" hidden")},this.props.options.map(function(option,option_idx){return React.createElement("div",{key:option_idx,className:"cl-option text-2",onClick:function onClick(){_this6.props.onClick(option.value)}},option.label)})))))}}]);return SelectInput}(React.Component);/*
  FileInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
  }
*/var FileInput=function(_React$Component4){_inherits(FileInput,_React$Component4);function FileInput(props){_classCallCheck(this,FileInput);var _this7=_possibleConstructorReturn(this,(FileInput.__proto__||Object.getPrototypeOf(FileInput)).call(this,props));_this7.state={};return _this7}_createClass(FileInput,[{key:"render",value:function render(){var _this8=this;return React.createElement("div",{className:"file-input-wrapper "+(this.props.extraClass.includes("bg-white")?"white-text":"")},React.createElement("div",{className:"file-label text-2 "+(this.props.label?"":"hidden")},this.props.label),React.createElement("div",{className:"file-upload-section"},React.createElement("label",{className:"file-input-label "+(this.props.extraClass?this.props.extraClass:"text-3")},React.createElement("input",{className:"cl-file-input ",required:this.props.required,onChange:function onChange(e){_this8.props.onChange(e.target.files[0])},type:"file",name:this.props.name||"file",accept:this.props.accept}),React.createElement("span",{className:"text-3"},this.props.text)),React.createElement("div",{className:"file-input-filename text-3 "+(this.props.filename?"":"hidden")},"Le fichier a bien \xE9t\xE9 enregistr\xE9")))}}]);return FileInput}(React.Component);/*
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
*/var TextArea=function(_React$Component5){_inherits(TextArea,_React$Component5);function TextArea(props){_classCallCheck(this,TextArea);var _this9=_possibleConstructorReturn(this,(TextArea.__proto__||Object.getPrototypeOf(TextArea)).call(this,props));_this9.state={};return _this9}_createClass(TextArea,[{key:"render",value:function render(){var _this10=this;return React.createElement("div",{className:"text-area-wrapper"},React.createElement("div",{className:"input-group"},React.createElement("label",{className:"input-label "+(this.props.label?this.props.bold_label?" bold":"":" hidden")},this.props.label),React.createElement("textarea",{className:"cl-textarea "+(this.props.extraClass?this.props.extraClass:"text-3"),required:this.props.required,name:this.props.name||"",onChange:function onChange(e){_this10.props.onChange(e.target.value)},placeholder:this.props.placeholder,value:this.props.value,rows:this.props.rows||"10"})))}}]);return TextArea}(React.Component);/*
  RadioButton component

  props: {
    onClick: () => {...}  - field's related onClick function // required
    value: true - Current value // optionnal (true)
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    yesLabel: "Oui" - label Yes response // optionnal ("")
    noLabel: "Oui" - label no response // optionnal ("")
  }
*/var RadioButton=function(_React$Component6){_inherits(RadioButton,_React$Component6);function RadioButton(props){_classCallCheck(this,RadioButton);var _this11=_possibleConstructorReturn(this,(RadioButton.__proto__||Object.getPrototypeOf(RadioButton)).call(this,props));_this11.state={};return _this11}_createClass(RadioButton,[{key:"render",value:function render(){var _this12=this;return React.createElement("div",{className:"radio-choices"},React.createElement("div",{className:"radio-choice",onClick:function onClick(){_this12.props.onClick(true)}},React.createElement("label",{className:"radio-label"+(this.props.yesLabel?"":" hidden")},this.props.yesLabel||""),React.createElement("div",{className:"cl-radio ml-1"+(this.props.value?" selected":"")},React.createElement("div",{className:"cl-radio-inner"}))),React.createElement("div",{className:"radio-choice",onClick:function onClick(){_this12.props.onClick(false)}},React.createElement("label",{className:"radio-label"+(this.props.noLabel?"":" hidden")},this.props.noLabel||""),React.createElement("div",{className:"cl-radio ml-1"+(!this.props.value?" selected":"")},React.createElement("div",{className:"cl-radio-inner"}))))}}]);return RadioButton}(React.Component);/*
  Button component

  props: {
    onClick: () => {...}  - field's related onClick function // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    disabled: "Firstname" - is field disabled // optionnal (false)
    text: "Suivant" - button content // optionnal ("")
  }
*/var Button=function(_React$Component7){_inherits(Button,_React$Component7);function Button(props){_classCallCheck(this,Button);var _this13=_possibleConstructorReturn(this,(Button.__proto__||Object.getPrototypeOf(Button)).call(this,props));_this13.state={};return _this13}_createClass(Button,[{key:"render",value:function render(){var _this14=this;return React.createElement("div",{className:"button-wrapper"},React.createElement("button",{className:"cl-button "+(this.props.extraClass?this.props.extraClass:"text-3"),disabled:this.props.disabled||false,onClick:function onClick(){_this14.props.onClick()}},this.props.text))}}]);return Button}(React.Component);export{TextInput,FileInput,TextArea,Button,SelectInput,RadioButton,NumberInput};