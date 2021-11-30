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
        window.location.href = "/";
        console.log("Connecté avec succès");
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

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
              }, value: this.state.email, name: "email", type: "text" })
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
              }, value: this.state.password, name: "password", type: "password" })
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
          ),
          React.createElement(
            "div",
            { className: "sign-up-section", onClick: function onClick() {
                window.location.href = "/inscription";
              } },
            "Cliquez-ici pour cr\xE9er votre compte"
          )
        )
      );
    }
  }]);

  return Login;
}(React.Component);

var domContainer = document.querySelector('.login-wrapper');
ReactDOM.render(React.createElement(Login, null), domContainer);