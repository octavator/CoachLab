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
        tracks: [],
        token: "",
        showFlash: false,
        flashType: '',
        flashMessage: '',
    }
  }
  componentDidMount() {
    console.log(this.state.roomId)
    http.get("/me/agenda").then(agendaData => {
      //@TODO: empecher un mec de rentrer dans la room s'il a pas payé
      let resId = this.state.roomId.split("+")[0]
      let resa = agendaData.data.agenda[resId]
      let roomType = resa.isMulti ? "group": "go"
      if (Video.isSupported) {
        http.get("/video-token").then(token => {
          Video.createLocalVideoTrack().then(track => {
            const localMediaContainer = document.getElementById('local-media')
            localMediaContainer.appendChild(track.attach())
          });
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
        let tracks = this.state.tracks
        this.setState({tracks: tracks.concat([publication.track])})
      }
    })
    participant.on('trackSubscribed', track => {
      let tracks = this.state.tracks
      this.setState({tracks: tracks.concat([track])})
    })
  }
  startVideoLive() {
    Video.connect(this.state.token, {
      name: this.state.roomId, audio: true, video: { }, type: this.state.roomType
    })
    .then(room => {
      room.participants.forEach(participant => {
        this.getRemoteTracks(participant)
      })
      room.on('participantConnected', participant => {
        this.getRemoteTracks(participant)
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
  componentDidUpdate() {
    this.state.tracks.filter(track => track.kind == "video").map((track, idx) => {
      const target = document.getElementById(`remote-media-${idx}`)
      const hasVideo = document.querySelector(`#remote-media-${idx} video`)
      if (target && !hasVideo) {
        target.appendChild(track.attach())
        this.handleTrackDisabled(track)
      }
    })
  }
  handleTrackDisabled(track) {
    track.on('disabled', () => {
      console.log(track)
      const new_tracks = this.state.tracks.map((t) => {
        if (t.sid == track.sid) {
          return {...t, disabled: true}
        }
        return t
      })
      this.setState({tracks: new_tracks})
      /* Hide the associated <video> element and show an avatar image. */
      
    });
    track.on('enabled', () => {
      console.log(track)
      const new_tracks = this.state.tracks.map((t) => {
        if (t.sid == track.sid) {
          return {...t, disabled: false}
        }
        return t
      })
      this.setState({tracks: new_tracks})
      /* Hide the associated <video> element and show an avatar image. */
      
    });

  }
  render() {
    console.log(this.state.tracks, "tracks")
    return (
      <div>
        <Navbar blue_bg={true} user={this.state.user} />
        <div className={"flash-message text-3 " + (this.state.showFlash ? ` ${this.state.flashType}` : " hidden")} >{this.state.flashMessage}</div>
        <div className="video">
          <div className="video-wrapper">
            <div id="local-media" className="local-media" style={{}}></div>
            { this.state.tracks.filter(track => track.kind == "video").map((track, idx) => { 
              return <div className={"participant-block" + (track.disabled ? " hidden" : "")}>
                <div id={`remote-media-${idx}`} className="remote-media" style={{}}></div>                
              </div>
            }) }
          </div>
          <div className="flex flex-center mt-2">
            <div onClick={() => {this.toggleAudio()}} className="cl-button ml-2">
              { this.state.sendAudio ? "Désactiver Audio" : "Activer Audio"}
            </div>
            <div onClick={() => {this.toggleVideo()}} className="cl-button ml-2">
              { this.state.sendVideo ? "Désactiver Vidéo" : "Activer Vidéo"}
            </div>
            <div onClick={() => {this.startVideoLive()}} className={"cl-button ml-2"  + (this.state.hasJoined ? " hidden" : "")}>
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