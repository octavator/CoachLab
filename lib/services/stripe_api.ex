defmodule StripeApi do
  use HTTPoison.Base

  @conf Application.get_env(:clab, :stripe)
  @endpoint @conf[:url]

  def process_url(url) do
    @endpoint <> url
  end
end