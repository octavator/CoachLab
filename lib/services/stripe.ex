# Test CC : https://stripe.com/docs/testing
defmodule Stripe do
  @conf Application.compile_env(:clab, :stripe, %{})
  @default_price "50"

  def get_token() do
    if @conf[:test_mode] do
      @conf[:test_secret]
    else
      @conf[:live_secret]
    end
  end

  def get_headers() do
    token = get_token()
    [{"Authorization", "Bearer #{token}"}, {"Content-Type", "application/x-www-form-urlencoded"}]
  end

  def create_payment_link(price_id, user_id, resa_id) do
    resa_id = URI.encode_www_form(resa_id)
    user_id = URI.encode_www_form(user_id)
    redirect_url =
      Application.fetch_env!(:clab, :url)
      |> Kernel.<>("/payment_success?id=#{resa_id}&user_id=#{user_id}")
      |> URI.encode_www_form

    {:ok, res} =
      StripeApi.post("payment_links",
        "line_items[0][price]=#{price_id}&line_items[0][quantity]=1&after_completion[type]"
         <> "=redirect&after_completion[redirect][url]=#{redirect_url}",
        get_headers()
      )
    res.body
    |> Poison.decode!()
    |> Access.get("url")
  end

  def create_product_price(coach, resa, price) do
    {:ok, res} =
      StripeApi.post("prices",
        {:form, [{"currency","eur"}, {"product","session_#{coach.id}_#{resa.id}"},
         {"unit_amount", String.to_integer(price || @default_price) * 100}]},
        get_headers()
      )

    price_id =
      res.body
      |> Poison.decode!()
      |> Access.get("id")
    price_id
  end

  def process_url(url) do
    @conf[:url] <> url
  end
end

  # %{"line_items" => [%{"quantity" => 1, "price" => resa[:price_id]}]}, {"after_completion", %{"type" => "redirect", "redirect" => %{"url" => "https://www.coachlab.fr/oui"}}}]},
