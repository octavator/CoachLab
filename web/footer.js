class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="footer-wrapper">
        <div className="footer-white-logo"><img className="footer-white-logo-image" src="priv/static/images/logo_blanc.svg"></img><div>Copyright © 2022 CoachLab, tous droits réservés.</div></div>
        <div><a class="contact-mail" href="mailto:contact@coachlab.fr">Nous contacter</a></div>
      </div>
    )
  }
}

export default Footer
const domContainer = document.querySelector('.footer');
ReactDOM.render(<Footer/>, domContainer);