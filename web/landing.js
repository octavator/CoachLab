import http from "./http.js"

class Landing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        firstname: "",
        lastname: "",
        email: ""
      },
      show_navbar: false
    }
  }
  handleNavbar() {
    const options = {
      root: null,
      threshold: 0.20 // 0 - 1 this work as a trigger. 
    }

    const targetOn = document.querySelector('.landing-text-section');
    const targetOff = document.querySelector('.landing-first-page-wrapper');
    const observerOn = new IntersectionObserver(entries =>
      entries.forEach((e) => {
        if (e.isIntersecting) this.setState({show_navbar: true})
      })
    , options)
    const observerOff = new IntersectionObserver(entries =>
      entries.forEach((e) => {
        if (e.isIntersecting) this.setState({show_navbar: false})
      })
    , options)

    observerOn.observe(targetOn)
    observerOff.observe(targetOff)
  }
  componentDidMount() {
    http.get("/api/me").then(res => {
      if (res.status == 200) return window.location.href = "/coachlab/bienvenue"
    }).catch(e => { return })

    this.handleNavbar()
  }
  render() {
    return (
      <div className="landing-wrapper">
        <div className="landing-first-page-wrapper">
          <div className="landing-first-page-buttons">
            <div className="cl-button bg-white text-3 landing-page-desktop-signup-button" onClick={() => window.location.href = "/coachlab/inscription" }>
              Je m'inscris
            </div>
          </div>
          <div className="landing-logo-section">
            <img style={{"width": "100%"}} src="priv/static/images/logo_blanc.svg"/>
          </div>
          <h2 className="landing-page-title">Le centre de coaching digital</h2>
          <div className="landing-first-page-buttons">
            <div className="cl-button bg-white text-3 landing-page-mobile-signup-button mr-1" onClick={() => window.location.href = "/coachlab/inscription" }>
              Je m'inscris
            </div>
          </div>
        </div>
        <div className="landing-intermediary-gradiant-wrapper"/>
        <div className="landing-gradient-wrapper text-1">
          {/* <div className="landing-desktop-pictures-container">
            <img className="landing-picture-desktop" src="priv/static/images/mickey_2.png"/>
          </div> */}
          <div className="landing-picture-text-container">Se trouver.<br/>Ici et maintenant.</div>
        </div>
        {/* 2ND NAVBAR */}
        <div className={`landing-intermediary-connection-header ${this.state.show_navbar ? "" : "hidden"}`} >
          <div className="landing-intermediary-logo" onClick={() => window.scroll({top: 0, left: 0, behavior: 'smooth'})}>
            <img className="landing-inline-logo" src="priv/static/images/logo.svg"/>
          </div>
          <div className="flex">
            <div className="cl-button text-3 landing-intermediary-connection-button" onClick={() => window.location.href = "/coachlab/inscription" }>
              Je m'inscris
            </div>
          </div>
        </div>
        <div className="landing-text-section text-2">
          Vous êtes intéressé.e par un coaching, vous souhaitez développer vos capacités dans un domaine particulier... depuis chez vous et en quelques clics ? <br/>
          De nombreux coachs certifiés vous attendent sur CoachLab !<br/>
          Coachs professionnels, Spécialistes du développement personnel,
          Coachs sportifs, Life Coachs... Tous, diplômés et expérimentés, sont à portée de clic ! 
        </div>
        <div className="landing-inscription-card">
          <div className="landing-inscription-card-text text-2">
            Rejoignez la plateforme CoachLab,<br/> le premier centre de coaching digital
          </div>
          <div className="cl-button text-3 landing-inscription-card-button" onClick={() => window.location.href = "/coachlab/inscription" }>
            Je m'inscris
          </div>
        </div>
        <div className="landing-gradient-wrapper-reversed text-1">
          Vous êtes coach certifié ? <br/>
          L'outil digital CoachLab est fait pour vous !
        </div>
        <div className="landing-intermediary-gradiant-reversed"/>
        <div className="landing-advantages-section">
          <div className="landing-info-card-section">
            <div className="landing-info-card">
              <div className="landing-info-card-picto">
                <img className="landing-info-card-picto-img" src="priv/static/images/calendrier.svg"/>
              </div>
              <div className="landing-info-card-text text-3">
                Un agenda interactif, qui vous aide à organiser et à planifier vos coachings à votre convenance, avec inscription de vos coachés directement sur la plateforme, selon vos disponibilités.
              </div>
            </div>
            <div className="landing-info-card">
              <div className="landing-info-card-picto">
                <img className="landing-info-card-picto-img" src="priv/static/images/livevideo.svg"/>
              </div>
              <div className="landing-info-card-text text-3">
                Un outil de live vidéo simple d'utilisation, afin d'exercer votre profession où vous voulez, quand vous voulez.
              </div>
            </div>
            <div className="landing-info-card">
              <div className="landing-info-card-picto">
                <img className="landing-info-card-picto-img" src="priv/static/images/facturation.svg"/>
              </div>
              <div className="landing-info-card-text text-3">
                Une facturation automatique et instantanée de vos coachings, vous permettant de gagner du temps et de vous concentrer sur votre activité uniquement.
              </div>
            </div>
          </div>
          <div className="landing-inscription-card bg-white">
            <div className="landing-inscription-card-text text-2">
              Soyez parmi les premiers coachs inscrits pour profiter de nombreux avantages !
            </div>
            <div className="cl-button landing-inscription-card-button text-3 blue-bg" onClick={() => window.location.href = "/coachlab/inscription" }>
              Je m'inscris
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.landing-wrapper');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(Landing, null));