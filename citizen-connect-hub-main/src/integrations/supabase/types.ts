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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      complaint_media: {
        Row: {
          complaint_id: string
          created_at: string | null
          file_name: string | null
          file_type: string
          file_url: string
          id: string
        }
        Insert: {
          complaint_id: string
          created_at?: string | null
          file_name?: string | null
          file_type: string
          file_url: string
          id?: string
        }
        Update: {
          complaint_id?: string
          created_at?: string | null
          file_name?: string | null
          file_type?: string
          file_url?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaint_media_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          address: string | null
          assigned_to: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          complaint_id: string
          created_at: string | null
          department_id: string | null
          description: string
          expected_resolution_date: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          priority: Database["public"]["Enums"]["complaint_priority"] | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          text_from_voice: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          category: Database["public"]["Enums"]["complaint_category"]
          complaint_id: string
          created_at?: string | null
          department_id?: string | null
          description: string
          expected_resolution_date?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          priority?: Database["public"]["Enums"]["complaint_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          text_from_voice?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["complaint_category"]
          complaint_id?: string
          created_at?: string | null
          department_id?: string | null
          description?: string
          expected_resolution_date?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          priority?: Database["public"]["Enums"]["complaint_priority"] | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          text_from_voice?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          category_handled: Database["public"]["Enums"]["complaint_category"]
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          category_handled: Database["public"]["Enums"]["complaint_category"]
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          category_handled?: Database["public"]["Enums"]["complaint_category"]
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          department_id: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      status_updates: {
        Row: {
          after_photo_url: string | null
          before_photo_url: string | null
          complaint_id: string
          created_at: string | null
          id: string
          remarks: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          updated_by: string | null
        }
        Insert: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          complaint_id: string
          created_at?: string | null
          id?: string
          remarks?: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          updated_by?: string | null
        }
        Update: {
          after_photo_url?: string | null
          before_photo_url?: string | null
          complaint_id?: string
          created_at?: string | null
          id?: string
          remarks?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_updates_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
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
      complaint_category:
        | "roads"
        | "water_supply"
        | "electricity"
        | "sanitation"
        | "street_lights"
        | "others"
      complaint_priority: "low" | "medium" | "high" | "urgent"
      complaint_status: "pending" | "assigned" | "in_progress" | "resolved"
      user_role: "citizen" | "admin" | "department_head" | "field_officer"
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
      complaint_category: [
        "roads",
        "water_supply",
        "electricity",
        "sanitation",
        "street_lights",
        "others",
      ],
      complaint_priority: ["low", "medium", "high", "urgent"],
      complaint_status: ["pending", "assigned", "in_progress", "resolved"],
      user_role: ["citizen", "admin", "department_head", "field_officer"],
    },
  },
} as const
