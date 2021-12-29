class Navbar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show_dropdown: false
    }
  }
  disconnect() {
    http.get("/logout").then(res => {
      console.log(res.status)
      window.location.href = "/connexion"
    })
  }
  render() {
    return (
        <div className="navbar-wrapper">
            <div className="logo-section">
                <div className="logo-wrapper">
                  <i src="./images/logo_blanc.svg"></i>
                </div>
            </div>

            {
              Object.keys(this.props.user).includes("email") && this.props.user.email != "" 
              ?
              <div className="menu-section">
                {/* <div className="menu-item"><a href="/agenda"> Mon Agenda</a></div> */}

                {/* HACK FOR TEMP WELCOME PAGE */}
                <div className="menu-item"></div>

                <div className="menu-item user-dropdown" onClick={() => {this.setState({show_dropdown: !this.state.show_dropdown})}}>
                  {this.props.user.firstname + ' ' + this.props.user.lastname}&nbsp;<span className="downward-arrow">&#9660;</span>
                </div>
                <div className={"menu-dropdown-list" + (this.state.show_dropdown ? "" : " hidden")}>
                    <div className="menu-dropdown-list-item" onClick={() => { window.location.href = "/profil" }}>
                      Mes informations
                    </div>
                    <div className="menu-dropdown-list-item" onClick={() => {this.disconnect()}}>
                      Se déconnecter
                    </div>

                  </div>
              </div>
              
              : 
              <div className="menu-section no-login">
                <div className="menu-item login"><a href="/connexion">Se connecter</a></div>
                <div className="menu-item signup"><a href="/inscription">S'inscrire</a></div>
              </div>
            }
            </div>
    )
  }
}

export default Navbar
// const domContainer = document.querySelector('.navbar-wrapper');
// ReactDOM.render(<Navbar/>, domContainer);