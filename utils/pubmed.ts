export type PubMedArticle = {
  id: string;
  title: string;
  journal: string;
  date: string; // e.g. "2026 Oct"
  link: string;
};

const BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

// recent veterinary papers about dogs and cats
export const PUBMED_QUERY =
  '("dogs"[MeSH Terms] OR "cats"[MeSH Terms]) AND (veterinary[Title/Abstract] OR health[Title/Abstract])';

export function searchUrl(retmax = 20): string {
  const term = encodeURIComponent(PUBMED_QUERY);
  return `${BASE}/esearch.fcgi?db=pubmed&term=${term}&retmode=json&retmax=${retmax}&sort=date`;
}

export function summaryUrl(ids: string[]): string {
  return `${BASE}/esummary.fcgi?db=pubmed&id=${ids.join(",")}&retmode=json`;
}

export function parseSearch(json: any): string[] {
  return json?.esearchresult?.idlist ?? [];
}

export function parseSummary(json: any): PubMedArticle[] {
  const result = json?.result ?? {};
  const ids: string[] = result.uids ?? [];
  return ids
    .map((id) => result[id])
    .filter(Boolean)
    .map((r: any) => ({
      id: String(r.uid),
      title: String(r.title ?? "").replace(/\.$/, ""),
      journal: String(r.fulljournalname || r.source || ""),
      date: String(r.pubdate ?? ""),
      link: `https://pubmed.ncbi.nlm.nih.gov/${r.uid}/`,
    }))
    .filter((a: PubMedArticle) => a.title);
}
