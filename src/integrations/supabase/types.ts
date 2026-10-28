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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      business_settings: {
        Row: {
          address: string | null
          business_name: string
          email: string | null
          facebook: string | null
          id: number
          instagram: string | null
          intro: string | null
          logo_url: string | null
          phone: string | null
          privacy_text: string | null
          returns_text: string | null
          terms_text: string | null
          updated_at: string
          whatsapp: string | null
          youtube: string | null
        }
        Insert: {
          address?: string | null
          business_name?: string
          email?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          intro?: string | null
          logo_url?: string | null
          phone?: string | null
          privacy_text?: string | null
          returns_text?: string | null
          terms_text?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Update: {
          address?: string | null
          business_name?: string
          email?: string | null
          facebook?: string | null
          id?: number
          instagram?: string | null
          intro?: string | null
          logo_url?: string | null
          phone?: string | null
          privacy_text?: string | null
          returns_text?: string | null
          terms_text?: string | null
          updated_at?: string
          whatsapp?: string | null
          youtube?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          address: string
          admin_notes: string | null
          created_at: string
          customer_name: string
          email: string | null
          estimated_total: number | null
          id: string
          idempotency_key: string
          ip_hash: string | null
          message: string | null
          phone: string
          reference: string
          status: Database["public"]["Enums"]["inquiry_status"]
          updated_at: string
        }
        Insert: {
          address: string
          admin_notes?: string | null
          created_at?: string
          customer_name: string
          email?: string | null
          estimated_total?: number | null
          id?: string
          idempotency_key: string
          ip_hash?: string | null
          message?: string | null
          phone: string
          reference: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Update: {
          address?: string
          admin_notes?: string | null
          created_at?: string
          customer_name?: string
          email?: string | null
          estimated_total?: number | null
          id?: string
          idempotency_key?: string
          ip_hash?: string | null
          message?: string | null
          phone?: string
          reference?: string
          status?: Database["public"]["Enums"]["inquiry_status"]
          updated_at?: string
        }
        Relationships: []
      }
      inquiry_items: {
        Row: {
          id: string
          inquiry_id: string
          product_id: string | null
          product_name: string
          product_slug: string | null
          quantity: number
          unit_price: number | null
        }
        Insert: {
          id?: string
          inquiry_id: string
          product_id?: string | null
          product_name: string
          product_slug?: string | null
          quantity: number
          unit_price?: number | null
        }
        Update: {
          id?: string
          inquiry_id?: string
          product_id?: string | null
          product_name?: string
          product_slug?: string | null
          quantity?: number
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_items_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inquiry_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inquiry_status_history: {
        Row: {
          changed_by: string | null
          created_at: string
          from_status: Database["public"]["Enums"]["inquiry_status"] | null
          id: string
          inquiry_id: string
          to_status: Database["public"]["Enums"]["inquiry_status"]
        }
        Insert: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["inquiry_status"] | null
          id?: string
          inquiry_id: string
          to_status: Database["public"]["Enums"]["inquiry_status"]
        }
        Update: {
          changed_by?: string | null
          created_at?: string
          from_status?: Database["public"]["Enums"]["inquiry_status"] | null
          id?: string
          inquiry_id?: string
          to_status?: Database["public"]["Enums"]["inquiry_status"]
        }
        Relationships: [
          {
            foreignKeyName: "inquiry_status_history_inquiry_id_fkey"
            columns: ["inquiry_id"]
            isOneToOne: false
            referencedRelation: "inquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string
          id: string
          product_id: string
          sort_order: number
          storage_path: string | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id: string
          sort_order?: number
          storage_path?: string | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string
          id?: string
          product_id?: string
          sort_order?: number
          storage_path?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          care: string | null
          category_id: string | null
          created_at: string
          description: string | null
          details: string | null
          dimensions: string | null
          featured: boolean
          id: string
          inquiry_eligible: boolean
          low_stock_threshold: number
          materials: string | null
          name: string
          price: number | null
          slug: string
          specs: Json
          status: Database["public"]["Enums"]["product_status"]
          stock: number
          updated_at: string
        }
        Insert: {
          care?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          dimensions?: string | null
          featured?: boolean
          id?: string
          inquiry_eligible?: boolean
          low_stock_threshold?: number
          materials?: string | null
          name: string
          price?: number | null
          slug: string
          specs?: Json
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          updated_at?: string
        }
        Update: {
          care?: string | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          details?: string | null
          dimensions?: string | null
          featured?: boolean
          id?: string
          inquiry_eligible?: boolean
          low_stock_threshold?: number
          materials?: string | null
          name?: string
          price?: number | null
          slug?: string
          specs?: Json
          status?: Database["public"]["Enums"]["product_status"]
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_inquiry: {
        Args: {
          _address: string
          _email: string
          _idempotency_key: string
          _ip_hash: string
          _items: Json
          _message: string
          _name: string
          _phone: string
        }
        Returns: {
          duplicate: boolean
          reference: string
        }[]
      }
    }
    Enums: {
      app_role: "admin"
      inquiry_status:
        | "new"
        | "contacted"
        | "confirmed"
        | "packed"
        | "dispatched"
        | "delivered"
        | "cancelled"
      product_status: "draft" | "published" | "archived"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin"],
      inquiry_status: [
        "new",
        "contacted",
        "confirmed",
        "packed",
        "dispatched",
        "delivered",
        "cancelled",
      ],
      product_status: ["draft", "published", "archived"],
    },
  },
} as const
