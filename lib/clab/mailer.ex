defmodule Clab.Mailer do
  @sender_name "CoachLab"
  @sender_mail "theodecagny@hotmail.fr"

  defp smtp_config(key), do: Application.get_env(:clab, :mailer)[key]

  def send_mail(recipients, subject, content) do
    mail =
      MimeMail.Flat.to_mail(
        from: %MimeMail.Address{name: @sender_name, address: @sender_mail},
        cc: smtp_config(:maintainer_emails),
        html: content,
        subject: subject
      )
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
  def send_mail_with_attachments(recipients, subject, content, attachments) do
    mail =
      [
        from: %MimeMail.Address{name: @sender_name, address: @sender_mail},
        cc: smtp_config(:maintainer_emails),
        html: content,
        subject: subject
      ]
      |> Kernel.++(Enum.flat_map(attachments, & [attach: &1]))
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

  # Clab.Mailer.send_invitation_mail("theophile.decagny@gmail.com", %{firstname: "coucou", lastname: " toi", id: "123"})
  def send_invitation_mail(invited_mail, coach) do
    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-invitation.html.eex", coach: coach)
    Task.start(fn ->
      Clab.Mailer.send_mail([invited_mail], "Votre coach vous a invité à le rejoindre sur CoachLab !", content)
    end)
  end

  def send_signup_alert(user) do
    coach =
      user[:coaches]
      |> List.wrap()
      |> List.first()
      |> User.get_user_by_id()
    file_dir = "data/images/#{user.id}"
    attachments =
      file_dir
      |> File.ls!()
      |> Enum.map(fn filename -> {filename, File.read!("#{file_dir}/#{filename}")} end)

    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-alert.html.eex", user: user, coach: coach)
    Task.start(fn ->
      Clab.Mailer.send_mail_with_attachments(
        smtp_config(:signup_emails),
        "[#{Utils.get_role_label(user.role)}] Nouvelle inscription sur CoachLab !",
        content,
        attachments
      )
    end)
  end

  def send_confirmation_mail(user) do
    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-confirmation.html.eex", user: user)
    Task.start(fn ->
      Clab.Mailer.send_mail(
        [user.email],
        "Confirmation de votre inscription sur CoachLab",
        content
      )
    end)
  end

  def send_payment_link(user, coach, resa) do
    price_id = Stripe.create_product_price(coach, resa["price"] || coach[:session_price])
    payment_link = Stripe.create_payment_link(price_id, user.id, resa["id"])
    resa_date =
      resa["id"]
      |> String.split(" ")
      |> List.first()

    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/resa-payment-link.html.eex",
     user: user, coach: coach, resa: resa, payment_link: payment_link)
    Task.start(fn ->
      Clab.Mailer.send_mail(
        [user.email],
        "Paiement de votre session avec #{coach.firstname} #{coach.lastname} le #{resa_date}",
        content
      )
    end)
  end

  def send_invoice(user_id, resa) do
    coach = User.get_user_by_id(resa["coach_id"])
    user = User.get_user_by_id(user_id)
    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/invoice.html.eex",
     user: user, coach: coach, resa: resa, base_url: Application.get_env(:clab, :url))
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
Clab.Mailer.send_mail_with_attachments(["theophile.decagny@gmail.com"],
 "test attachment", "this is a test", [{"cafaitplaisir.txt", "ahah"}])
"""
