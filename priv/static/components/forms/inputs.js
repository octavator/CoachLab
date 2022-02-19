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
  }
*/var TextInput=function(_React$Component){_inherits(TextInput,_React$Component);function TextInput(props){_classCallCheck(this,TextInput);var _this=_possibleConstructorReturn(this,(TextInput.__proto__||Object.getPrototypeOf(TextInput)).call(this,props));_this.state={};return _this}_createClass(TextInput,[{key:"render",value:function render(){var _this2=this;return React.createElement("div",{className:"text-input-wrapper"},React.createElement("div",{className:"input-group"},React.createElement("label",{className:"input-label"+(this.props.label?"":" hidden")},this.props.label),React.createElement("input",{className:"cl-input "+(this.props.extraClass?this.props.extraClass:""),required:this.props.required,name:this.props.name||"",onChange:function onChange(e){_this2.props.onChange(e.target.value)},placeholder:this.props.placeholder,value:this.props.value,type:this.props.type||"text"})))}}]);return TextInput}(React.Component);/*
  FileInput component

  props: {
    label: "Firstname" - field's label // optionnal (hidden)
    onChange: (e) => {...}  - field's related onChange function // required
    value: "Firstname" - field's value to bind // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    required: "Firstname" - is field required // optionnal (false)
    name: "firstname" - field's HTTP name // optionnal ("")
  }
*/var FileInput=function(_React$Component2){_inherits(FileInput,_React$Component2);function FileInput(props){_classCallCheck(this,FileInput);var _this3=_possibleConstructorReturn(this,(FileInput.__proto__||Object.getPrototypeOf(FileInput)).call(this,props));_this3.state={};return _this3}_createClass(FileInput,[{key:"render",value:function render(){var _this4=this;return React.createElement("div",{className:"file-input-wrapper "+(this.props.extraClass.includes("bg-white")?"white-text":"")},React.createElement("div",{className:"file-label"},this.props.label),React.createElement("div",{className:"file-upload-section"},React.createElement("label",{className:"file-input-label "+(this.props.extraClass?this.props.extraClass:"")},React.createElement("input",{className:"cl-file-input ",required:this.props.required,onChange:function onChange(e){_this4.props.onChange(e.target.files[0])},type:"file",name:this.props.name||"",accept:this.props.accept}),React.createElement("span",null,this.props.text)),React.createElement("div",{className:"file-input-filename"},this.props.filename)))}}]);return FileInput}(React.Component);/*
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
*/var TextArea=function(_React$Component3){_inherits(TextArea,_React$Component3);function TextArea(props){_classCallCheck(this,TextArea);var _this5=_possibleConstructorReturn(this,(TextArea.__proto__||Object.getPrototypeOf(TextArea)).call(this,props));_this5.state={};return _this5}_createClass(TextArea,[{key:"render",value:function render(){var _this6=this;return React.createElement("div",{className:"text-area-wrapper"},React.createElement("div",{className:"input-group"},React.createElement("label",{className:"input-label"+(this.props.label?"":" hidden")},this.props.label),React.createElement("textarea",{className:"cl-textarea "+(this.props.extraClass?this.props.extraClass:""),required:this.props.required,name:this.props.name||"",onChange:function onChange(e){_this6.props.onChange(e.target.value)},placeholder:this.props.placeholder,value:this.props.value,rows:this.props.rows||"10"})))}}]);return TextArea}(React.Component);/*
  Button component

  props: {
    onClick: () => {...}  - field's related onClick function // required
    extraClass: "myClass" - field's extraClass to add // optionnal ("")
    disabled: "Firstname" - is field disabled // optionnal (false)
    text: "Suivant" - button content // optionnal ("")
  }
*/var Button=function(_React$Component4){_inherits(Button,_React$Component4);function Button(props){_classCallCheck(this,Button);var _this7=_possibleConstructorReturn(this,(Button.__proto__||Object.getPrototypeOf(Button)).call(this,props));_this7.state={};return _this7}_createClass(Button,[{key:"render",value:function render(){var _this8=this;return React.createElement("div",{className:"button-wrapper"},React.createElement("button",{className:"cl-button "+(this.props.extraClass?this.props.extraClass:""),disabled:this.props.disabled||false,onClick:function onClick(){_this8.props.onClick()}},this.props.text))}}]);return Button}(React.Component);export{TextInput,FileInput,TextArea,Button};