var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Modal from './modal.js';

var Agenda = function (_React$Component) {
  _inherits(Agenda, _React$Component);

  function Agenda(props) {
    _classCallCheck(this, Agenda);

    var _this = _possibleConstructorReturn(this, (Agenda.__proto__ || Object.getPrototypeOf(Agenda)).call(this, props));

    _this.state = {
      show_schedule_modal: false,
      schedule: null,
      form: {
        duration: "30",
        isVideo: true
      },
      weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21"]
    };
    return _this;
  }

  _createClass(Agenda, [{
    key: "toggleModal",
    value: function toggleModal() {
      this.setState({ show_schedule_modal: false });
    }
  }, {
    key: "sendForm",
    value: function sendForm() {
      console.log(this.state.form);
      // http.post("/sign-up", this.state).then(res => {
      // })
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var cellClass = "schedule-cell-content ";
      var scheduleForm = [
      // <div key="firstname" className="input-group"><label className="input-label">Prénom</label> <input type="text" className="infos-form-input firstname-input"/></div>,
      // <div key="lastname" className="input-group"><label className="input-label">Nom de famille</label> <input type="text" className="infos-form-input lastname-input"/></div>,
      // <div key="email" className="input-group"><label className="input-label">Adresse email</label> <input type="text" className="infos-form-input email-input"/></div>,
      React.createElement(
        "div",
        { key: "duration", className: "input-group select-input" },
        React.createElement(
          "label",
          { className: "input-label" },
          "Dur\xE9e"
        ),
        React.createElement(
          "select",
          { onChange: function onChange(e) {
              console.log(e) && _this2.setState({ form: Object.assign({}, _this2.state.form, { duration: e.target.value }) });
            }, name: "duration", className: "infos-form-select duration-select" },
          React.createElement(
            "option",
            { value: "30" },
            "30min"
          ),
          React.createElement(
            "option",
            { value: "45" },
            "45min"
          ),
          React.createElement(
            "option",
            { value: "60" },
            "1h"
          )
        )
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
            { className: "radio-label", htmlFor: "isVideo" },
            "Oui"
          ),
          React.createElement("input", { type: "radio", defaultChecked: true, value: "true", id: "isVideo", name: "isVideo", className: "cl-radio" }),
          React.createElement(
            "label",
            { className: "radio-label", htmlFor: "isNotVideo" },
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
                _this2.sendForm() && _this2.toggleModal();
              }, className: "cl-button primary" },
            "Valider"
          )
        )
      )];
      return React.createElement(
        "div",
        { className: "agenda-wrapper" },
        React.createElement(
          "h1",
          { className: "page-title" },
          "Agenda du coach John Doe"
        ),
        React.createElement(Modal, { toggle: this.state.show_schedule_modal, closeFunc: function closeFunc() {
            _this2.toggleModal();
          },
          fields: scheduleForm, title: "Prendre un RDV", id: "appointment" }),
        React.createElement(
          "div",
          { className: "agenda-header" },
          React.createElement("div", { className: "agenda-header-section hour-column" }),
          this.state.weekdays.map(function (day) {
            return React.createElement(
              "div",
              { key: day, className: "agenda-header-section" },
              day
            );
          })
        ),
        React.createElement(
          "div",
          { className: "agenda-content-wrapper" },
          React.createElement(
            "div",
            { className: "agenda-content-column hour-column" },
            this.state.hours.map(function (hour) {
              return React.createElement(
                "div",
                { key: hour, className: "hour-cell" },
                hour,
                "h\xA0"
              );
            })
          ),
          this.state.weekdays.map(function (day) {
            return React.createElement(
              "div",
              { key: day, className: "agenda-content-column" },
              _this2.state.hours.map(function (hour) {
                return React.createElement(
                  "div",
                  { key: hour, className: "schedule-cell" },
                  React.createElement(
                    "div",
                    { onClick: function onClick() {
                        (!_this2.state.schedule || !_this2.state.schedule[day][hour]) && _this2.setState({ show_schedule_modal: true });
                      },
                      className: (!_this2.state.schedule || !_this2.state.schedule[day][hour]) && cellClass + ' empty' || cellClass },
                    "+"
                  )
                );
              })
            );
          })
        )
      );
    }
  }]);

  return Agenda;
}(React.Component);

var domContainer = document.querySelector('.agenda-wrapper');
ReactDOM.render(React.createElement(Agenda, null), domContainer);