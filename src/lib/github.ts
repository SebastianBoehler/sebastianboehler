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

  const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
    headers,
    next: { revalidate: 60 * 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch repos: ${res.status}`);
  }

  const data = (await res.json()) as Repo[];
  return data.filter((repo) => !repo.fork);
}
