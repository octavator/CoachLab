defmodule Utils do
    require Logger

    def get_html_template(tpl) do
        header = EEx.eval_file("#{:code.priv_dir(:clab)}/static/header.html")
        data = EEx.eval_file("#{:code.priv_dir(:clab)}/static/#{tpl}.html")
        footer = EEx.eval_file("#{:code.priv_dir(:clab)}/static/footer.html")
        header <> data <> footer
    end

    def test_file_type(filepath, filename) do
        ext = String.split(filename, ".") |> List.last()
        {res , 0} = System.cmd("file", [filepath, "--mime-type", "-i"])
        mimetype = res |> String.split(" ") |> Enum.at(1) |> String.trim(";")
        case mimetype do
            "image/" <> mime_type_ext ->
                res = mime_type_ext == ext || (ext == "jpg" && mime_type_ext == "jpeg")
                if !res, do:  Logger.error("[SECURITY ERROR]: extension #{ext} doesn't match with real mime_type_ext #{mimetype} (#{mime_type_ext}")
                res
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
