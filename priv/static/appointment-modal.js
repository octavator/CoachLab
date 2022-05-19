var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Modal from './component/modal.js';

var AppointmentModal = function (_React$Component) {
  _inherits(AppointmentModal, _React$Component);

  function AppointmentModal(props) {
    _classCallCheck(this, AppointmentModal);

    var _this = _possibleConstructorReturn(this, (AppointmentModal.__proto__ || Object.getPrototypeOf(AppointmentModal)).call(this, props));

    _this.state = {};
    return _this;
  }

  _createClass(AppointmentModal, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var scheduleForm = [React.createElement(
        "div",
        { key: "duration", className: "details-duration-section" },
        React.createElement(
          "div",
          { className: "details-duration-label" },
          "Dur\xE9e:"
        ),
        React.createElement(
          "div",
          { className: "details-duration-value" },
          this.props.appointment.duration
        )
      ), React.createElement(
        "div",
        { key: "isVideo", className: "details-isVideo-section" },
        React.createElement(
          "div",
          { className: "details-isVideo-label" },
          "Visio-conf\xE9rence:"
        ),
        React.createElement(
          "div",
          { className: "details-isVideo-value" },
          this.props.appointment.isVideo ? "Oui" : "Non"
        )
      ), React.createElement(
        "div",
        { key: "visioLink", className: "details-visioLink-section" + (this.props.appointment.isVideo ? "" : " hidden") },
        React.createElement(
          "div",
          { className: "details-visioLink-label" },
          "Lien de la visio-conf\xE9rence:"
        ),
        React.createElement(
          "div",
          { className: "details-visioLink-value" },
          this.props.appointment.isVideo ? "Oui" : "Non"
        )
      )];
      return React.createElement(Modal, { toggle: this.props.show_schedule_modal, closeFunc: function closeFunc() {
          _this2.props.toggleModal;
        },
        fields: scheduleForm, title: this.props.title, id: this.props.id });
    }
  }]);

  return AppointmentModal;
}(React.Component);

export default AppointmentModal;