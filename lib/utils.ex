defmodule Utils do
    @allowed_exts ["jpg", "jpeg", "png", "svg", "gif", "pdf"]
    require Logger

    def get_html_template(tpl) do
        header = EEx.eval_file("#{:code.priv_dir(:clab)}/static/templates/header.html")
        data = EEx.eval_file("#{:code.priv_dir(:clab)}/static/templates/#{tpl}.html")
        footer = EEx.eval_file("#{:code.priv_dir(:clab)}/static/templates/footer.html")
        header <> data <> footer
    end

    def get_role_label(role) do
      case role do
        "coach" -> "Coach"
        _ -> "Coaché"
      end
    end

    def get_file_extension(path) do
        List.wrap(path |> String.split(".")) |> List.last()
    end

    def test_file_type(filepath, filename) do
        ext = String.split(filename, ".") |> List.last() |> String.downcase
        {res , 0} = System.cmd("file", [filepath, "--mime-type", "-i"])
        mimetype = res |> String.split(" ") |> Enum.at(1) |> String.trim(";")
        case mimetype do
            "image/" <> mime_type_ext ->
                isvalid = Enum.member?(@allowed_exts, ext) && (mime_type_ext == ext || (ext == "jpg" && mime_type_ext == "jpeg"))
                if !isvalid, do:  Logger.error("[SECURITY ERROR]: extension #{ext} is invalid or doesn't match with real mime_type_ext #{mimetype} (#{mime_type_ext})")
                isvalid
            "application/" <> mime_type_ext ->
                isvalid = Enum.member?(@allowed_exts, ext) && (mime_type_ext == ext || (ext == "jpg" && mime_type_ext == "jpeg"))
                if !isvalid, do:  Logger.error("[SECURITY ERROR]: extension #{ext} is invalid or doesn't match with real mime_type_ext #{mimetype} (#{mime_type_ext})")
                isvalid
            _ ->
                Logger.error("[SECURITY ERROR]: extension #{ext} doesn't match with real mime_type_ext #{mimetype}")
                false
        end

    end
    def move_user_files(old_filepath, new_filepath, user) do
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
    def contains_string(s1, s2) do
        String.contains?(String.trim(String.downcase(s1)), String.trim(String.downcase(s2)))
    end

    def equals_string(s1, s2) do
        String.trim(String.downcase(s1)) == String.trim(String.downcase(s2))
    end
end
