defmodule Schedule do
    @table :schedule_table
    def init() do
        :ets.new(@table, [:named_table, :public])
        :ok
    end

    def get_reserved_slots(coach_id) do
        []
    end

    def reserve_new_slot(coach_id, reservation) do
        true
    end

    def confirm_slot(coach_id, data) do
        true
    end

    def change_availability() do
        true
    end

    def check_availability() do
        true
    end
end