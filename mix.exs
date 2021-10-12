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

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger],
      mod: {Clab.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:plug_cowboy, "~> 2.0"}
      # {:dep_from_hexpm, "~> 0.3.0"},
      # {:dep_from_git, git: "https://github.com/elixir-lang/my_dep.git", tag: "0.1.0"}
    ]
  end
end

defmodule Mix.Tasks.Webpack.Compile do
  use Mix.Task
  def run(_) do
    files = IO.inspect File.ls!("web/")
    Enum.each(files, fn file ->
      IO.inspect File.copy("web/" <> file, "priv/static/" <> file)
      IO.puts "Copied #{file} to priv/static"    
    end) 
  end
end