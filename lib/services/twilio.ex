defmodule Twilio do
  @conf Application.get_env(:clab, :twilio)

  def create_room(res) do
    room_type = res["isMulti"] && "group"|| "go"
    should_record = false
    audio_only = false
    empty_room_ttl = 5 # minutes
    pristine_room_ttl = 60 # minutes
    token = Base.encode64("#{@conf[:account_sid]}:#{@conf[:account_secret]}")
    {:ok, res} = TwilioApi.post("Rooms", 
    {:form, [
      {"UniqueName", res["id"]}, {"RecordParticipantsOnConnect","#{should_record}"},
      {"AudioOnly", "#{audio_only}"}, {"MediaRegion", "de1"}, #deutschland 1,
      {"MaxParticipantDuration", "6400"}, {"Type", "#{room_type}"},
      {"EmptyRoomTimeout", "#{empty_room_ttl}"}, {"UnusedRoomTimeout", "#{pristine_room_ttl}"}
    ]},
    #RecordingRules ? rules for recording or not tracks
    [{"Authorization", "Basic #{token}"}, {"Content-Type", "application/x-www-form-urlencoded"}])
    IO.inspect(res, label: "create room call")
    Poison.decode!(res.body)
  end
  
  def process_url(url) do
    @conf[:url] <> url
  end
end

