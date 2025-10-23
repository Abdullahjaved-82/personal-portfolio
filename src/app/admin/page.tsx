"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useProfile, defaultProfile } from "@/context/ProfileContext";
import type {
  ProfileData,
  SkillArea,
  ProjectItem,
  ProfileStat,
} from "@/context/ProfileContext";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ?? "Abdullahjavec@gmail.com";
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "@Abdullah282";

const cloneProfile = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

const STORAGE_KEY = "abdullah-admin-auth";

export default function AdminPage() {
  const { profile, overwriteProfile, resetProfile } = useProfile();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(() => cloneProfile(profile));
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (!statusMessage || typeof window === "undefined") return;
    const timeout = window.setTimeout(() => setStatusMessage(null), 4000);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setFormData(cloneProfile(profile));
    }
  }, [profile, isAuthenticated]);

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "").trim();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError(null);
      setStatusMessage("Logged in. You can safely edit your portfolio.");
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(STORAGE_KEY, "true");
      }
    } else {
      setLoginError("Incorrect email or password. Update your NEXT_PUBLIC_ADMIN credentials if needed.");
    }
  };

  const updateProfileDraft = (updater: (draft: ProfileData) => void) => {
    setFormData((prev) => {
      const next = cloneProfile(prev);
      updater(next);
      return next;
    });
  };

  const handleStatChange = (index: number, key: keyof ProfileStat, value: string) => {
    updateProfileDraft((draft) => {
      draft.stats[index][key] = value;
    });
  };

  const handleSkillChange = (index: number, key: keyof SkillArea, value: string | string[]) => {
    updateProfileDraft((draft) => {
      if (key === "tools" && Array.isArray(value)) {
        draft.skills[index].tools = value;
      } else if (typeof value === "string") {
        (draft.skills[index] as any)[key] = value;
      }
    });
  };

  const handleProjectChange = (index: number, key: keyof ProjectItem, value: string) => {
    updateProfileDraft((draft) => {
      (draft.projects[index] as any)[key] = value;
    });
  };

  const addSkill = () => {
    updateProfileDraft((draft) => {
      const newSkill: SkillArea = {
        id: `skill-${Date.now()}`,
        title: "New Skill Area",
        headline: "",
        description: "",
        tools: [],
      };
      draft.skills.push(newSkill);
    });
  };

  const removeSkill = (index: number) => {
    updateProfileDraft((draft) => {
      draft.skills.splice(index, 1);
    });
  };

  const addProject = () => {
    updateProfileDraft((draft) => {
      const newProject: ProjectItem = {
        id: `project-${Date.now()}`,
        title: "New Project",
        description: "",
        techStack: "",
        type: "",
        image: "/projects/new-project.jpg",
        link: "",
        github: "",
      };
      draft.projects.push(newProject);
    });
  };

  const removeProject = (index: number) => {
    updateProfileDraft((draft) => {
      draft.projects.splice(index, 1);
    });
  };

  const handleSave = () => {
    overwriteProfile(formData);
    setStatusMessage("Profile saved. Changes are now reflected on the site.");
  };

  const handleReset = () => {
    const confirmReset = window.confirm("Reset to default Abdullah Javed profile data?");
    if (confirmReset) {
      resetProfile();
      setFormData(cloneProfile(defaultProfile));
      setStatusMessage("Profile reset to defaults. Remember to customise again.");
    }
  };

  const futureGoalsText = useMemo(
    () => formData.about.futureGoals.join("\n"),
    [formData.about.futureGoals]
  );

  const highlightsText = useMemo(
    () => formData.about.highlights.join("\n"),
    [formData.about.highlights]
  );

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur"
        >
          <div>
            <h1 className="text-3xl font-semibold">Admin Access</h1>
            <p className="mt-2 text-sm text-white/70">
              Enter the admin email and password configured in your environment variables to edit your content live.
            </p>
          </div>
          <div className="space-y-4">
            <label className="block text-sm text-white/70">
              Email
              <input
                required
                type="email"
                name="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                placeholder="admin@example.com"
              />
            </label>
            <label className="block text-sm text-white/70">
              Password
              <input
                required
                type="password"
                name="password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
                placeholder="••••••••"
              />
            </label>
            {loginError && <p className="text-sm text-rose-400">{loginError}</p>}
          </div>
          <button
            type="submit"
            className="w-full rounded-full border border-white px-6 py-3 text-sm uppercase tracking-[0.4em] text-white hover:bg-white hover:text-black transition"
          >
            Log in
          </button>
          <p className="text-xs text-white/40">
            Tip: customise credentials via NEXT_PUBLIC_ADMIN_EMAIL and NEXT_PUBLIC_ADMIN_PASSWORD in your environment.
          </p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pb-24 text-white">
      <div className="container mx-auto px-6 pt-28 lg:px-12">
        <header className="flex flex-col gap-4 border-b border-white/10 pb-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Portfolio Control Centre</h1>
              <p className="text-sm text-white/60">
                Update hero messaging, skills, projects, and contact details. Changes save to local storage for instant preview.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/60"
              >
                Reset defaults
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full border border-white px-6 py-2 text-xs uppercase tracking-[0.3em] text-black bg-white hover:bg-white/90"
              >
                Save changes
              </button>
            </div>
          </div>
          <div aria-live="polite" className="min-h-[1.75rem]">
            {statusMessage && (
              <p className="inline-flex items-center rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-medium text-emerald-200">
                {statusMessage}
              </p>
            )}
          </div>
        </header>

        <section className="mt-10 grid gap-10">
          <ArticleCard title="Hero">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Name"
                value={formData.name}
                onChange={(value) => updateProfileDraft((draft) => { draft.name = value; })}
              />
              <TextField
                label="Role"
                value={formData.role}
                onChange={(value) => updateProfileDraft((draft) => { draft.role = value; })}
              />
            </div>
            <TextField
              label="Hero tagline"
              value={formData.heroTagline}
              onChange={(value) => updateProfileDraft((draft) => { draft.heroTagline = value; })}
            />
            <TextArea
              label="Hero subheadline"
              value={formData.heroSubheadline}
              onChange={(value) => updateProfileDraft((draft) => { draft.heroSubheadline = value; })}
            />
            <TextArea
              label="Hero description"
              value={formData.heroDescription}
              onChange={(value) => updateProfileDraft((draft) => { draft.heroDescription = value; })}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Primary CTA label"
                value={formData.heroCTA.label}
                onChange={(value) => updateProfileDraft((draft) => { draft.heroCTA.label = value; })}
              />
              <TextField
                label="Primary CTA href"
                value={formData.heroCTA.href}
                onChange={(value) => updateProfileDraft((draft) => { draft.heroCTA.href = value; })}
              />
              <TextField
                label="Secondary CTA label"
                value={formData.heroSecondaryCTA?.label ?? ""}
                onChange={(value) => updateProfileDraft((draft) => {
                  draft.heroSecondaryCTA = draft.heroSecondaryCTA ?? { label: "", href: "" };
                  draft.heroSecondaryCTA.label = value;
                })}
              />
              <TextField
                label="Secondary CTA href"
                value={formData.heroSecondaryCTA?.href ?? ""}
                onChange={(value) => updateProfileDraft((draft) => {
                  draft.heroSecondaryCTA = draft.heroSecondaryCTA ?? { label: "", href: "" };
                  draft.heroSecondaryCTA.href = value;
                })}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Profile image path"
                value={formData.profileImage}
                onChange={(value) => updateProfileDraft((draft) => { draft.profileImage = value; })}
                helper="Recommended 3:4 portrait. Add file under public/profile/."
              />
              <TextField
                label="Hero background media path"
                value={formData.heroMedia ?? ""}
                onChange={(value) => updateProfileDraft((draft) => { draft.heroMedia = value; })}
                helper="Used in menu backdrop. Add wide image (16:9)."
              />
            </div>
          </ArticleCard>

          <ArticleCard title="About">
            <TextArea
              label="Summary"
              value={formData.about.summary}
              onChange={(value) => updateProfileDraft((draft) => { draft.about.summary = value; })}
            />
            <TextArea
              label="Focus"
              value={formData.about.focus}
              onChange={(value) => updateProfileDraft((draft) => { draft.about.focus = value; })}
            />
            <TextArea
              label="Motivation"
              value={formData.about.motivation}
              onChange={(value) => updateProfileDraft((draft) => { draft.about.motivation = value; })}
            />
            <TextArea
              label="Highlights (one per line)"
              value={highlightsText}
              onChange={(value) => updateProfileDraft((draft) => {
                draft.about.highlights = value.split("\n").map((item) => item.trim()).filter(Boolean);
              })}
            />
            <TextArea
              label="Future goals (one per line)"
              value={futureGoalsText}
              onChange={(value) => updateProfileDraft((draft) => {
                draft.about.futureGoals = value.split("\n").map((item) => item.trim()).filter(Boolean);
              })}
            />
            <div className="grid gap-4 md:grid-cols-3">
              {formData.stats.map((stat, index) => (
                <div key={stat.label + index} className="rounded-2xl border border-white/10 p-4">
                  <TextField
                    label="Label"
                    value={stat.label}
                    onChange={(value) => handleStatChange(index, "label", value)}
                  />
                  <TextField
                    label="Value"
                    value={stat.value}
                    onChange={(value) => handleStatChange(index, "value", value)}
                  />
                </div>
              ))}
            </div>
          </ArticleCard>

          <ArticleCard
            title="Skills"
            actionButton={{ label: "Add skill", onClick: addSkill }}
          >
            <p className="text-sm text-white/50">Reorder skills by editing the list below. Tools accept comma-separated values.</p>
            <div className="mt-6 grid gap-6">
              {formData.skills.map((skill, index) => (
                <div key={skill.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold">{skill.title}</h3>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-xs uppercase tracking-[0.3em] text-white/40 hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextField
                      label="Title"
                      value={skill.title}
                      onChange={(value) => handleSkillChange(index, "title", value)}
                    />
                    <TextField
                      label="Headline"
                      value={skill.headline}
                      onChange={(value) => handleSkillChange(index, "headline", value)}
                    />
                  </div>
                  <TextArea
                    label="Description"
                    value={skill.description}
                    onChange={(value) => handleSkillChange(index, "description", value)}
                  />
                  <TextField
                    label="Tools (comma separated)"
                    value={skill.tools.join(", ")}
                    onChange={(value) => handleSkillChange(index, "tools", value.split(",").map((item) => item.trim()).filter(Boolean))}
                  />
                </div>
              ))}
            </div>
          </ArticleCard>

          <ArticleCard
            title="Projects"
            actionButton={{ label: "Add project", onClick: addProject }}
          >
            <div className="grid gap-6">
              {formData.projects.map((project, index) => (
                <div key={project.id} className="rounded-3xl border border-white/10 bg-white/5 p-6">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-lg font-semibold">{project.title || `Project ${index + 1}`}</h3>
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-xs uppercase tracking-[0.3em] text-white/40 hover:text-rose-400"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <TextField
                      label="Title"
                      value={project.title}
                      onChange={(value) => handleProjectChange(index, "title", value)}
                    />
                    <TextField
                      label="Type"
                      value={project.type}
                      onChange={(value) => handleProjectChange(index, "type", value)}
                    />
                  </div>
                  <TextArea
                    label="Description"
                    value={project.description}
                    onChange={(value) => handleProjectChange(index, "description", value)}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                      label="Tech stack"
                      value={project.techStack}
                      onChange={(value) => handleProjectChange(index, "techStack", value)}
                    />
                    <TextField
                      label="Image path"
                      value={project.image}
                      onChange={(value) => handleProjectChange(index, "image", value)}
                      helper="Place image under public/projects/. Recommended 16:10."
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField
                      label="Project link"
                      value={project.link ?? ""}
                      onChange={(value) => handleProjectChange(index, "link", value)}
                    />
                    <TextField
                      label="GitHub link"
                      value={project.github ?? ""}
                      onChange={(value) => handleProjectChange(index, "github", value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ArticleCard>

          <ArticleCard title="Contact & Socials">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Email"
                value={formData.contact.email}
                onChange={(value) => updateProfileDraft((draft) => { draft.contact.email = value; draft.socials.email = value.startsWith("mailto:") ? value : `mailto:${value}`; })}
                helper="Use plain email or mailto: link."
              />
              <TextField
                label="Location"
                value={formData.contact.location}
                onChange={(value) => updateProfileDraft((draft) => { draft.contact.location = value; })}
              />
              <TextField
                label="Availability"
                value={formData.contact.availability}
                onChange={(value) => updateProfileDraft((draft) => { draft.contact.availability = value; })}
              />
              <TextField
                label="Phone (optional)"
                value={formData.contact.phone ?? ""}
                onChange={(value) => updateProfileDraft((draft) => { draft.contact.phone = value; })}
              />
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Object.entries(formData.socials).map(([key, value]) => (
                <TextField
                  key={key}
                  label={`${key.charAt(0).toUpperCase()}${key.slice(1)} URL`}
                  value={value ?? ""}
                  onChange={(val) => updateProfileDraft((draft) => { draft.socials[key as keyof typeof draft.socials] = val; })}
                />
              ))}
            </div>
          </ArticleCard>
        </section>

        <footer className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
          <p>
            Need to add new content types or sections? Open <code className="rounded bg-white/10 px-1">src/context/ProfileContext.tsx</code> to extend the profile schema, then update this admin panel accordingly.
          </p>
          <p className="mt-2">
            Looking for assets? Store them under <code className="rounded bg-white/10 px-1">public/profile</code> or <code className="rounded bg-white/10 px-1">public/projects</code> and reference them via the fields above.
          </p>
        </footer>
      </div>
    </main>
  );
}

function ArticleCard({
  title,
  children,
  actionButton,
}: {
  title: string;
  children: React.ReactNode;
  actionButton?: { label: string; onClick: () => void };
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {actionButton && (
          <button
            type="button"
            onClick={actionButton.onClick}
            className="rounded-full border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/70 hover:border-white/60"
          >
            {actionButton.label}
          </button>
        )}
      </div>
      <div className="mt-6 space-y-6">{children}</div>
    </article>
  );
}

function TextField({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      {label}
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
      />
      {helper && <span className="text-xs text-white/40">{helper}</span>}
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  helper,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      {label}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white focus:border-white/40 focus:outline-none"
      />
      {helper && <span className="text-xs text-white/40">{helper}</span>}
    </label>
  );
}
