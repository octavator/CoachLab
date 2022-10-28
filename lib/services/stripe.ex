# Test CC : https://stripe.com/docs/testing
defmodule Stripe do
  @conf Application.get_env(:clab, :stripe)
  @token if @conf[:test_mode], do: @conf[:test_secret], else: @conf[:live_secret]

  def create_payment_link(price_id, user_id, resa_id) do
    redirect_url = "#{Application.get_env(:clab, :url)}/payment_success?id=#{resa_id |> URI.encode_www_form}&user_id=#{user_id |> URI.encode_www_form}" |> URI.encode_www_form
    {:ok, res} = StripeApi.post("payment_links", 
    "line_items[0][price]=#{price_id}&line_items[0][quantity]=1&after_completion[type]" 
     <> "=redirect&after_completion[redirect][url]=#{redirect_url}",
    [{"Authorization", "Bearer #{@token}"}, {"Content-Type", "application/x-www-form-urlencoded"}])
    Poison.decode!(res.body)
  end

  def create_product_price(coach) do
    {:ok, res} = StripeApi.post("prices", 
    {:form, [{"currency","eur"}, {"product","session_#{coach.id}"},
    {"unit_amount", String.to_integer(coach[:session_price] || "50") * 100}]},
    [{"Authorization", "Bearer #{@token}"}, {"Content-Type", "application/x-www-form-urlencoded"}])
    body = Poison.decode!(res.body)
    User.edit_user(coach.id, %{price_id: body["id"]})
    IO.inspect(body, label: "Created product price")
    body
  end
  
  def create_product(coach) do
    StripeApi.post("products", 
      {:form, [{"id","session_#{coach.id}"},
      {"name","Coaching avec #{coach.firstname} #{coach.lastname}"}]},
      [{"Authorization", "Bearer #{@token}"}, {"Content-Type", "application/x-www-form-urlencoded"}])
  end

  def process_url(url) do
    @conf[:url] <> url
  end

  def create_product_for_coaches() do
    :ets.tab2list(:users)
    |> Enum.each(fn {_id, value} -> if value.role == "coach", do: create_product(value) end)
  end

  def create_product_prices_for_coaches() do
    :ets.tab2list(:users)
    |> Enum.each(fn {_id, value} -> if value.role == "coach", do: create_product_price(value) end)
  end
end

  # %{"line_items" => [%{"quantity" => 1, "price" => coach[:price_id]}]}, {"after_completion", %{"type" => "redirect", "redirect" => %{"url" => "https://www.coachlab.fr/oui"}}}]},
