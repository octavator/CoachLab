import http from "./http.js";

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstname: "",
        lastname: "",
        email: "",
      },
      show_navbar: false,
      isLoading: false,
      animationReady: false,
    };
  }

  componentDidMount() {
    // Check if user is already logged in
    this.setState({ isLoading: true });

    http
      .get("/api/me")
      .then((res) => {
        this.setState({ isLoading: false });
        if (res.status == 200) return (window.location.href = "/bienvenue");
      })
      .catch((e) => {
        this.setState({ isLoading: false });
        return;
      });

    // Initialize navbar behavior
    this.handleNavbar();

    // Add stagger animations to elements
    this.initializeAnimations();
  }

  handleNavbar() {
    const options = {
      root: null,
      threshold: 0.2,
    };

    const targetOn = document.querySelector(".landing-text-section");
    const targetOff = document.querySelector(".landing-first-page-wrapper");

    if (targetOn && targetOff) {
      const observerOn = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) this.setState({ show_navbar: true });
          }),
        options,
      );

      const observerOff = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) this.setState({ show_navbar: false });
          }),
        options,
      );

      observerOn.observe(targetOn);
      observerOff.observe(targetOff);
    }
  }

  initializeAnimations() {
    // Add stagger animation classes to cards
    setTimeout(() => {
      const cards = document.querySelectorAll(".landing-info-card");
      cards.forEach((card, index) => {
        card.classList.add("stagger-item");
        card.style.animationDelay = `${index * 150}ms`;
      });

      this.setState({ animationReady: true });
    }, 100);
  }

  handleSignupClick = () => {
    const button = event.target;
    button.classList.add("animate-bounce");

    setTimeout(() => {
      window.location.href = "/inscription";
    }, 300);
  };

  handleScrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  renderHeroSection() {
    return (
      <div className="landing-first-page-wrapper min-h-screen flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
        <div className="landing-first-page-buttons absolute top-4 right-4 z-10">
          <button
            className="btn btn-primary btn-lg animate-fade-in animation-delay-700 hover-lift"
            onClick={this.handleSignupClick}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Chargement...
              </>
            ) : (
              "Je m'inscris"
            )}
          </button>
        </div>

        <div className="landing-logo-section mb-8 animate-fade-in">
          <img
            src="priv/static/images/logo_blanc.svg"
            alt="CoachLab Logo"
            className="w-full max-w-xs hover-scale"
          />
        </div>

        <h1 className="landing-page-title welcome-page-title text-5xl md:text-6xl font-bold mb-8 animate-fade-in animation-delay-300">
          Le centre de coaching digital
        </h1>

        <div className="landing-first-page-buttons flex gap-4 animate-fade-in animation-delay-500">
          <button
            className="btn btn-primary btn-xl hover-lift button-ripple"
            onClick={this.handleSignupClick}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Chargement...
              </>
            ) : (
              "Je m'inscris"
            )}
          </button>
        </div>

        {/* Floating animation elements */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-float animation-delay-1000 opacity-30"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary rounded-full animate-float animation-delay-1500 opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-primary rounded-full animate-float animation-delay-2000 opacity-20"></div>
      </div>
    );
  }

  renderStickyNavbar() {
    return (
      <div
        className={`landing-intermediary-connection-header ${this.state.show_navbar ? "animate-slide-in-down" : "hidden"}`}
      >
        <div
          className="landing-intermediary-logo hover-scale cursor-pointer"
          onClick={this.handleScrollToTop}
        >
          <img
            className="landing-inline-logo h-10"
            src="priv/static/images/logo.svg"
            alt="CoachLab Logo"
          />
        </div>
        <div className="flex">
          <button
            className="btn btn-primary hover-lift"
            onClick={this.handleSignupClick}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Chargement...
              </>
            ) : (
              "Je m'inscris"
            )}
          </button>
        </div>
      </div>
    );
  }

  renderFeatureSection() {
    return (
      <div className="landing-gradient-wrapper">
        <div className="container mx-auto px-4">
          <div className="landing-desktop-pictures-container mb-8">
            <img
              className="landing-picture-desktop max-w-md mx-auto animate-fade-in hover-scale"
              src="priv/static/images/mickey_2.png"
              alt="Coaching illustration"
            />
          </div>
          <div className="landing-picture-text-container text-2xl md:text-3xl font-bold text-center animate-fade-in animation-delay-300">
            Se trouver.
            <br />
            <span className="animate-glow">Ici et maintenant.</span>
          </div>
        </div>
      </div>
    );
  }

  renderTextSection() {
    return (
      <div className="landing-text-section">
        <div className="container mx-auto px-4">
          <p className="text-lg md:text-xl leading-relaxed animate-fade-in">
            Vous êtes intéressé.e par un coaching, vous souhaitez développer vos
            capacités dans un domaine particulier... depuis chez vous et en
            quelques clics ?<br />
            <strong>
              De nombreux coachs certifiés vous attendent sur CoachLab !
            </strong>
            <br />
            Coachs professionnels, Spécialistes du développement personnel,
            Coachs sportifs, Life Coachs... Tous, diplômés et expérimentés, sont
            à portée de clic !
          </p>
        </div>
      </div>
    );
  }

  renderSignupCard() {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="landing-inscription-card hover-lift">
          <div className="landing-inscription-card-text text-xl md:text-2xl mb-6">
            Rejoignez la plateforme CoachLab,
            <br />
            <span className="font-bold">
              le premier centre de coaching digital
            </span>
          </div>
          <button
            className="btn btn-primary btn-lg hover-bounce button-ripple"
            onClick={this.handleSignupClick}
            disabled={this.state.isLoading}
          >
            {this.state.isLoading ? (
              <>
                <span className="loading-spinner mr-2"></span>
                Inscription...
              </>
            ) : (
              "Je m'inscris"
            )}
          </button>
        </div>
      </div>
    );
  }

  renderCoachSection() {
    return (
      <div className="landing-gradient-wrapper-reversed">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 animate-fade-in">
            Vous êtes coach certifié ?<br />
            <span className="text-primary">
              L'outil digital CoachLab est fait pour vous !
            </span>
          </h2>
        </div>
      </div>
    );
  }

  renderAdvantagesSection() {
    return (
      <div className="landing-advantages-section bg-gradient-to-r from-primary-500 to-secondary-500 py-24">
        <div className="container mx-auto px-4">
          <div className="landing-info-card-section">
            <div className="landing-info-card hover-lift">
              <div className="landing-info-card-picto mb-6">
                <img
                  className="landing-info-card-picto-img"
                  src="priv/static/images/calendrier.svg"
                  alt="Calendrier"
                />
              </div>
              <div className="landing-info-card-text">
                <strong>Un agenda interactif</strong>, qui vous aide à organiser
                et à planifier vos coachings à votre convenance, avec
                inscription de vos coachés directement sur la plateforme, selon
                vos disponibilités.
              </div>
            </div>

            <div className="landing-info-card hover-lift">
              <div className="landing-info-card-picto mb-6">
                <img
                  className="landing-info-card-picto-img"
                  src="priv/static/images/livevideo.svg"
                  alt="Vidéo en direct"
                />
              </div>
              <div className="landing-info-card-text">
                <strong>Un outil de live vidéo</strong> simple d'utilisation,
                afin d'exercer votre profession où vous voulez, quand vous
                voulez.
              </div>
            </div>

            <div className="landing-info-card hover-lift">
              <div className="landing-info-card-picto mb-6">
                <img
                  className="landing-info-card-picto-img"
                  src="priv/static/images/facturation.svg"
                  alt="Facturation"
                />
              </div>
              <div className="landing-info-card-text">
                <strong>Une facturation automatique</strong> et instantanée de
                vos coachings, vous permettant de gagner du temps et de vous
                concentrer sur votre activité uniquement.
              </div>
            </div>
          </div>

          <div className="landing-inscription-card bg-white hover-lift animate-fade-in animation-delay-700">
            <div className="landing-inscription-card-text text-neutral-900 mb-6">
              <strong>Soyez parmi les premiers coachs inscrits</strong> pour
              profiter de nombreux avantages !
            </div>
            <button
              className="btn btn-primary btn-lg hover-bounce button-ripple"
              onClick={this.handleSignupClick}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? (
                <>
                  <span className="loading-spinner mr-2"></span>
                  Inscription...
                </>
              ) : (
                "Je m'inscris"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="landing-wrapper">
        {this.renderHeroSection()}

        <div className="landing-intermediary-gradiant-wrapper"></div>

        {this.renderFeatureSection()}

        {this.renderStickyNavbar()}

        {this.renderTextSection()}

        {this.renderSignupCard()}

        {this.renderCoachSection()}

        <div className="landing-intermediary-gradiant-reversed"></div>

        {this.renderAdvantagesSection()}

        {/* Accessibility improvements */}
        <div className="sr-only">
          <h2>Navigation rapide</h2>
          <ul>
            <li>
              <a href="#inscription">S'inscrire</a>
            </li>
            <li>
              <a href="#avantages">Nos avantages</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

// Initialize the component
const domContainer = document.querySelector(".landing-wrapper");
if (domContainer) {
  const root = ReactDOM.createRoot(domContainer);
  root.render(<Landing />);
}
