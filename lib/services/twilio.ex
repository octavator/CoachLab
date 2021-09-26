defmodule Twilio do
  require Logger

  @conf Application.compile_env(:clab, :twilio, %{})

  def create_room(resa) do
    #@TODO: should we do p2p ? small-group ?
    room_type = resa[:isMulti] && "group" || "go"
    should_record = false
    audio_only = false
    empty_room_ttl = 5 # minutes
    pristine_room_ttl = 60 # minutes
    token = Base.encode64("#{@conf[:account_sid]}:#{@conf[:account_secret]}")

    {:ok, res} =
      TwilioApi.post("Rooms",
        {:form, [
         {"UniqueName", resa[:id]}, {"RecordParticipantsOnConnect", "#{should_record}"},
         {"AudioOnly", "#{audio_only}"}, {"MediaRegion", "de1"}, #deutschland 1
         {"MaxParticipantDuration", "6400"}, {"Type", "#{room_type}"},
         {"EmptyRoomTimeout", "#{empty_room_ttl}"}, {"UnusedRoomTimeout", "#{pristine_room_ttl}"}
        ]},
        #RecordingRules ? rules for recording or not tracks
        [{"Authorization", "Basic #{token}"}, {"Content-Type", "application/x-www-form-urlencoded"}]
      )
    Logger.debug("[TWILIO] Create room call: #{inspect(res)}")
    Poison.decode!(res.body)
  end

  def process_url(url) do
    @conf[:url] <> url
  end
end
