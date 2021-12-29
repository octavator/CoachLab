defmodule Clab.MixProject do
  use Mix.Project

  def project do
    [
      app: :clab,
      version: "0.1.0",
      elixir: "~> 1.12",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger],
      mod: {Clab.Application, []}
    ]
  end

  defp deps do
    [
      {:plug_cowboy, "~> 2.0"},
      {:poison, "~> 5.0"}
      # {:dep_from_hexpm, "~> 0.3.0"},
    ]
  end
end

defmodule Mix.Tasks.Webcopy do
  use Mix.Task
  def run(_) do
    files = File.ls!("web/")
    Enum.each(files, fn file ->
      res = IO.inspect File.copy("web/" <> file, "priv/static/" <> file)
      if res == {:error, :eisdir} do
        dir_files = File.ls!("web/#{file}")
        Enum.each(dir_files, fn dir_file ->
          File.copy("web/#{file}/" <> dir_file, "priv/static/#{file}/" <> dir_file)
          IO.puts "Copied #{dir_file} to priv/static/#{file}"
        end)
      end
      IO.puts "Copied #{file} to priv/static"
    end)
  end
end
