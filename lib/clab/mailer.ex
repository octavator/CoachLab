defmodule Clab.Mailer do
  @sender_name "CoachLab"
  #@TODO: get real smtp & sender, not my own infos
  @sender_mail "theodecagny@hotmail.fr"
  @base_url Application.compile_env!(:clab, :url)

  defp smtp_config(key), do: Application.fetch_env!(:clab, :mailer)[key]

  def send_mail(recipients, subject, content, attachments \\ []) do
    mail =
      [
        from: %MimeMail.Address{name: @sender_name, address: @sender_mail},
        cc: smtp_config(:maintainer_emails),
        html: content,
        subject: subject
      ]
      |> Kernel.++(Enum.flat_map(attachments, fn attachment -> [attach: attachment] end))
      |> MimeMail.Flat.to_mail()
      |> MimeMail.to_string

    :gen_smtp_client.send_blocking({@sender_mail, recipients, mail},
     [{:relay, smtp_config(:region)},
      {:username, smtp_config(:access_key)},
      {:password, smtp_config(:secret)},
      {:port, smtp_config(:port)},
      {:tls, :always}
     ]
    )
  end

  # Clab.Mailer.send_invitation_mails(["theophile.decagny@gmail.com"], %{firstname: "coucou", lastname: " toi", id: "123"})
  def send_invitation_mails(invited_mails, coach) do
    Task.start(fn ->
      content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-invitation.html.eex", coach: coach)
      Clab.Mailer.send_mail(invited_mails, "Votre coach vous a invité à le rejoindre sur CoachLab !", content)
    end)
  end

  def get_user_coach(user) do
    user[:coaches]
    |> List.wrap()
    |> List.first()
    |> User.get_user_by_id()
  end

  def get_user_files_attachments(user_files_dir) do
    user_files_dir
    |> File.ls!()
    |> Enum.map(fn filename ->
      {filename, File.read!("#{user_files_dir}/#{filename}")}
    end)
  end

  def send_signup_alert(user) do
    Task.start(fn ->
      coach = get_user_coach(user)
      user_files_dir = "data/images/#{user.id}"
      attachments = get_user_files_attachments(user_files_dir)

      content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-alert.html.eex", user: user, coach: coach)

      Clab.Mailer.send_mail(
        smtp_config(:signup_emails),
        "[#{Utils.get_role_label(user.role)}] Nouvelle inscription sur CoachLab !",
        content,
        attachments
      )
    end)
  end

  def send_confirmation_mail(user) do
    Task.start(fn ->
      content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-confirmation.html.eex", user: user)

      Clab.Mailer.send_mail(
        [user.email],
        "Confirmation de votre inscription sur CoachLab",
        content
      )
    end)
  end

  def send_payment_link(user, coach, resa) do
    price = Reservation.get_price(resa, coach)
    price_id = Stripe.create_product_price(coach, price, resa)
    payment_link = Stripe.create_payment_link(price_id, user.id, resa[:id])

    Task.start(fn ->
      resa_date =
        resa[:id]
        |> String.split(" ")
        |> List.first()

      content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/resa-payment-link.html.eex",
        user: user, coach: coach, resa: resa, payment_link: payment_link)
      Clab.Mailer.send_mail(
        [user.email],
        "Paiement de votre session avec #{coach.firstname} #{coach.lastname} le #{resa_date}",
        content
      )
    end)
  end

  def send_reset_password_mail(mail) do
    Task.start(fn ->
      hash = User.create_reset_hash(mail)

      content =
        EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/forgotten-password.html.eex",
          hash: hash,
          base_url: @base_url
        )

      Clab.Mailer.send_mail([mail], "Ré-initialisez votre mot de passe CoachLab", content)
    end)
  end

  #@TODO: INVOICE HANDLING?? FTP ? presta externe ?
  def send_invoice(user_id, resa) do
    coach = User.get_user_by_id(resa[:coach_id])
    user = User.get_user_by_id(user_id)
    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/invoice.html.eex",
     user: user, coach: coach, resa: resa, base_url: @base_url)
    # Legally we should send PDF, and save PDF for several years...
    Task.start(fn ->
      Clab.Mailer.send_mail(
        [user.email],
        "[CoachLab] Confirmation de votre séance avec #{coach.firstname} #{coach.lastname}",
        content
      )
        # attachments)
    end)
  end
end

"""
Clab.Mailer.send_mail(["theophile.decagny@gmail.com"],
 "test attachment", "this is a test", [{"cafaitplaisir.txt", "ahah"}])
"""
