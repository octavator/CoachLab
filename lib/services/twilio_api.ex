defmodule TwilioApi do
  use HTTPoison.Base

  @conf Application.compile_env(:clab, :twilio, %{})
  @endpoint @conf[:url]

  def process_url(url) do
    @endpoint <> url
  end
end
