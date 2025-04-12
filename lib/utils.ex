defmodule Utils do
  @env Application.compile_env(:clab, :env, :prod)
  require Logger

  @allowed_exts ["jpg", "jpeg", "png", "svg", "gif", "pdf"]

  def test_file_type(filepath, filename) do
    ext = Utils.get_file_extension(filename)
    mimetype = Utils.get_file_mimetype(filepath)

    is_valid_type =
      case mimetype do
        nil ->
          Enum.member?(@allowed_exts, ext)

        "image/" <> mime_type_ext ->
          Enum.member?(@allowed_exts, ext) &&
            (mime_type_ext == ext || (ext == "jpg" && mime_type_ext == "jpeg"))

        "application/" <> mime_type_ext ->
          Enum.member?(@allowed_exts, ext) &&
            (mime_type_ext == ext || (ext == "jpg" && mime_type_ext == "jpeg"))

        _ ->
          false
      end

    if !is_valid_type,
      do:
        Logger.error(
          "[SECURITY ERROR]: extension #{ext} is invalid or doesn't match with real mime_type_ext #{mimetype}"
        )

    is_valid_type
  end

  def move_user_files(user, file) do
    ext = Utils.get_file_extension(user[file])
    old_filepath = "data/tmp_files/#{user[file]}"
    new_filepath = "data/images/#{user.id}/#{file}.#{ext}"

    cond do
      !File.exists?(old_filepath) ->
        Logger.error("User image (id: #{user.id}) was not found at: #{old_filepath}")
        false

      true ->
        :ok = File.mkdir_p!("data/images/#{user.id}/")
        File.rename(old_filepath, new_filepath)
        true
    end
  end

  def get_role_label(role) do
    case role do
      "coach" ->
        "Coach"

      _ ->
        "Coaché"
    end
  end

  def contains_string(s1, s2) do
    formatted_s2 =
      s2
      |> String.downcase()
      |> String.trim()

    s1
    |> String.downcase()
    |> String.trim()
    |> String.contains?(formatted_s2)
  end

  def equals_string(s1, s2) do
    s1
    |> String.downcase()
    |> String.trim()
    |> Kernel.==(String.trim(String.downcase(s2)))
  end

  def get_file_mimetype(filepath) do
    try do
      case System.cmd("file", ["--mime-type", "-i", filepath]) do
        {res, 0} ->
          res
          |> String.split(" ")
          |> Enum.at(1)
          |> String.trim(";")

        _ ->
          # Fallback: use MIME.type/1 or another method as a fallback
          ext = Path.extname(filepath) |> String.trim_leading(".")
          MIME.type(ext)
      end
    rescue
      ErlangError -> ## When testing locally on Windows, file cmd does not exists
        if env() == :dev do
          nil
        else
          throw ErlangError
        end
    end
  end

  def get_file_extension(path) do
    path
    |> String.split(".")
    |> List.last()
    |> String.downcase()
  end

  def get_html_template(tpl) do
    header = EEx.eval_file("#{:code.priv_dir(:clab)}/static/templates/header.html")
    data = EEx.eval_file("#{:code.priv_dir(:clab)}/static/templates/#{tpl}.html")
    footer = EEx.eval_file("#{:code.priv_dir(:clab)}/static/templates/footer.html")
    header <> data <> footer
  end

  def safe_decode(json) do
    try do
      Poison.decode!(json, keys: :atoms!)
    rescue
      ArgumentError ->
        # Fallback vers des clés string
        Poison.decode!(json)
    end
  end

  def env(), do: @env
end
