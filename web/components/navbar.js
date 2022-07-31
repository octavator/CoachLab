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
          this.props.user.email && this.props.user.email != "" 
          ?
          <div className="menu-section">
            <div className={"menu-item text-3"}><a href="/agenda"> Mon Agenda</a></div>
            <div className={"menu-item text-3"}><a href="/mes_coaches">{ this.props.user.role == "coach" ? "Mes coachés" : "Mes coachs"}</a></div>
            <div className="menu-item user-dropdown text-3" onMouseOver={() => {this.setState({show_dropdown: true})}}>
              {this.props.user.firstname + ' ' + this.props.user.lastname}&nbsp;<span className="downward-arrow">&#9660;</span>
            </div>
            <div className={"menu-dropdown-list" + (this.state.show_dropdown ? "" : " hidden")} onMouseOver={() => {this.setState({show_dropdown: true})}}
              onMouseOut={() => {this.setState({show_dropdown: false})}}>
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