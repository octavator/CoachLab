import Navbar from './navbar.js'

class MyCoaches extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        user: {
          firstname: "",
          lastname: "",
          role: "coach"
        },
        showFlash: false,
        flashType: '',
        flashMessage: '',
        coaches: []
    }
  }
  componentDidMount() {
    http.get("/me").then(userData => {
      http.get("/api/linked_users").then(myCoaches => {
        this.setState({user: userData.data, coaches: myCoaches.data})
      })
      .catch(err => {
        this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
      })
    })
    .catch(err => {
      this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  getImageExt(filepath) {
    if (!filepath) return ""
    const tokens = filepath.split(".")
    return tokens[tokens.length - 1]
  }
  render() {
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
        <div className="coach-list">
          <h1 className="page-title text-1">{this.state.user.role == "coach" ? 'Vos coachés' : "Vos coachs"}</h1>
          <div className="coach-list-wrapper">
            {
              this.state.coaches.map((coach, idx) => {
                return (
                  <div key={idx} onClick={() => {window.location.href = `/agenda?target_id=${coach.id}`}} className="coach-list-row">
                    <div className="coach-list-avatar">
                      <img className="round-avatar" 
                        onError={({ currentTarget }) => {
                          currentTarget.onerror = null; // prevents looping
                          currentTarget.src="priv/static/images/avatar_placeholder.png";
                        }}
                        src={`priv/static/images/${coach.id}/avatar.${this.getImageExt(coach.avatar)}`}/>
                    </div>
                    <div className="coach-list-name text-2">{`${coach.firstname} ${coach.lastname}`}</div>
                  </div>
                )
              })
            }
          </div>
        </div>
    </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<MyCoaches/>, domContainer);