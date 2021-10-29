var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AgendaModal = function (_React$Component) {
  _inherits(AgendaModal, _React$Component);

  function AgendaModal(props) {
    _classCallCheck(this, AgendaModal);

    var _this = _possibleConstructorReturn(this, (AgendaModal.__proto__ || Object.getPrototypeOf(AgendaModal)).call(this, props));

    _this.state = {
      toggle: false
    };
    return _this;
  }

  _createClass(AgendaModal, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      console.log("toggle", this.props.toggle);
      if (this.props.toggle) {
        return React.createElement(
          "div",
          { className: "modal", id: "appointment-modal" },
          React.createElement(
            "div",
            { className: "appointment-modal-content" },
            React.createElement(
              "h1",
              { className: "landing-title" },
              "Prendre un RDV"
            ),
            React.createElement(
              "div",
              { className: "infos-form" },
              React.createElement(
                "div",
                { className: "input-group" },
                React.createElement(
                  "label",
                  { className: "input-label" },
                  "Pr\xE9nom"
                ),
                React.createElement("input", { type: "text", className: "infos-form-input firstname-input" })
              ),
              React.createElement(
                "div",
                { className: "input-group" },
                React.createElement(
                  "label",
                  { className: "input-label" },
                  "Nom de famille"
                ),
                React.createElement("input", { type: "text", className: "infos-form-input lastname-input" })
              ),
              React.createElement(
                "div",
                { className: "input-group" },
                React.createElement(
                  "label",
                  { className: "input-label" },
                  "Adresse email"
                ),
                React.createElement("input", { type: "text", className: "infos-form-input email-input" })
              ),
              React.createElement(
                "div",
                { className: "button-group" },
                React.createElement(
                  "button",
                  { onClick: function onClick() {
                      _this2.props.closeFunc();
                    }, className: "cl-button primary" },
                  "Valider"
                )
              )
            )
          )
        );
      } else return '';
    }
  }]);

  return AgendaModal;
}(React.Component);

export default AgendaModal;

// const domContainer = document.querySelector('#appointment-modal');
// ReactDOM.render(<AgendaModal toggle={true} />, domContainer);