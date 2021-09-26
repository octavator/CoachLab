defmodule Schedule do
    @table :schedule_table
    def init() do
        :ets.new(@table, [:named_table, :public])
        :ok
    end

    def get_reserved_slots(coach_id) do
        []
    end

    """
        data = %{
            price: 100,
            currency: euro,
            
        }
    """
    def reserve_new_slot(coach_id, data) do
        
    end

    def check_availability() do
        true
    end
end