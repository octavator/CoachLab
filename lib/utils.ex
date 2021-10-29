defmodule Utils do
    def get_html_template(tpl) do
        header = EEx.eval_file("./priv/static/header.html")
        data = EEx.eval_file("./priv/static/#{tpl}.html")
        footer = EEx.eval_file("./priv/static/footer.html")
        header <> data <> footer
    end    
end
