defmodule ClabTest do
  use ExUnit.Case
  doctest Clab

  test "greets the world" do
    assert Clab.hello() == :world
  end
end
