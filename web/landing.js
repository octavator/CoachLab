import Navbar from './navbar.js'

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
          <h1 className="page-title">Bienvenue sur &nbsp;<div className="logo-section"> 
                <span className="first-logo-span">Coach</span><span className="second-logo-span">Lab</span>
          </div>!</h1>

        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.landing-wrapper');
ReactDOM.render(<Landing/>, domContainer);