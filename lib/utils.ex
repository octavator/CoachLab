defmodule Utils do
    def get_html_template(tpl) do
        header = EEx.eval_file("#{:code.priv_dir(:clab)}/static/header.html")
        data = EEx.eval_file("#{:code.priv_dir(:clab)}/static/#{tpl}.html")
        footer = EEx.eval_file("#{:code.priv_dir(:clab)}/static/footer.html")
        header <> data <> footer
    end
end
