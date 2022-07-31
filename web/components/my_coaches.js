import Navbar from './navbar.js'
import {TextInput} from './forms/inputs.js'

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
        coaches: [],
        search_coaches: [],
        search_coach_name: "",
        show_coaches: false,
        new_coach_id: ""
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
  addChosenCoach() {
    if (this.state.new_coach_id == "") return
    http.post("/new_coach", {coach_id: this.state.new_coach_id}).then(res => {
      this.showFlashMessage("success", "Votre coach a bien été rajouté. Rafraichissez la page.")
    })
  }
  getMatchingCoaches(input) {
    if (input.length >= 3) {
      http.get(`/coach/search?coach_name=${encodeURIComponent(input)}`).then(res => {
        this.setState({search_coaches: res.data, show_coaches: res.data.length > 0})
      })
      .catch(err => {
        console.log(err.response)
        this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
      })
    }
    this.setState({search_coach_name: input})
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
          <div className={"add-coach-section " + (this.state.user.role == "coach" ? "hidden" : "")}>
            <h2 className="centered-text mt-2">Ajoutez un coach</h2>
            <div className="flex input-group inline">
              <div className="select-input-autocomplete-container mr-2">
                <TextInput extraClass="text-3 autocomplete-text-input white-bg" value={this.state.search_coach_name} placeholder="Nom du coach" 
                  onChange={(e) => { this.getMatchingCoaches(e) }} />
                  <div className={"select-autocomplete-wrapper" + (this.state.show_coaches ? "" : " hidden")}>
                    {
                      this.state.search_coaches.map((coach) => {
                        return (
                          <div key={coach.id} className="select-autocomplete-option text-3" onClick={() => {
                              this.setState({
                              search_coach_name: `${coach.firstname} ${coach.lastname}`,
                              new_coach_id: coach.id,
                              show_coaches: false
                            }) 
                          }}>
                            {`${coach.firstname} ${coach.lastname}`}
                          </div>
                      )})
                    }
                  </div>
              </div>
              <button onClick={() => { this.addChosenCoach() }} className="cl-button white-bg text-3 primary">
                Ajouter
              </button>
            </div>
          </div>
        </div>
    </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<MyCoaches/>, domContainer);