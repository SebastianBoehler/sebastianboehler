export interface Repo {
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  created_at: string;
  fork: boolean;
}

export async function fetchRepos(username: string): Promise<Repo[]> {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  if (process.env.GH_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN}`;
  }

  console.log('[github.fetchRepos] fetching repos for', username)
  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
    headers,
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch repos: ${res.status}`);
  }

  const data = (await res.json()) as Repo[];
  const filtered = data.filter((repo) => !repo.fork);
  console.log('[github.fetchRepos] repos total:', data.length, 'filtered (no forks):', filtered.length)
  return filtered;
}

export interface ContributionYear {
  year: string;
  total: number;
}

export async function fetchContributions(username: string): Promise<ContributionYear[]> {
  console.log('[github.fetchContributions] fetching contributions for', username)
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${username}`, {
    next: { revalidate: 60 * 60 },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch contributions: ${res.status}`);
  }
  const json = (await res.json()) as { total: Record<string, number> };
  const result = Object.entries(json.total).map(([year, total]) => ({ year, total }));
  console.log('[github.fetchContributions] years:', result.map(r => r.year), 'sum total:', result.reduce((a, c) => a + c.total, 0))
  return result;
}
