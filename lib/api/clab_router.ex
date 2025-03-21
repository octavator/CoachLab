defmodule Clab.Router do
  def init(opts), do: opts

  def call(conn, opts) do
    routers = Keyword.get(opts, :routers, [
      Clab.PublicRouter,
      Clab.AuthPlug,
      Clab.ProtectedRouter,
      Clab.FallbackRouter
    ])

    Enum.reduce_while(routers, conn, fn router, conn ->
      conn = router.call(conn, [])

      # Check if a response was sent
      if conn.state == :sent || conn.state == :chunked || conn.resp_body != nil || conn.halted do
        {:halt, conn}  # Stop processing
      else
        {:cont, conn}  # Continue to the next router
      end
    end)
  end
end
