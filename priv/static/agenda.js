var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import AgendaModal from './modal-appointment.js';
//const AgendaModal = require('./modal-appointment.js');

var Agenda = function (_React$Component) {
  _inherits(Agenda, _React$Component);

  function Agenda(props) {
    _classCallCheck(this, Agenda);

    var _this = _possibleConstructorReturn(this, (Agenda.__proto__ || Object.getPrototypeOf(Agenda)).call(this, props));

    _this.state = {
      show_schedule_modal: false,
      schedule: null,
      weekdays: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      hours: ["8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"]
    };
    return _this;
  }

  _createClass(Agenda, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var cellClass = "schedule-cell-content ";
      return React.createElement(
        "div",
        { className: "agenda-wrapper" },
        React.createElement(AgendaModal, { toggle: this.state.show_schedule_modal, closeFunc: function closeFunc() {
            _this2.setState({ show_schedule_modal: false });
          } }),
        React.createElement(
          "div",
          { className: "agenda-header" },
          React.createElement("div", { className: "agenda-header-section hour-column" }),
          this.state.weekdays.map(function (day) {
            return React.createElement(
              "div",
              { className: "agenda-header-section" },
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
                { className: "hour-cell" },
                hour,
                "h\xA0"
              );
            })
          ),
          this.state.weekdays.map(function (day) {
            return React.createElement(
              "div",
              { className: "agenda-content-column" },
              _this2.state.hours.map(function (hour) {
                return React.createElement(
                  "div",
                  { className: "schedule-cell" },
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