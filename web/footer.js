class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="footer-wrapper">
        <div className="footer-white-logo" onClick={(e) => {window.scroll({top: 0, left: 0, behavior: 'smooth'})}}>
          <img className="footer-white-logo-image" src="priv/static/images/logo_blanc.svg"/>
        </div>
        <div className="footer-copyright text-3" >Copyright © 2022 CoachLab, tous droits réservés.</div>
        <div className="text-3"><a className="footer-link contact-mail" href="mailto:contact@coachlab.fr">Nous contacter</a></div>
      </div>
    )
  }
}

export default Footer
const domContainer = document.querySelector('.footer');
ReactDOM.render(<Footer/>, domContainer);