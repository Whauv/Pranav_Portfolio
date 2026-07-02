export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  fork: boolean;
}

export interface TimelineStep {
  id: string;
  year: string;
  label: string;
  emoji: string;
  summary: string;
  description: string;
  tag: string;
  url: string;
  githubUrl: string;
  stars: number;
  topics: string[];
  createdAt: string;
}

const EXCLUDED = new Set([
  ".github",
  "Whauv",
]);

const LANGUAGE_META: Record<string, { emoji: string; tag: string }> = {
  TypeScript: { emoji: "⚡", tag: "TypeScript" },
  JavaScript: { emoji: "🌐", tag: "JavaScript" },
  Python: { emoji: "🐍", tag: "Python" },
  HTML: { emoji: "🎨", tag: "HTML/CSS" },
  CSS: { emoji: "💠", tag: "CSS" },
  Java: { emoji: "☕", tag: "Java" },
  C: { emoji: "⚙️", tag: "C" },
  "C++": { emoji: "🔧", tag: "C++" },
  default: { emoji: "✨", tag: "Project" },
};

function prettifyName(name: string) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function cleanSummary(text: string) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= 110) return normalized;

  const truncated = normalized.slice(0, 107);
  const safeCut = truncated.lastIndexOf(" ");
  return `${(safeCut > 72 ? truncated.slice(0, safeCut) : truncated).trim()}…`;
}

function fallbackSummaryFromName(name: string, language: string | null) {
  const readableName = prettifyName(name);
  const tech = language?.trim() || "software";

  if (/portfolio/i.test(name)) {
    return `A portfolio project exploring interface and ${tech.toLowerCase()} craft.`;
  }

  if (/bot|assistant|agent/i.test(name)) {
    return `An intelligent ${tech.toLowerCase()} project focused on automation and assistance.`;
  }

  if (/risk|quant|finance|trade|market/i.test(name)) {
    return `A ${tech.toLowerCase()} project built around analytics, signals, and decision support.`;
  }

  if (/vision|camera|image|eye/i.test(name)) {
    return `A ${tech.toLowerCase()} project focused on visual analysis and detection workflows.`;
  }

  return `${readableName} is a ${tech.toLowerCase()} project from the build journey.`;
}

function getProjectSummary(repo: GitHubRepo) {
  if (repo.description) {
    const cleaned = cleanSummary(repo.description);
    if (cleaned) return cleaned;
  }

  const fallback = cleanSummary(fallbackSummaryFromName(repo.name, repo.language));
  return fallback || "A project from the build journey.";
}

function cleanParagraph(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function getProjectDescription(
  repo: GitHubRepo,
  summary: string,
  tag: string,
  topics: string[],
) {
  const readableName = prettifyName(repo.name);
  const topicText =
    topics.length > 0
      ? `Key themes include ${topics.slice(0, 3).join(", ")}.`
      : "";

  if (repo.description) {
    return cleanParagraph(
      `${summary} ${readableName} is part of the broader build journey and is grounded in ${tag}. ${topicText}`.trim(),
    );
  }

  return cleanParagraph(
    `${readableName} is a ${tag.toLowerCase()} project from the build journey, built to explore practical implementation and sharpen technical range. ${topicText}`.trim(),
  );
}

export async function fetchGitHubTimelineSteps(): Promise<TimelineStep[]> {
  const res = await fetch(
    "https://api.github.com/users/Whauv/repos?sort=created&direction=asc&per_page=100",
    { headers: { Accept: "application/vnd.github.v3+json" } },
  );

  if (!res.ok) throw new Error(`GitHub API failed: ${res.status}`);

  const repos: GitHubRepo[] = await res.json();

  return repos
    .filter((r) => !r.fork && !EXCLUDED.has(r.name))
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map((repo) => {
      const meta = LANGUAGE_META[repo.language || ""] || LANGUAGE_META.default;
      const label = prettifyName(repo.name);
      const summary = getProjectSummary(repo);
      const topics = repo.topics || [];
      const tag = repo.language || meta.tag;
      const description = getProjectDescription(repo, summary, tag, topics);

      return {
        id: String(repo.id),
        year: new Date(repo.created_at).getFullYear().toString(),
        label,
        emoji: meta.emoji,
        summary,
        description,
        tag,
        url: repo.homepage || repo.html_url,
        githubUrl: repo.html_url,
        stars: repo.stargazers_count,
        topics,
        createdAt: repo.created_at,
      };
    });
}

export const FALLBACK_TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "1",
    year: "2021",
    label: "2D Game",
    emoji: "🌱",
    summary: "A game prototype built as part of an early hands-on development phase.",
    description:
      "A game prototype built during an early hands-on development phase, focused on learning by making and turning fundamentals into something interactive.",
    tag: "Python",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: [],
    createdAt: "2021-09-01",
  },
  {
    id: "2",
    year: "2022",
    label: "Senseworth",
    emoji: "⚛️",
    summary: "A tweet truth-analysis project focused on classification and readable results.",
    description:
      "A tweet truth-analysis project centered on classification, readability, and practical presentation of model-driven results in a web-based experience.",
    tag: "React",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: [],
    createdAt: "2022-09-01",
  },
  {
    id: "3",
    year: "2023",
    label: "Third Eye",
    emoji: "📷",
    summary: "A Python-based camera project for suspicious activity detection workflows.",
    description:
      "A Python-based camera project for suspicious activity detection workflows, built to explore computer-vision style monitoring and real-world utility.",
    tag: "Python",
    url: "https://github.com/Whauv",
    githubUrl: "https://github.com/Whauv",
    stars: 0,
    topics: [],
    createdAt: "2023-04-01",
  },
];
