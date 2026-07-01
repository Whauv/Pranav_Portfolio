export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  topics?: string[];
  created_at: string;
}

export interface TimelineStep {
  id: string;
  year: string;
  label: string;
  emoji: string;
  description: string;
  tag: string;
  url: string;
  githubUrl: string;
  stars: number;
  topics: string[];
  createdAt: string;
}

const EMOJIS = ["🌱", "⚛️", "🗄️", "🎨", "✨", "🚀", "🧠", "📊"] as const;

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const response = await fetch("https://api.github.com/users/Whauv/repos?sort=created&direction=asc");
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub repositories");
  }

  const repos = (await response.json()) as GitHubRepo[];
  return repos.filter((repo) => !repo.name.toLowerCase().includes("portfolio-demo"));
}

export function repoToTimelineStep(repo: GitHubRepo, index: number): TimelineStep {
  const createdDate = new Date(repo.created_at);
  const year = String(createdDate.getFullYear());
  const topics = repo.topics ?? [];
  const tag = topics[0]
    ? topics[0].replace(/[-_]/g, " ")
    : repo.name.toLowerCase().includes("react")
      ? "React"
      : repo.name.toLowerCase().includes("api")
        ? "API"
        : "Project";

  return {
    id: String(repo.id),
    year,
    label: prettifyName(repo.name),
    emoji: EMOJIS[index % EMOJIS.length],
    description: repo.description || "GitHub repository from the ongoing build journey.",
    tag,
    url: repo.homepage || repo.html_url,
    githubUrl: repo.html_url,
    stars: repo.stargazers_count,
    topics,
    createdAt: repo.created_at,
  };
}

function prettifyName(name: string) {
  return name
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
