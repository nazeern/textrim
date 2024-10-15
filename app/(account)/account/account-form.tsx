"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User } from "@supabase/supabase-js";

export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [fullname, setFullname] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

  const getProfile = useCallback(async () => {
    try {
      setLoading(true);

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`full_name, website, avatar_url`)
        .eq("id", user!.id)
        .single();

      if (error && status !== 406) {
        console.log(error);
        throw error;
      }

      if (data) {
        setFullname(data.full_name);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
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

  async function updateProfile({
    website,
    avatar_url,
  }: {
    fullname: string | null;
    website: string | null;
    avatar_url: string | null;
  }) {
    try {
      setLoading(true);

      const { error } = await supabase.from("profiles").upsert({
        id: user?.id as string,
        full_name: fullname,
        website,
        avatar_url,
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
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullname || ""}
            onChange={(e) => setFullname(e.target.value)}
            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-3"
          />

          <label className="font-semibold" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="url"
            value={website || ""}
            onChange={(e) => setWebsite(e.target.value)}
            className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2 mb-8"
          />
        </div>
        <button
          className="bg-primary rounded-full px-4 py-2 text-onprimary font-semibold"
          onClick={() => updateProfile({ fullname, website, avatar_url })}
          disabled={loading}
        >
          {loading ? "Loading ..." : "Update"}
        </button>
      </div>
    </>
  );
}
