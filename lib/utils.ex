defmodule Utils do
    def get_html_template(tpl) do
        header = EEx.eval_file("./web/header.html")
        data = EEx.eval_file("./web/#{tpl}.html")
        footer = EEx.eval_file("./web/footer.html")
        header <> data <> footer
    end    
end
