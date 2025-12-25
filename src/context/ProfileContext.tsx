"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultProfile as baseDefaultProfile, mergeProfile, type ProfileData } from "@/lib/profile-data";

// Re-export the shared default profile snapshot for admin consumers.
export const defaultProfile = baseDefaultProfile;
export type ProfileShape = typeof defaultProfile;
export type { ProfileData, SkillArea, ProjectItem, ProfileStat } from "@/lib/profile-data";

type Nullable<T> = T | null;

interface ProfileContextValue {
  profile: ProfileData;
  isLoading: boolean;
  overwriteProfile: (nextProfile: ProfileData) => Promise<void>;
  resetProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  defaultProfile: ProfileData;
}

const ProfileContext = createContext<Nullable<ProfileContextValue>>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = useCallback(async () => {
    if (typeof window === "undefined") {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setProfile(mergeProfile(data.profile));
      } else {
        setProfile(mergeProfile());
      }
    } catch (error) {
      console.warn("Failed to load profile data", error);
      setProfile(mergeProfile());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const overwriteProfile = useCallback(async (nextProfile: ProfileData) => {
    const payload = mergeProfile(nextProfile);
    let response: Response;
    try {
      response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: payload }),
      });
    } catch (error: any) {
      throw new Error(error?.message ? `Network error: ${error.message}` : "Network error while saving profile");
    }

    if (!response.ok) {
      let message = `Failed to persist profile data (${response.status} ${response.statusText})`;
      try {
        const data = await response.json();
        if (data?.error) message = String(data.error);
      } catch {
        try {
          const text = await response.text();
          if (text) message = `${message}: ${text.slice(0, 200)}`;
        } catch {
          // ignore
        }
      }
      throw new Error(message);
    }

    const data = await response.json();
    setProfile(mergeProfile(data.profile));
  }, []);

  const resetProfile = useCallback(async () => {
    let response: Response;
    try {
      response = await fetch("/api/profile/reset", { method: "POST" });
    } catch (error: any) {
      throw new Error(error?.message ? `Network error: ${error.message}` : "Network error while resetting profile");
    }

    if (!response.ok) {
      let message = `Failed to reset profile data (${response.status} ${response.statusText})`;
      try {
        const data = await response.json();
        if (data?.error) message = String(data.error);
      } catch {
        try {
          const text = await response.text();
          if (text) message = `${message}: ${text.slice(0, 200)}`;
        } catch {
          // ignore
        }
      }
      throw new Error(message);
    }

    const data = await response.json();
    setProfile(mergeProfile(data.profile));
  }, []);

  const value = useMemo<ProfileContextValue>(
  () => ({ profile, isLoading, overwriteProfile, resetProfile, refreshProfile, defaultProfile }),
    [profile, isLoading, overwriteProfile, resetProfile, refreshProfile]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
