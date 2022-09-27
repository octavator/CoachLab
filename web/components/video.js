import Navbar from './navbar.js'
import Flash from './flash.js'

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
      tracks: [],
      token: "",
      showFlash: false,
      flashType: '',
      flashMessage: '',
    }
  }
  componentDidMount() {
    http.get("/api/me/agenda").then(agendaData => {
      //@TODO: empecher un mec de rentrer dans la room s'il a pas payé
      let resId = this.state.roomId.split("+")[0]
      let resa = agendaData.data.agenda[resId]
      //@TODO: Gérer room type en créant la room plutot que ad hoc connect
      let roomType = resa.isMulti ? "group": "go"
      if (Video.isSupported) {
        http.get("/video-token").then(token => {
          Video.createLocalVideoTrack().then(track => document.getElementById('local-media').appendChild(track.attach()))
          this.setState({schedule: agendaData.data.agenda, user: agendaData.data.user, token: token.data, roomType: roomType})
        })
      } else this.showFlashMessage("error", "Votre navigateur actuel n'est pas compatible avec notre module vidéo.")
    }).catch(err => {
      this.showFlashMessage("error", err.response && err.response.data || "Une erreur inattendue est survenue.")
    })
  }
  showFlashMessage(type, message) {
    this.setState({showFlash: true, flashMessage: message, flashType: type}, () => {
      setTimeout(() => { this.setState({showFlash: false})}, 5000)
    })
  }
  getRemoteTracks(participant) {
    participant.tracks.forEach(publication => {
      if (publication.track) {
        let tracks = [...this.state.tracks]
        // let tracks = [...this.state.tracks].filter(track => { console.log(new_track.name, track.name) ;track.name != new_track.name })
        this.setState({tracks: tracks.concat([publication.track])})
      }
    })
    participant.on('trackSubscribed', new_track => {
      let tracks = [...this.state.tracks]
      console.log("new track name", new_track.name)
      console.log("is already in room ?", tracks.some(t => t.name == new_track.name))
      // let tracks = [...this.state.tracks].filter(track => { console.log(new_track.name, track.name) ;track.name != new_track.name })
      this.setState({tracks: tracks.concat([new_track])})
    })
  }
  startVideoLive() {
    Video.connect(this.state.token, {
      name: this.state.roomId,
      audio: {name: `audio+${this.state.user.id}+${this.state.user.firstname} ${this.state.user.lastname}`},
      video: {name: `video+${this.state.user.id}+${this.state.user.firstname} ${this.state.user.lastname}`},
      type: this.state.roomType
    })
    .then(room => {
      room.participants.forEach(participant => this.getRemoteTracks(participant))
      room.on('participantConnected', participant => this.getRemoteTracks(participant))
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
      this.setState({room: room, hasJoined: true})
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
    let new_sendVideo = this.state.sendVideo ? false : {}
    this.setState({sendVideo: new_sendVideo})
    if (!this.state.room) return
    this.state.room.localParticipant.videoTracks.forEach(publication => {
      if (new_sendVideo) publication.track.enable()
      else publication.track.disable()
    })
  }
  toggleTrack(isDisabled, trackId) {
    const new_tracks = this.state.tracks.map(t => {
      if (t.sid == trackId) return {...t, disabled: isDisabled}
      return t
    })
    this.setState({tracks: new_tracks})
  }
  handleTrackToggle(track) {
    track.on('disabled', () => this.toggleTrack(true, track.sid))
    track.on('enabled', () => this.toggleTrack(false, track.sid))
  }
  attachTracks(type) {
    this.state.tracks.filter(track => track.kind == type).forEach((track, idx) => {
      const target = document.getElementById(`remote-${type}-${idx}`)
      const isAttached = document.querySelector(`#remote-${type}-${idx} ${type}`)
      if (!target || isAttached) return 
      target.appendChild(track.attach())
      this.handleTrackToggle(track)
    })
  }
  componentDidUpdate() {
    this.attachTracks("video")
    this.attachTracks("audio")
  }
  render() {
    // @TODO: tester puis repliquer le component Flash sur les autres pages
    // this.showFlashMessage("error", "coucou ca marche ?")

    //@TODO: when more than 4 ppl in room, only show the coach's video
    console.log(this.state.tracks, "tracks")
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <Flash showFlash={this.state.showFlash} flashType={this.state.flashType} flashMessage={this.state.flashMessage} />
        <div className="video">
          <div className="video-wrapper">
            <div className={`local-media-video ${this.state.sendVideo ? "" : "black-bg"}`}>
              <div id="local-media" className={`local-media ${this.state.sendVideo ? "" : "transparent"}`} style={{}} />
            </div>
            { this.state.tracks.filter(track => track.kind == "audio").map((track, idx) => 
              <div key={`${track.name}`}>
                <div id={`remote-audio-${idx}`} className="remote-audio" style={{}} />                
              </div>
            ) }
            { this.state.tracks.filter(track => track.kind == "video").map((track, idx) => 
              <div key={`${track.name}`} className={`participant-block ${track.disabled ? "hidden" : ""}`}>
                <div id={`remote-video-${idx}`} className="remote-video" style={{}} />                
              </div>
            ) }
          </div>
          <div className="flex flex-center mt-2">
            <div onClick={() => {this.toggleAudio()}} className="cl-button ml-2">
              { this.state.sendAudio ? "Désactiver Audio" : "Activer Audio"}
            </div>
            <div onClick={() => {this.toggleVideo()}} className="cl-button ml-2">
              { this.state.sendVideo ? "Désactiver Vidéo" : "Activer Vidéo"}
            </div>
            <div onClick={() => {this.startVideoLive()}} className={`cl-button ml-2 ${this.state.hasJoined ? "hidden" : ""}`}>
              Rejoindre la réunion
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const domContainer = document.querySelector('.page-wrapper');
ReactDOM.render(<ClabVideo/>, domContainer);