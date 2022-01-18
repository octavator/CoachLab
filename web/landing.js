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
    //@todo redirect to connected landing page if user is recognized
    http.get("/me").then(res => {
      console.log(res.status)
      console.log(res.data)
      this.setState({user: res.data})
    })
  }
  render() {
    return (
      <div>
        {/* <Navbar user={this.state.user}/> */}
        <div className="landing-wrapper">
          <div className="landing-first-page-wrapper">
            <div className="landing-page-desktop-signup-button" onClick={() => { window.location.href = "/inscription" }}>Je m'inscris</div>
            <div className="landing-logo-section">
              <img src="priv/static/images/logo_blanc.svg"></img>
            </div>
            <h2 className="landing-page-title">Le centre de coaching digital</h2>
            <div className="landing-page-mobile-signup-button" onClick={() => { window.location.href = "/inscription" }}>Je m'inscris</div>
          </div>
          <div className="landing-intermediary-gradiant-wrapper"></div>
          <div className="landing-gradiant-wrapper">
            Se trouver, ici et maintenant.
          </div>
          <div className="landing-intermediary-connection-header">
            <div className="landing-intermediary-logo">
                <img className="landing-inline-logo" src="priv/static/images/logo_cartouche_blanc.svg"></img>
              </div>
              <div className="landing-intermediary-connection-button" onClick={() => { window.location.href = "/connexion" }}>Je me connecte</div>
          </div>
          <div className="landing-text-section">
            Vous êtes intéressé.e par un coaching, vous souhaitez développer vos capacités dans un domaine particulier...
            depuis chez vous et en quelques clics ? De nombreux coachs certifiés vous attendent sur CoachLab ! Coachs professionnels, Spécialistes du développement personnel,
            Coachs sportifs, Life Coachs... Tous, diplômés et expérimentés sont à porté de clic ! 
          </div>
          <div className="landing-inscription-card">
            <div className="landing-inscription-card-text">
              Rejoignez la plateforme CoachLab,<br/> le premier centre de coaching digital !
            </div>
            <div className="landing-inscription-card-button" onClick={() => { window.location.href = "/inscription" }}>
              Je m'inscris
            </div>
          </div>
          <div className="landing-gradiant-wrapper-reversed">
            <div>Vous êtes coach certifié ? <br/>L'outil digital CoachLab est fait pour vous ! </div>
          </div>
          <div className="landing-intermediary-gradiant-reversed"></div>
          <div className="landing-advantages-section">
            <div className="landing-info-card-section">
              <div className="landing-info-card">
                <div className="landing-info-card-picto">
                <img className="landing-info-card-picto-img" src="priv/static/images/calendrier.svg"/>
                </div>
                <div className="landing-info-card-text">
                  Un agenda interactif, qui vous aide à organiser et à planifier vos coachings à votre convenance, avec inscription de vos coachés possible directement sur la plateforme selon vos disponibilités.
                </div>
              </div>
              <div className="landing-info-card">
                <div className="landing-info-card-picto">
                  <img className="landing-info-card-picto-img" src="priv/static/images/livevideo.svg"/>
                </div>
                <div className="landing-info-card-text">
                  Un outil de live vidéo simple d'utilisation, afin d'exercer votre profession où vous voulez, quand vous voulez.
                </div>
              </div>
              <div className="landing-info-card">
                <div className="landing-info-card-picto">
                  <img className="landing-info-card-picto-img" src="priv/static/images/facturation.svg"/>
                </div>
                <div className="landing-info-card-text">
                  Une facturation automatique et instantanée de vos coachings, vous permettant de gagner du temps et de vous concentrer sur votre activité uniquement. 
                </div>
              </div>
            </div>
            <div className="landing-inscription-card bg-white">
              <div className="landing-inscription-card-text">
                Soyez parmis les premiers coachs inscrits pour profiter de nombreux avantages ! 
              </div>
              <div className="landing-inscription-card-button blue-bg" onClick={() => { window.location.href = "/inscription" }}>
                Je m'inscris
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