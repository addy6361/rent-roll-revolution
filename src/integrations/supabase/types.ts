export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assignments: {
        Row: {
          bed_id: string
          created_at: string | null
          deposit_amount: number | null
          end_date: string | null
          id: string
          monthly_rent: number | null
          occupant_id: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          bed_id: string
          created_at?: string | null
          deposit_amount?: number | null
          end_date?: string | null
          id?: string
          monthly_rent?: number | null
          occupant_id: string
          start_date: string
          updated_at?: string | null
        }
        Update: {
          bed_id?: string
          created_at?: string | null
          deposit_amount?: number | null
          end_date?: string | null
          id?: string
          monthly_rent?: number | null
          occupant_id?: string
          start_date?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assignments_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_occupant_id_fkey"
            columns: ["occupant_id"]
            isOneToOne: false
            referencedRelation: "occupants"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          created_at: string | null
          id: string
          label: string
          occupancy_status: string | null
          room_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          occupancy_status?: string | null
          room_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          occupancy_status?: string | null
          room_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beds_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          additional_comments: string | null
          created_at: string
          id: string
          organization_name: string | null
          overall_rating: number | null
          responses: Json
          role: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          additional_comments?: string | null
          created_at?: string
          id?: string
          organization_name?: string | null
          overall_rating?: number | null
          responses: Json
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          additional_comments?: string | null
          created_at?: string
          id?: string
          organization_name?: string | null
          overall_rating?: number | null
          responses?: Json
          role?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      invoices: {
        Row: {
          created_at: string | null
          id: string
          issued_at: string | null
          payment_id: string
          pdf_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          issued_at?: string | null
          payment_id: string
          pdf_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          issued_at?: string | null
          payment_id?: string
          pdf_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      occupants: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          id_proof_url: string | null
          owner_id: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          id_proof_url?: string | null
          owner_id: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          id_proof_url?: string | null
          owner_id?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          created_at: string
          id: string
          ifsc_code: string | null
          is_active: boolean | null
          owner_id: string | null
          payment_method: string
          qr_code_url: string | null
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          is_active?: boolean | null
          owner_id?: string | null
          payment_method: string
          qr_code_url?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          created_at?: string
          id?: string
          ifsc_code?: string | null
          is_active?: boolean | null
          owner_id?: string | null
          payment_method?: string
          qr_code_url?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_due: number
          amount_paid: number | null
          assignment_id: string
          created_at: string | null
          due_date: string | null
          id: string
          month: string
          paid_at: string | null
          payment_link: string | null
          payment_qr_url: string | null
          payment_type: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          assignment_id: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          month: string
          paid_at?: string | null
          payment_link?: string | null
          payment_qr_url?: string | null
          payment_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          assignment_id?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          month?: string
          paid_at?: string | null
          payment_link?: string | null
          payment_qr_url?: string | null
          payment_type?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          city: string
          created_at: string | null
          id: string
          name: string
          owner_id: string
          pincode: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          id?: string
          name: string
          owner_id: string
          pincode: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          id?: string
          name?: string
          owner_id?: string
          pincode?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string | null
          id: string
          label: string
          property_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label: string
          property_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string
          property_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
