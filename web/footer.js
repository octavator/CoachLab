class Footer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <div className="footer-wrapper">
        <div className="navbar-logo-section">
          <div className="logo-wrapper" onClick={() => window.scroll({top: 0, left: 0, behavior: 'smooth'})}>
            <img src="priv/static/images/logo_blanc.svg"/>
          </div>
        </div>
        <div className="footer-text">
          <a href="https://www.linkedin.com/company/coachlab-fr/" target="_blank" className="inline-flex">
            <img src="priv/static/images/linkedin.svg" className="footer-linkedin"/>
          </a>
        </div>
        <div className="footer-text text-3" >
          Copyright © 2022 CoachLab, tous droits réservés.
        </div>
        <div className="text-3"><a className="footer-link footer-text" href="mailto:contact@coachlab.fr"><b>Nous contacter</b></a></div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.footer');
const root = ReactDOM.createRoot(domContainer)
root.render(<Footer />);

// export default Footer
