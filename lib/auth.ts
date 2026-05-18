import { supabase } from "./supabase";
import { User } from "./supabase";

// Password hashing (using a simple approach - in production use bcrypt)
async function hashPassword(password: string): Promise<string> {
  // For production, use bcrypt or similar
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "salt_secret_key");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Auth functions
export async function signUp(
  username: string,
  email: string,
  password: string,
  fullName?: string
): Promise<{ user: User; error: string | null }> {
  try {
    // Check if username or email already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existingUser) {
      return { user: null as any, error: "Username or email already exists" };
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const { data: user, error } = await supabase
      .from("users")
      .insert([
        {
          username,
          email,
          password_hash: passwordHash,
          full_name: fullName,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return { user, error: null };
  } catch (error) {
    console.error("Sign up error:", error);
    return { user: null as any, error: "Failed to create account" };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: User; error: string | null }> {
  try {
    const passwordHash = await hashPassword(password);

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password_hash", passwordHash)
      .single();

    if (error || !user) {
      return { user: null as any, error: "Invalid email or password" };
    }

    return { user, error: null };
  } catch (error) {
    console.error("Sign in error:", error);
    return { user: null as any, error: "Failed to sign in" };
  }
}

export async function signOut(): Promise<void> {
  // Clear session from localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("currentUser");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
}

export async function setCurrentUser(user: User): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
}
