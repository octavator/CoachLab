var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Navbar from './navbar.js';

var Landing = function (_React$Component) {
  _inherits(Landing, _React$Component);

  function Landing(props) {
    _classCallCheck(this, Landing);

    var _this = _possibleConstructorReturn(this, (Landing.__proto__ || Object.getPrototypeOf(Landing)).call(this, props));

    _this.state = {
      user: {
        firstname: "",
        lastname: "",
        email: ""
      }
    };
    return _this;
  }

  _createClass(Landing, [{
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
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement(Navbar, { user: this.state.user }),
        React.createElement(
          "div",
          { className: "landing-wrapper" },
          React.createElement(
            "h1",
            { className: "page-title" },
            "Bienvenue sur \xA0",
            React.createElement(
              "div",
              { className: "logo-section" },
              React.createElement(
                "span",
                { className: "first-logo-span" },
                "Coach"
              ),
              React.createElement(
                "span",
                { className: "second-logo-span" },
                "Lab"
              )
            ),
            "!"
          )
        )
      );
    }
  }]);

  return Landing;
}(React.Component);

var domContainer = document.querySelector('.landing-wrapper');
ReactDOM.render(React.createElement(Landing, null), domContainer);