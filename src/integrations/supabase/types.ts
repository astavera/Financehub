export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      bank_balance_tracker: {
        Row: {
          created_at: string
          ending_balance: number
          expenses: number
          household_id: string
          id: string
          income: number
          notes: string | null
          starting_balance: number
          updated_at: string
          weekly_budget_id: string
        }
        Insert: {
          created_at?: string
          ending_balance?: number
          expenses?: number
          household_id: string
          id?: string
          income?: number
          notes?: string | null
          starting_balance?: number
          updated_at?: string
          weekly_budget_id: string
        }
        Update: {
          created_at?: string
          ending_balance?: number
          expenses?: number
          household_id?: string
          id?: string
          income?: number
          notes?: string | null
          starting_balance?: number
          updated_at?: string
          weekly_budget_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_balance_tracker_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bank_balance_tracker_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: true
            referencedRelation: "weekly_budget_summary"
            referencedColumns: ["weekly_budget_id"]
          },
          {
            foreignKeyName: "bank_balance_tracker_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: true
            referencedRelation: "weekly_budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      car_payoff_tracker: {
        Row: {
          collected_amount: number
          created_at: string
          household_id: string
          id: string
          notes: string | null
          target_amount: number
          updated_at: string
          weekly_budget_id: string
        }
        Insert: {
          collected_amount?: number
          created_at?: string
          household_id: string
          id?: string
          notes?: string | null
          target_amount?: number
          updated_at?: string
          weekly_budget_id: string
        }
        Update: {
          collected_amount?: number
          created_at?: string
          household_id?: string
          id?: string
          notes?: string | null
          target_amount?: number
          updated_at?: string
          weekly_budget_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "car_payoff_tracker_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "car_payoff_tracker_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: false
            referencedRelation: "weekly_budget_summary"
            referencedColumns: ["weekly_budget_id"]
          },
          {
            foreignKeyName: "car_payoff_tracker_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: false
            referencedRelation: "weekly_budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      card_calendar_events: {
        Row: {
          card_id: string
          created_at: string
          event_date: string
          event_type: Database["public"]["Enums"]["card_event_type"]
          household_id: string
          id: string
          notes: string | null
        }
        Insert: {
          card_id: string
          created_at?: string
          event_date: string
          event_type: Database["public"]["Enums"]["card_event_type"]
          household_id: string
          id?: string
          notes?: string | null
        }
        Update: {
          card_id?: string
          created_at?: string
          event_date?: string
          event_type?: Database["public"]["Enums"]["card_event_type"]
          household_id?: string
          id?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_calendar_events_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      card_payments: {
        Row: {
          amount: number
          card_id: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          household_id: string
          id: string
          notes: string | null
          paid_by: Database["public"]["Enums"]["paid_by_type"]
          payment_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          card_id: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          household_id: string
          id?: string
          notes?: string | null
          paid_by: Database["public"]["Enums"]["paid_by_type"]
          payment_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          card_id?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          household_id?: string
          id?: string
          notes?: string | null
          paid_by?: Database["public"]["Enums"]["paid_by_type"]
          payment_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "card_payments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_payments_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      card_purchases: {
        Row: {
          amount: number
          card_id: string
          category: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          household_id: string
          id: string
          merchant: string
          notes: string | null
          paid_by: Database["public"]["Enums"]["paid_by_type"]
          purchase_date: string
          reflected_in_weekly_expenses: boolean
          reflected_weekly_expense_id: string | null
          updated_at: string
          weekly_budget_id: string | null
        }
        Insert: {
          amount: number
          card_id: string
          category?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          household_id: string
          id?: string
          merchant: string
          notes?: string | null
          paid_by: Database["public"]["Enums"]["paid_by_type"]
          purchase_date: string
          reflected_in_weekly_expenses?: boolean
          reflected_weekly_expense_id?: string | null
          updated_at?: string
          weekly_budget_id?: string | null
        }
        Update: {
          amount?: number
          card_id?: string
          category?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          household_id?: string
          id?: string
          merchant?: string
          notes?: string | null
          paid_by?: Database["public"]["Enums"]["paid_by_type"]
          purchase_date?: string
          reflected_in_weekly_expenses?: boolean
          reflected_weekly_expense_id?: string | null
          updated_at?: string
          weekly_budget_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_purchases_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_purchases_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: false
            referencedRelation: "weekly_budget_summary"
            referencedColumns: ["weekly_budget_id"]
          },
          {
            foreignKeyName: "card_purchases_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: false
            referencedRelation: "weekly_budgets"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          card_image_source: string | null
          card_image_url: string | null
          card_name: string
          closing_day: number | null
          created_at: string
          credit_limit: number
          current_balance: number
          due_day: number | null
          household_id: string
          id: string
          is_active: boolean
          issuer: string
          last4: string
          network: string | null
          notes: string | null
          template_name: string | null
          updated_at: string
        }
        Insert: {
          card_image_source?: string | null
          card_image_url?: string | null
          card_name: string
          closing_day?: number | null
          created_at?: string
          credit_limit: number
          current_balance?: number
          due_day?: number | null
          household_id: string
          id?: string
          is_active?: boolean
          issuer: string
          last4: string
          network?: string | null
          notes?: string | null
          template_name?: string | null
          updated_at?: string
        }
        Update: {
          card_image_source?: string | null
          card_image_url?: string | null
          card_name?: string
          closing_day?: number | null
          created_at?: string
          credit_limit?: number
          current_balance?: number
          due_day?: number | null
          household_id?: string
          id?: string
          is_active?: boolean
          issuer?: string
          last4?: string
          network?: string | null
          notes?: string | null
          template_name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_cards_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      exchange_rate_history: {
        Row: {
          created_at: string
          fetched_at: string
          household_id: string
          id: string
          notes: string | null
          provider_name: string
          rate_cop_per_usd: number
          source: Database["public"]["Enums"]["rate_source_type"]
        }
        Insert: {
          created_at?: string
          fetched_at?: string
          household_id: string
          id?: string
          notes?: string | null
          provider_name?: string
          rate_cop_per_usd: number
          source: Database["public"]["Enums"]["rate_source_type"]
        }
        Update: {
          created_at?: string
          fetched_at?: string
          household_id?: string
          id?: string
          notes?: string | null
          provider_name?: string
          rate_cop_per_usd?: number
          source?: Database["public"]["Enums"]["rate_source_type"]
        }
        Relationships: [
          {
            foreignKeyName: "exchange_rate_history_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      household_members: {
        Row: {
          created_at: string
          display_name: string
          household_id: string
          id: string
          is_active: boolean
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          household_id: string
          id?: string
          is_active?: boolean
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          household_id?: string
          id?: string
          is_active?: boolean
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_members_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      household_settings: {
        Row: {
          active_rate_source: Database["public"]["Enums"]["rate_source_type"]
          created_at: string
          household_id: string
          id: string
          rate_last_updated_at: string | null
          rate_notes: string | null
          remitly_live_rate: number | null
          remitly_manual_rate: number | null
          theme: string
          updated_at: string
        }
        Insert: {
          active_rate_source?: Database["public"]["Enums"]["rate_source_type"]
          created_at?: string
          household_id: string
          id?: string
          rate_last_updated_at?: string | null
          rate_notes?: string | null
          remitly_live_rate?: number | null
          remitly_manual_rate?: number | null
          theme?: string
          updated_at?: string
        }
        Update: {
          active_rate_source?: Database["public"]["Enums"]["rate_source_type"]
          created_at?: string
          household_id?: string
          id?: string
          rate_last_updated_at?: string | null
          rate_notes?: string | null
          remitly_live_rate?: number | null
          remitly_manual_rate?: number | null
          theme?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_settings_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: true
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          id: string
          name: string
          primary_currency: Database["public"]["Enums"]["currency_code"]
          secondary_currency: Database["public"]["Enums"]["currency_code"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          primary_currency?: Database["public"]["Enums"]["currency_code"]
          secondary_currency?: Database["public"]["Enums"]["currency_code"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          primary_currency?: Database["public"]["Enums"]["currency_code"]
          secondary_currency?: Database["public"]["Enums"]["currency_code"]
          updated_at?: string
        }
        Relationships: []
      }
      monthly_allocations: {
        Row: {
          allocation_name: string
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          household_id: string
          id: string
          is_default: boolean
          sort_order: number
          updated_at: string
        }
        Insert: {
          allocation_name: string
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          household_id: string
          id?: string
          is_default?: boolean
          sort_order?: number
          updated_at?: string
        }
        Update: {
          allocation_name?: string
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          household_id?: string
          id?: string
          is_default?: boolean
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "monthly_allocations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          country_tag: string | null
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          current_amount: number
          group_type: Database["public"]["Enums"]["goal_group"]
          household_id: string
          id: string
          is_active: boolean
          notes: string | null
          project_name: string
          sort_order: number
          target_amount: number
          updated_at: string
        }
        Insert: {
          country_tag?: string | null
          created_at?: string
          currency: Database["public"]["Enums"]["currency_code"]
          current_amount?: number
          group_type: Database["public"]["Enums"]["goal_group"]
          household_id: string
          id?: string
          is_active?: boolean
          notes?: string | null
          project_name: string
          sort_order?: number
          target_amount: number
          updated_at?: string
        }
        Update: {
          country_tag?: string | null
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          current_amount?: number
          group_type?: Database["public"]["Enums"]["goal_group"]
          household_id?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          project_name?: string
          sort_order?: number
          target_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_budgets: {
        Row: {
          created_at: string
          extra_income: number
          household_id: string
          id: string
          income: number
          notes: string | null
          updated_at: string
          week_label: string
          week_number: number
        }
        Insert: {
          created_at?: string
          extra_income?: number
          household_id: string
          id?: string
          income?: number
          notes?: string | null
          updated_at?: string
          week_label: string
          week_number: number
        }
        Update: {
          created_at?: string
          extra_income?: number
          household_id?: string
          id?: string
          income?: number
          notes?: string | null
          updated_at?: string
          week_label?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_budgets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      weekly_expenses: {
        Row: {
          amount: number
          category: string | null
          concept: string
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          expense_date: string | null
          household_id: string
          id: string
          notes: string | null
          paid_by: Database["public"]["Enums"]["paid_by_type"]
          source_id: string | null
          source_type: string
          status: Database["public"]["Enums"]["expense_status"]
          updated_at: string
          weekly_budget_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          concept: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          expense_date?: string | null
          household_id: string
          id?: string
          notes?: string | null
          paid_by: Database["public"]["Enums"]["paid_by_type"]
          source_id?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string
          weekly_budget_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          concept?: string
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          expense_date?: string | null
          household_id?: string
          id?: string
          notes?: string | null
          paid_by?: Database["public"]["Enums"]["paid_by_type"]
          source_id?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["expense_status"]
          updated_at?: string
          weekly_budget_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_expenses_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "weekly_expenses_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: false
            referencedRelation: "weekly_budget_summary"
            referencedColumns: ["weekly_budget_id"]
          },
          {
            foreignKeyName: "weekly_expenses_weekly_budget_id_fkey"
            columns: ["weekly_budget_id"]
            isOneToOne: false
            referencedRelation: "weekly_budgets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      projects_with_conversion: {
        Row: {
          country_tag: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          current_amount: number | null
          current_amount_usd_equivalent: number | null
          exchange_rate_used: number | null
          group_type: Database["public"]["Enums"]["goal_group"] | null
          household_id: string | null
          id: string | null
          is_active: boolean | null
          notes: string | null
          project_name: string | null
          sort_order: number | null
          target_amount: number | null
          target_amount_usd_equivalent: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions_view: {
        Row: {
          amount: number | null
          card_id: string | null
          category: string | null
          created_at: string | null
          currency: Database["public"]["Enums"]["currency_code"] | null
          description: string | null
          household_id: string | null
          notes: string | null
          paid_by: string | null
          status: string | null
          transaction_date: string | null
          transaction_id: string | null
          transaction_type: string | null
          updated_at: string | null
          week_number: number | null
        }
        Relationships: []
      }
      weekly_budget_summary: {
        Row: {
          extra_income: number | null
          household_id: string | null
          income: number | null
          remaining_balance_usd: number | null
          total_weekly_expenses_usd: number | null
          week_label: string | null
          week_number: number | null
          weekly_budget_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "weekly_budgets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      refresh_credit_card_balance: {
        Args: { p_card_id: string }
        Returns: undefined
      }
    }
    Enums: {
      card_event_type: "closing" | "due" | "payment_completed"
      currency_code: "USD" | "COP"
      expense_status: "Paid" | "Pending" | "Partial"
      goal_group: "USD" | "COP"
      paid_by_type: "Sebas" | "Sharon"
      rate_source_type: "live" | "manual"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      card_event_type: ["closing", "due", "payment_completed"],
      currency_code: ["USD", "COP"],
      expense_status: ["Paid", "Pending", "Partial"],
      goal_group: ["USD", "COP"],
      paid_by_type: ["Sebas", "Sharon"],
      rate_source_type: ["live", "manual"],
    },
  },
} as const
