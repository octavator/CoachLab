defmodule Clab.Mailer do
  def send_mail(recipients, subject, content) do
    mail = MimeMail.Flat.to_mail(from: %MimeMail.Address{name: "Coachlab",address: "coachlab@coachlab.fr"},
     html: content,
     subject: subject)
     |> MimeMail.to_string
    :gen_smtp_client.send_blocking({"coachlab@coachlab.fr", recipients, mail},
     [{:relay, Application.get_env(:clab, :region)},
      {:username, Application.get_env(:clab, :access_key)},
      {:password, Application.get_env(:clab, :secret)},
      {:tls, :always}
     ]
    )
  end
  def send_mail_with_attachmenth(recipients, subject, content, attachment) do
    mail = MimeMail.Flat.to_mail(from: %MimeMail.Address{name: "Coachlab",address: "coachlab@coachlab.fr"},
     html: content,
     subject: subject,
    attach: attachment)
     |> MimeMail.to_string
    :gen_smtp_client.send_blocking({"coachlab@coachlab.fr", recipients, mail},
     [{:relay, Application.get_env(:clab, :region)},
      {:username, Application.get_env(:clab, :access_key)},
      {:password, Application.get_env(:clab, :secret)},
      {:tls, :always}
     ]
    )
  end
end

"""
txt: "On sait c'est qui qui domine",
subject: "Yesss aiii",
attach: {"cafaitplaisir.txt","Et ouais on peut même mettre des pièces jointes c'est la folie"

["theophile.fondacci@coachlab.fr", "paul.fregeai@gmail.com", "theophile.decagny@gmail.com"]
"""
