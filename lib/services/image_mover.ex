defmodule ImageMover do
  require Logger
  use GenServer
  @mover_path 'data/images/'
  @mover_interval 24 #hours

  def start_link(args \\ []) do
    GenServer.start_link(__MODULE__, args, name: __MODULE__)
  end

  def init(_args) do
    # Initial pass 10sec after app start, next will be in 24h
    Process.send_after(__MODULE__, :move_avatars, 1000 * 10)
    {:ok, %{}}
  end

  def handle_info(:move_avatars, state) do
    Logger.info("[ImageMover] Avatar Mover now in progress")
    user_dirs = File.ls!(@mover_path)
    user_dirs |> Enum.each(fn dir ->
      ImageMover.copy_user_avatar(dir)
    end)
    Process.send_after(__MODULE__, :move_avatars, 1000 * 60 * 60 * @mover_interval)
    {:noreply, state}
  end

  def copy_user_avatar(user_id) do
    old_filepath = "#{@mover_path}/#{user_id}/"
    avatar_file = File.ls!(old_filepath) |> Enum.find(& String.contains?(&1, "avatar"))
    if File.exists?(old_filepath <> avatar_file) do
      file_ext = Utils.get_file_extension(avatar_file)
      new_filepath = "#{:code.priv_dir(:clab)}/static/images/#{user_id}/"  
      new_filename = "avatar.#{file_ext}"  
      Logger.info("[ImageMover] Copying #{old_filepath <> avatar_file} to #{new_filepath <> new_filename}")
      :ok = File.mkdir_p!(new_filepath)
      File.copy(old_filepath <> avatar_file, new_filepath <> new_filename)
    end
  end
end
