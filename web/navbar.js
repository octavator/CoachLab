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
        <div className={"navbar-wrapper" + ( this.props.blue_bg ? " blue-bg" : "")}>
            <div className="navbar-logo-section">
                <div onClick={() => {window.location.href = "/"}} className="logo-wrapper">
                  <img src={"priv/static/images/" + (this.props.blue_bg ? "logo_blanc.svg" : "logo.svg") }/>
                </div>
            </div>

            {
              Object.keys(this.props.user).includes("email") && this.props.user.email != "" 
              ?
              <div className="menu-section">
                {/* <div className="menu-item"><a href="/agenda"> Mon Agenda</a></div> */}

                {/* HACK FOR TEMP WELCOME PAGE */}
                <div className="menu-item"></div>

                <div className="menu-item user-dropdown text-3" onClick={() => {this.setState({show_dropdown: !this.state.show_dropdown})}}>
                  {this.props.user.firstname + ' ' + this.props.user.lastname}&nbsp;<span className="downward-arrow">&#9660;</span>
                </div>
                <div className={"menu-dropdown-list" + (this.state.show_dropdown ? "" : " hidden")}>
                    <div className="menu-dropdown-list-item text-3" onClick={() => { window.location.href = "/profil" }}>
                      Mes informations
                    </div>
                    <div className="menu-dropdown-list-item text-3" onClick={() => {this.disconnect()}}>
                      Se déconnecter
                    </div>

                  </div>
              </div>
              
              : 
              <div></div>
            }
            </div>
    )
  }
}

export default Navbar
// const domContainer = document.querySelector('.navbar-wrapper');
// ReactDOM.render(<Navbar/>, domContainer);