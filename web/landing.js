import Navbar from './navbar.js'
import Logo from './utils.js'

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        firstname: "",
        lastname: "",
        email: ""
      }
    }
  }
  componentDidMount() {
    http.get("/me").then(res => {
      console.log(res.status)
      console.log(res.data)
      this.setState({user: res.data})
    })
  }
  render() {
    return (
      <div>
        <Navbar user={this.state.user}/>
        <div className="landing-wrapper">
          <div className="landing-first-page-wrapper">
          
            {/* <h1 className="page-title">Bienvenue sur&nbsp;<div className="logo-section">
            <span className="first-logo-span">Coach</span><span className="second-logo-span">Lab</span>
            </div>!</h1> */}
            <div className="logo-section">
              <img src="priv/static/images/logo_blanc.svg"></img>
            </div>
            <div className="landing-subtitle-small">Se trouver ici, maintenant</div>
            <h2 className="landing-page-title">Le centre de coaching digital !</h2>
            <div className="signup-section landing-primary-signup">
              <button onClick={() => window.location.href = "/inscription"} className="landing-signup-button">Je m'inscris !</button>
            </div>
          </div>
          <div className="landing-section">
            <div className="landing-section-column">
              <div className="landing-section-column-title">
                Prise de rendez-vous en ligne et automatique
              </div>
              <div className="landing-section-column-desc">
                Vous avez la main sur votre emploi du temps, mais les coachés peuvent également directement prendre RDV sur la plateforme selon vos disponibilités.
              </div>
              {/* <div className="signup-section">
                <button onClick={() => window.location.href = "/inscription"} className="landing-signup-button">Je m'inscris !</button>
              </div> */}
            </div>
            <div className="landing-section-column">
              <div className="landing-section-column-title">
                Vidéo live et très simple d'utilisation
              </div>
              <div className="landing-section-column-desc">
                Notre plateforme vous propose un service de vidéo intégré facilitant ainsi le suivi de vos coachés et de vos formations.
              </div>
              {/* <div className="signup-section">
                <button onClick={() => window.location.href = "/inscription"} className="landing-signup-button">Je m'inscris !</button>
              </div> */}
            </div>
          </div>
          <div className="landing-section">
            <div className="landing-section-column">
              <div className="landing-section-column-title">
               Paiement instantanné et sécurisé en toute simplicité
              </div>
              <div className="landing-section-column-desc">
                L'argent est directement versé sur votre compte bancaire. Cela vous évite de donner votre RIB à tous vos coachés et de garder ainsi vos informations bancaires secrètes.
              </div>
              {/* <div className="signup-section">
                <button onClick={() => window.location.href = "/inscription"} className="landing-signup-button">Je m'inscris !</button>
              </div> */}
            </div>
            <div className="landing-section-column">
              
            </div>
          </div>
          <div className="landing-section">
            <div className="landing-section-column centered-text">
              <div className="landing-section-column-title">
                Bientôt ouvert !
              </div>
              <div className="landing-section-column-desc">
                Soyez parmi les premiers inscrits afin de profiter de nombreux avantages ! 
              </div>
              <div className="signup-section">
                <button onClick={() => window.location.href = "/inscription"} className="landing-signup-button">Je m'inscris !</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.landing-wrapper');
ReactDOM.render(<Landing/>, domContainer);