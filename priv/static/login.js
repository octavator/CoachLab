var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Login = function (_React$Component) {
  _inherits(Login, _React$Component);

  function Login(props) {
    _classCallCheck(this, Login);

    var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this, props));

    _this.state = {
      email: "",
      password: ""
    };
    return _this;
  }

  _createClass(Login, [{
    key: "sendForm",
    value: function sendForm() {
      http.post("/sign-in", this.state).then(function (res) {
        console.log(res.status);
        console.log(res.data);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var scheduleForm = [React.createElement(
        "div",
        { key: "firstname", className: "input-group" },
        React.createElement(
          "label",
          { className: "input-label" },
          "Pr\xE9nom"
        ),
        " ",
        React.createElement("input", { type: "text", className: "infos-form-input firstname-input" })
      ), React.createElement(
        "div",
        { key: "lastname", className: "input-group" },
        React.createElement(
          "label",
          { className: "input-label" },
          "Nom de famille"
        ),
        " ",
        React.createElement("input", { type: "text", className: "infos-form-input lastname-input" })
      ), React.createElement(
        "div",
        { key: "email", className: "input-group" },
        React.createElement(
          "label",
          { className: "input-label" },
          "Adresse email"
        ),
        " ",
        React.createElement("input", { type: "text", className: "infos-form-input email-input" })
      ), React.createElement(
        "div",
        { key: "isVideo", className: "input-group radio-group" },
        React.createElement(
          "label",
          { className: "input-label" },
          "Visio-conf\xE9rence"
        ),
        React.createElement(
          "div",
          { className: "radio-choices" },
          React.createElement(
            "label",
            { className: "radio-label", "for": "isVideo" },
            "Oui"
          ),
          React.createElement("input", { type: "radio", defaultChecked: true, value: "true", id: "isVideo", name: "isVideo", className: "cl-radio" }),
          React.createElement(
            "label",
            { className: "radio-label", "for": "isNotVideo" },
            "Non"
          ),
          React.createElement("input", { id: "isNotVideo", value: "false", name: "isVideo", type: "radio", className: "cl-radio" })
        )
      ), React.createElement(
        "div",
        { key: "sendbtn", className: "input-group" },
        React.createElement(
          "div",
          { className: "button-group" },
          " ",
          React.createElement(
            "button",
            { onClick: function onClick() {
                _this2.toggleModal();
              }, className: "cl-button primary" },
            "Valider"
          )
        )
      )];
      return React.createElement(
        "div",
        { className: "login-wrapper" },
        React.createElement(
          "h1",
          { className: "page-title" },
          "Connectez-vous"
        ),
        React.createElement(
          "div",
          { className: "login-content-wrapper infos-form" },
          React.createElement(
            "div",
            { className: "input-group" },
            React.createElement(
              "label",
              { className: "input-label" },
              "Adresse mail"
            ),
            React.createElement("input", { onChange: function onChange(e) {
                _this2.setState({ email: e.target.value });
              }, value: this.state.email, type: "text" })
          ),
          React.createElement(
            "div",
            { className: "input-group" },
            React.createElement(
              "label",
              { className: "input-label" },
              "Mot de passe"
            ),
            React.createElement("input", { onChange: function onChange(e) {
                _this2.setState({ password: e.target.value });
              }, value: this.state.password, type: "text" })
          ),
          React.createElement(
            "div",
            { className: "input-group" },
            React.createElement(
              "div",
              { className: "button-group" },
              React.createElement(
                "button",
                { onClick: function onClick() {
                    _this2.sendForm();
                  }, className: "cl-button primary" },
                "Valider"
              )
            )
          )
        )
      );
    }
  }]);

  return Login;
}(React.Component);

var domContainer = document.querySelector('.login-wrapper');
ReactDOM.render(React.createElement(Login, null), domContainer);