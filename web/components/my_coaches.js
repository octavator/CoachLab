import http from "../http.js"
import Navbar from './navbar.js'
import Flash from './flash.js'
import {TextInput, Button} from './forms/inputs.js'

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
  getCoaches() {
    http.get("/api/linked_users")
    .then(myCoaches => {
      this.setState({user: userData.data, coaches: myCoaches.data})
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  componentDidMount() {
    http.get("/api/me")
    .then(userData => {
      this.getCoaches()
    }).catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => this.setState({showFlash: false}), 5000)
    })
  }
  getImageExt(filepath) {
    if (!filepath) return ""
    const tokens = filepath.split(".")
    return tokens[tokens.length - 1]
  }
  addChosenCoach() {
    if (this.state.new_coach_id == "") return
    http.post("/new_coach", {coach_id: this.state.new_coach_id})
    .then(res => {
      if (res.status != 200) return this.showFlashMessage("error", "Une erreur est survenue lors de l'ajout de votre coach.")
      this.getCoaches()
      this.showFlashMessage("success", "Votre coach a bien été rajouté.") 
    })
  }
  searchMatchingCoaches(input) {
    if (input.length < 2) {
      this.setState({search_coach_name: input})
      this.setState({show_coaches: false})
      return
    }
    http.get(`/coach/search?coach_name=${encodeURIComponent(input)}`)
    .then(res => {
      let show_coaches = res.data.length > 0
      res.status == 200
       ? this.setState({search_coaches: res.data, show_coaches: show_coaches})
       : this.showFlashMessage("error", "Une erreur est survenue lors de la recherche.")
    })
    .catch(err => {
      this.showFlashMessage("error", err?.response?.data || "Une erreur inattendue est survenue.")
    })
    this.setState({search_coach_name: input})
  }
  render() {
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="coach-list">
          <h1 className="page-title text-1">{this.state.user.role == "coach" ? "Vos coachés" : "Vos coachs"}</h1>
          <div className="coach-list-wrapper">
            {
              this.state.coaches.map((coach, idx) =>
                <a key={idx} className="coach-list-row"
                  ref={this.state.user.role == "coach" ? `/infos?id=${coach.id}` : `/agenda?target_id=${coach.id}`}>
                  <div className="coach-list-avatar">
                    <img className="round-avatar" 
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null; // prevents looping
                        currentTarget.src="priv/static/images/avatar_placeholder.png";
                      }}
                      src={`priv/static/images/${coach.id}/${coach.avatar}`}/>
                  </div>
                  <div className="coach-list-name text-2">{`${coach.firstname} ${coach.lastname}`}</div>
                </a>
              )
            }
          </div>

          <div className={`add-coach-section ${this.state.user.role == "coach" ? "hidden" : ""}`}>
            <h2 className="centered-text mt-2">Ajoutez un coach</h2>
            <div className="flex input-group inline">
              <div className="select-input-autocomplete-container mr-2">
                <TextInput
                  extraClass="text-3 autocomplete-text-input white-bg"
                  value={this.state.search_coach_name}
                  placeholder="Nom du coach"
                  onChange={this.searchMatchingCoaches} />
                <div className={`select-autocomplete-wrapper ${this.state.show_coaches ? "" : "hidden"}`}>
                  {
                    this.state.search_coaches.map(coach =>
                      <div
                        key={coach.id}
                        className="select-autocomplete-option text-3" 
                        onClick={() => {
                        this.setState({
                          search_coach_name: `${coach.firstname} ${coach.lastname}`,
                          new_coach_id: coach.id,
                          show_coaches: false
                        }) 
                      }}>
                        {`${coach.firstname} ${coach.lastname}`}
                      </div>
                    )
                  }
                </div>
              </div>

              <Button onClick={() => this.addChosenCoach()} text="Ajouter"
                extraClass="cl-button white-bg text-3"/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
const root = ReactDOM.createRoot(domContainer)
root.render(<MyCoaches />)