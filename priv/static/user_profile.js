var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Navbar from './navbar.js';

var UserProfile = function (_React$Component) {
  _inherits(UserProfile, _React$Component);

  function UserProfile(props) {
    _classCallCheck(this, UserProfile);

    var _this = _possibleConstructorReturn(this, (UserProfile.__proto__ || Object.getPrototypeOf(UserProfile)).call(this, props));

    _this.state = {
      user: {
        email: "",
        firstname: "",
        lastname: ""
      }
    };
    return _this;
  }

  _createClass(UserProfile, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      http.get("/me").then(function (res) {
        console.log(res.status);
        console.log(res.data);
        _this2.setState({ user: res.data });
      });
    }
  }, {
    key: "sendForm",
    value: function sendForm() {
      http.post("/edit-infos", this.state.user).then(function (res) {
        console.log(res.status);
        console.log(res.data);
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      return React.createElement(
        "div",
        null,
        React.createElement(Navbar, { user: this.state.user }),
        React.createElement(
          "div",
          { className: "infos-wrapper" },
          React.createElement(
            "h1",
            { className: "page-title" },
            "Mes informations"
          ),
          React.createElement(
            "div",
            { className: "infos-content-wrapper infos-form" },
            React.createElement(
              "div",
              { className: "input-group" },
              React.createElement(
                "label",
                { className: "input-label" },
                "Nom"
              ),
              React.createElement("input", { onChange: function onChange(e) {
                  _this3.setState({ lastname: e.target.value });
                }, value: this.state.user.lastname, type: "text" })
            ),
            React.createElement(
              "div",
              { className: "input-group" },
              React.createElement(
                "label",
                { className: "input-label" },
                "Pr\xE9nom"
              ),
              React.createElement("input", { onChange: function onChange(e) {
                  _this3.setState({ firstname: e.target.value });
                }, value: this.state.user.firstname, type: "text" })
            ),
            React.createElement(
              "div",
              { className: "input-group" },
              React.createElement(
                "label",
                { className: "input-label" },
                "Adresse mail"
              ),
              React.createElement("input", { onChange: function onChange(e) {
                  _this3.setState({ email: e.target.value });
                }, value: this.state.user.email, type: "text" })
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
                      _this3.sendForm();
                    }, className: "cl-button primary" },
                  "Valider"
                )
              )
            )
          )
        )
      );
    }
  }]);

  return UserProfile;
}(React.Component);

var domContainer = document.querySelector('.user-profile');
ReactDOM.render(React.createElement(UserProfile, null), domContainer);