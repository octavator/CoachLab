defmodule Clab.Mailer do
  def send_mail(recipients, subject, content) do
    mail = MimeMail.Flat.to_mail(from: %MimeMail.Address{name: "Coachlab",address: "coachlab@coachlab.fr"},
      #  cc: Application.get_env(:clab, :mailer)[:maintainer_emails],
      cc: ["theophile.decagny@gmail.com"],
     html: content,
     subject: subject)
     |> MimeMail.to_string
    :gen_smtp_client.send_blocking({"coachlab@coachlab.fr", recipients, mail},
     [{:relay, Application.get_env(:clab, :region)},
      {:username, Application.get_env(:clab, :access_key)},
      {:password, Application.get_env(:clab, :secret)},
      {:port, 587},
      {:tls, :always}
     ]
    )
  end
  def send_mail_with_attachments(recipients, subject, content, attachments) do
    #  cc: Application.get_env(:clab, :mailer)[:maintainer_emails],
    opts = [
      html: content,
      subject: subject,
      cc: ["theophile.decagny@gmail.com"],
      from: %MimeMail.Address{name: "Coachlab",address: "coachlab@coachlab.fr"}
    ]
    opts = opts ++ Enum.flat_map(attachments, fn attachment ->
      [attach: attachment]
    end)
    mail = MimeMail.Flat.to_mail(opts)
     |> MimeMail.to_string
    :gen_smtp_client.send_blocking({"coachlab@coachlab.fr", recipients, mail},
     [{:relay, Application.get_env(:clab, :region)},
      {:username, Application.get_env(:clab, :access_key)},
      {:password, Application.get_env(:clab, :secret)},
      {:port, 587},
      {:tls, :always}
     ]
    )
  end

  # Clab.Mailer.send_invitation_mail("theophile.decagny@gmail.com", %{firstname: "coucou" , lastname: " toi", id: "mabite"})
  def send_invitation_mail(invited_mail, coach) do
    content = EEx.eval_file("#{:code.priv_dir(:clab)}/static/emails/signup-invitation.html.eex", coach: coach)
    Clab.Mailer.send_mail([invited_mail], "Votre coach vous a invité à le rejoindre sur CoachLab", content)
  end
end

"""
Clab.Mailer.send_mail_with_attachments(["theophile.decagny@gmail.com"],
 "test attachment", "this is a test", [{"cafaitplaisir.txt", "ahah"}])
"""
