export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  gris: {
    Tables: {
      group_members: {
        Row: {
          group_id: number
          id: number
          joined_at: string
          user_id: number
        }
        Insert: {
          group_id: number
          id?: number
          joined_at?: string
          user_id: number
        }
        Update: {
          group_id?: number
          id?: number
          joined_at?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          created_by: number
          id: number
          invite_token: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by: number
          id?: number
          invite_token: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: number
          id?: number
          invite_token?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      listening_history: {
        Row: {
          created_at: string
          id: number
          listened_at: string
          track_id: number
          "user-id": number
        }
        Insert: {
          created_at?: string
          id?: number
          listened_at: string
          track_id: number
          "user-id": number
        }
        Update: {
          created_at?: string
          id?: number
          listened_at?: string
          track_id?: number
          "user-id"?: number
        }
        Relationships: [
          {
            foreignKeyName: "listening_history_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listening_history_user-id_fkey"
            columns: ["user-id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_members: {
        Row: {
          id: number
          joined_at: string
          playlist_id: number
          user_id: number
        }
        Insert: {
          id?: number
          joined_at?: string
          playlist_id: number
          user_id: number
        }
        Update: {
          id?: number
          joined_at?: string
          playlist_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "playlist_members_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      playlists: {
        Row: {
          created_at: string
          created_by: number
          id: number
          invite_token: string
          name: string
          spotify_id: string
        }
        Insert: {
          created_at?: string
          created_by: number
          id?: number
          invite_token: string
          name: string
          spotify_id?: string
        }
        Update: {
          created_at?: string
          created_by?: number
          id?: number
          invite_token?: string
          name?: string
          spotify_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlists_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string
          group_id: number
          id: number
          message: string | null
          track_id: number
          user_id: number
        }
        Insert: {
          created_at?: string
          group_id: number
          id?: number
          message?: string | null
          track_id: number
          user_id: number
        }
        Update: {
          created_at?: string
          group_id?: number
          id?: number
          message?: string | null
          track_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "posts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          album: string
          artist: string
          created_at: string
          id: number
          img_url: string
          name: string
          spotify_id: string
          uri: string
        }
        Insert: {
          album: string
          artist: string
          created_at?: string
          id?: number
          img_url: string
          name: string
          spotify_id: string
          uri: string
        }
        Update: {
          album?: string
          artist?: string
          created_at?: string
          id?: number
          img_url?: string
          name?: string
          spotify_id?: string
          uri?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: number
          img_url: string | null
          refresh_token: string
          spotify_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          img_url?: string | null
          refresh_token: string
          spotify_id?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          img_url?: string | null
          refresh_token?: string
          spotify_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_group_posts: {
        Args: { p_group_id: number; p_user_email: string }
        Returns: {
          post_id: number
          created_at: string
          user_id: number
          track_id: number
          message: string
        }[]
      }
      get_groups: {
        Args: { spotify_id: string }
        Returns: {
          created_at: string
          created_by: number
          id: number
          invite_token: string
          name: string
        }[]
      }
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
  gris: {
    Enums: {},
  },
} as const
