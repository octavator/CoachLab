defmodule Clab.MixProject do
  use Mix.Project

  def project do
    [
      app: :clab,
      version: "0.1.0",
      elixir: "~> 1.18",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger, :crypto, :eex, :plug, :cowboy],
      mod: {Clab.Application, []}
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:poison, "~> 5.0"},
      {:mailibex, github: "kbrw/mailibex", branch: "master"},
      {:gen_smtp, "~> 1.1.1"},
      {:joken, "~> 2.4"},
      {:httpoison, "~> 1.8"},
      {:hackney, "~> 1.17"},
      {:timex, "~> 3.7"},
      {:mime, "~> 2.0"}
    ]
  end
end

defmodule Mix.Tasks.Webcopy do
  use Mix.Task
  def run(_) do
    "web/"
    |> File.ls!()
    |> Enum.each(fn file ->
      res = File.copy("web/" <> file, "priv/static/" <> file)
      if res == {:error, :eisdir} do
        "web/#{file}"
        |> File.ls!()
        |> Enum.each(fn dir_file ->
          File.mkdir_p!("priv/static/#{file}")
          File.copy("web/#{file}/" <> dir_file, "priv/static/#{file}/" <> dir_file)
          IO.puts "Copied #{dir_file} to priv/static/#{file}"
        end)
      end
      IO.puts "Copied #{file} to priv/static"
    end)
  end
end
