"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", user!.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setName(data.name);
      }
    } catch (error) {
      console.log(error);
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    getProfile();
  }, [user, getProfile]);

  async function updateProfile({ name }: { name: string | null }) {
    try {
      setLoading(true);
      if (!name) {
        alert("Name cannot be empty!");
        return;
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        name: name,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      alert("Profile updated!");
    } catch (error) {
      alert("Error updating the data!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p className="text-4xl font-semibold mb-4">Account</p>
      <div className="w-full rounded-md bg-gray-100 p-4">
        <div className="flex flex-col gap-y-2">
          <label className="font-semibold" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
            value={user?.email}
            disabled
            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
          <label className="font-semibold" htmlFor="fullName">
            Preferred Name
          </label>
          <input
            id="fullName"
            type="text"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />
        </div>
        <button
          className="bg-primary rounded-full px-4 py-2 text-onprimary font-semibold"
          onClick={() => updateProfile({ name })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </>
  );
}
