var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Modal = function (_React$Component) {
  _inherits(Modal, _React$Component);

  function Modal(props) {
    _classCallCheck(this, Modal);

    var _this = _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).call(this, props));

    _this.state = {
      toggle: false
    };
    return _this;
  }

  _createClass(Modal, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      return React.createElement(
        "div",
        { className: this.props.toggle ? "modal" : "modal hidden", id: this.props.id + "-modal" },
        React.createElement(
          "div",
          { className: "modal-content" },
          React.createElement(
            "div",
            { className: "close-btn", onClick: function onClick(e) {
                _this2.props.closeFunc();
              } },
            React.createElement("i", { className: "fa fa-times", "aria-hidden": "true" })
          ),
          React.createElement(
            "h1",
            { className: "page-title" },
            this.props.title
          ),
          React.createElement(
            "div",
            { className: "infos-form" },
            this.props.fields.map(function (field) {
              return field;
            })
          )
        )
      );
    }
  }]);

  return Modal;
}(React.Component);

export default Modal;