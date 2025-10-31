export interface ProfileStat {
  label: string;
  value: string;
}

export interface SkillArea {
  id: string;
  title: string;
  headline: string;
  description: string;
  tools: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  techStack: string;
  type: string;
  image: string;
  link?: string;
  github?: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  availability: string;
  phone?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  medium?: string;
  email?: string;
}

export interface ProfileData {
  name: string;
  role: string;
  heroTagline: string;
  heroSubheadline: string;
  heroDescription: string;
  heroCTA: { label: string; href: string };
  heroSecondaryCTA?: { label: string; href: string };
  profileImage: string;
  heroMedia?: string;
  stats: ProfileStat[];
  about: {
    summary: string;
    highlights: string[];
    focus: string;
    motivation: string;
    futureGoals: string[];
  };
  skillsIntro: string;
  skills: SkillArea[];
  projectsIntro: string;
  projects: ProjectItem[];
  contact: ContactInfo;
  socials: SocialLinks;
}

const defaultProfile: ProfileData = {
  name: "Abdullah Javed",
  role: "Software Engineer & ML Enthusiast",
  heroTagline: "I build intelligent, human-centered software experiences.",
  heroSubheadline:
    "Full-stack engineer exploring the intersection of web craftsmanship, Java applications, and applied machine learning.",
  heroDescription:
    "I design and ship performant web platforms, experiment with ML-driven products, and love shaping ideas into production-ready experiences.",
  heroCTA: {
    label: "Explore Projects",
    href: "#projects",
  },
  profileImage: "/profile/abdullah-portrait.png",
  heroMedia: "/profile/hero-grid.jpg",
  stats: [
    { label: "Years of Experience", value: "3+" },
    { label: "Projects Delivered", value: "12" },
    { label: "ML Experiments", value: "8" },
  ],
  about: {
    summary:
      "I am a dedicated software engineer passionate about solving real-world problems with modern web technologies, Java-based interfaces, and data-driven intelligence.",
    highlights: [
      "React, Next.js, and Node.js for scalable web solutions",
      "Java Swing & JavaFX desktop tools focused on usability",
      "Hands-on machine learning prototypes using TensorFlow and Scikit-learn",
    ],
    focus:
      "Currently crafting AI-assisted product experiences while deepening my understanding of MLOps and model deployment pipelines.",
    motivation:
      "Continuous learning and experimentation fuel my creativity. I thrive on blending thoughtful design with robust engineering to make technology genuinely helpful.",
    futureGoals: [
      "Earn a full-time Machine Learning Engineer role",
      "Contribute to impactful open-source AI initiatives",
      "Ship production-grade intelligent software that scales",
    ],
  },
  skillsIntro:
    "Bridging modern web development with machine learning to build intelligent, scalable software solutions.",
  skills: [
    {
      id: "skill-web",
      title: "Web Engineering",
      headline: "End-to-end web apps",
      description:
        "Architecting performant, accessible web applications with React, Next.js, TypeScript, and Node.js to deliver fluid UX across devices.",
      tools: ["React", "Next.js", "TypeScript", "Tailwind", "Node.js"],
    },
    {
      id: "skill-frontend",
      title: "Creative Front-End",
      headline: "Immersive UI systems",
      description:
        "Designing interactive layouts, WebGL experiences, and motion systems using Three.js, Framer Motion, and GSAP for memorable storytelling.",
      tools: ["Three.js", "Framer Motion", "GSAP", "Spline", "WebGL"],
    },
    {
      id: "skill-java",
      title: "Java Applications",
      headline: "Desktop productivity",
      description:
        "Building Java Swing and JavaFX tools with thoughtful interfaces for productivity, process automation, and analytics dashboards.",
      tools: ["Java", "Swing", "JavaFX", "Gradle"],
    },
    {
      id: "skill-ml",
      title: "Machine Learning",
      headline: "Model experimentation",
      description:
        "Prototyping ML systems with TensorFlow and Scikit-learn, exploring computer vision, NLP, and predictive analytics workflows.",
      tools: ["Python", "TensorFlow", "Scikit-learn", "Pandas"],
    },
    {
      id: "skill-backend",
      title: "API & Data",
      headline: "Reliable back-ends",
      description:
        "Designing RESTful APIs, data pipelines, and integrations with Express, Prisma, and MongoDB/PostgreSQL best practices.",
      tools: ["Express", "Prisma", "PostgreSQL", "MongoDB"],
    },
    {
      id: "skill-growth",
      title: "Continuous Growth",
      headline: "Learning mindset",
      description:
        "Contributing to open-source, mentoring peers, and keeping pace with evolving AI research, cloud services, and developer tooling.",
      tools: ["Git", "GitHub", "Open Source", "Community"],
    },
  ],
  projectsIntro:
    "Selected projects that showcase how I combine engineering rigor with creative problem solving.",
  projects: [
    {
      id: "project-portfolio",
      title: "AI-Ready Portfolio Platform",
      description:
        "A responsive personal site with WebGL-enhanced hero experiences, editable content via admin tooling, and SEO-focused architecture.",
      techStack: "Next.js, TypeScript, Tailwind, Three.js",
      type: "Personal",
      image: "/works/works01.jpg",
      link: "https://github.com/abdullahjaved/portfolio",
      github: "https://github.com/abdullahjaved/portfolio",
    },
    {
      id: "project-vision",
      title: "Vision Classifier Lab",
      description:
        "An image classification pipeline experimenting with data augmentation, transfer learning, and actionable model insights dashboards.",
      techStack: "Python, TensorFlow, FastAPI, Docker",
      type: "Research",
      image: "/works/works02.jpg",
      link: "https://github.com/abdullahjaved/ml-classifier",
      github: "https://github.com/abdullahjaved/ml-classifier",
    },
    {
      id: "project-taskflow",
      title: "TaskFlow Desktop Manager",
      description:
        "A cross-platform Java desktop application that streamlines daily task management with offline storage and productivity analytics.",
      techStack: "Java, Swing, SQLite",
      type: "Personal",
      image: "/works/works03.jpg",
      link: "https://github.com/abdullahjaved/java-task-manager",
      github: "https://github.com/abdullahjaved/java-task-manager",
    },
  ],
  contact: {
    email: "Abdullahjavec@gmail.com",
    location: "Lahore, Pakistan",
    availability: "Open to full-time ML engineering roles and select freelance collaborations.",
    phone: "+92 300 0000000",
  },
  socials: {
    github: "https://github.com/Abdullahjaved-82",
    linkedin: "https://www.linkedin.com/in/abdullah-javed-8468a7343",
    email: "mailto:Abdullahjavec@gmail.com",
  },
};

export function isPlainObject(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
  if (!isPlainObject(source) && !Array.isArray(source)) {
    return source === undefined ? target : (source as T);
  }

  if (Array.isArray(source)) {
    return source as T;
  }

  // Treat arrays as mutable objects during merge while keeping the downstream shape typed.
  const result = (Array.isArray(target)
    ? [...((target as unknown as Array<unknown>) ?? [])]
    : { ...(target as Record<string, unknown>) }) as Record<string, unknown>;

  Object.keys(source).forEach((key) => {
    const sourceValue = (source as Record<string, unknown>)[key];
    if (sourceValue === undefined) {
      return;
    }
    const targetValue = result[key];
    if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (Array.isArray(sourceValue)) {
      result[key] = [...sourceValue];
    } else {
      result[key] = sourceValue;
    }
  });

  return result as T;
}

export function mergeProfile(overrides?: Partial<ProfileData>): ProfileData {
  const base = JSON.parse(JSON.stringify(defaultProfile)) as ProfileData;
  if (!overrides) {
    return base;
  }
  return deepMerge(base, overrides);
}

export { defaultProfile };
