import Navbar from './navbar.js'
const Video = Twilio.Video;
class ClabVideo extends React.Component {
  constructor(props) {
    super(props)
    const urlParams = new URLSearchParams(document.location.search)
    const roomId = urlParams.get("roomId")
    this.state = {
        user: {
          firstname: "",
          lastname: "",
          role: "coach"
        },
        roomId: roomId,
        sendAudio: true,
        sendVideo: true,
        room: undefined,
        schedule: {},
        token: "",
        showFlash: false,
        flashType: '',
        flashMessage: '',
    }
  }
  componentDidMount() {
    http.get("/me/agenda").then(agendaData => {
      //@TODO: empecher un mec de rentrer dans la room s'il a pas payé
      if (Video.isSupported) {
        http.get("/video-token").then(token => {
          Video.createLocalVideoTrack().then(track => {
            const localMediaContainer = document.getElementById('local-media')
            localMediaContainer.appendChild(track.attach())
          });
          this.setState({schedule: agendaData.data.agenda, user: agendaData.data.user, token: token.data})
        })
      } else this.showFlashMessage("error", "Votre navigateur actuel n'est pas compatible avec notre module vidéo.")
    }).catch(err => {
      this.showFlashMessage("error", err.response.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  getRemoteVideo(participant) {
    participant.tracks.forEach(publication => {
      if (publication.track) {
        document.getElementById('remote-media').appendChild(publication.track.attach())
      }
    })
    participant.on('trackSubscribed', track => {
      document.getElementById('remote-media').appendChild(track.attach())
    })
  }
  startVideoLive() {
    Video.connect(this.state.token, {
      name: this.state.roomId, audio: true, video: { }
    })
    .then(room => {
      room.participants.forEach(participant => {
        this.getRemoteVideo(participant)
      })
      room.on('participantConnected', participant => {
        this.getRemoteVideo(participant)
      })
      if (!this.state.sendAudio) {
        room.localParticipant.audioTracks.forEach(publication => {
          publication.track.disable()
        })    
      }
      if (!this.state.sendVideo) {
        room.localParticipant.videoTracks.forEach(publication => {
          publication.track.disable()
        })    
      }
      this.setState({room: room})
    }, error => {
      this.showFlashMessage("error", error.message || "Une erreur inattendue est survenue.")
    })
  }

  toggleAudio() {
    this.setState({sendAudio: !this.state.sendAudio})
    if (!this.state.room) return
    this.state.room.localParticipant.audioTracks.forEach(publication => {
      if (this.state.sendAudio) publication.track.disable()
      else publication.track.enable()
    })
  }
  toggleVideo() {
    this.setState({sendVideo: this.state.sendVideo ? false : {}})
    if (!this.state.room) return
    this.state.room.localParticipant.videoTracks.forEach(publication => {
      if (this.state.sendVideo) publication.track.disable()
      else publication.track.enable()
    })
  }
  handleTrackDisabled(track) {
    track.on('disabled', () => {
      console.log(track)
      /* Hide the associated <video> element and show an avatar image. */
    });
  }
  render() {
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
        <div className="video">
          {/* <h1 className="page-title text-1">{this.state.user.role == "coach" ? 'Vos coachés' : "Vos coachs"}</h1> */}
          <div className="video-wrapper">
            <div id="local-media" style={{border: "1px solid grey"}}></div>
            <div id="remote-media" style={{height: "300px", width: "300px", border: "1px solid red"}}></div>
            <div onClick={() => {this.toggleAudio()}} className="cl-button">
              { this.state.sendAudio ? "Désactiver Audio" : "Activer Audio"}
            </div>
            <div onClick={() => {this.toggleVideo()}} className="cl-button">
              { this.state.sendVideo ? "Désactiver Vidéo" : "Activer Vidéo"}
            </div>
            <div onClick={() => {this.startVideoLive()}} className="cl-button">Go</div>
          </div>
        </div>
    </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<ClabVideo/>, domContainer);