export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
export function matches(text: string, query: string) {
  return normalize(query)
    .trim()
    .split(/\s+/)
    .every((term) => normalize(text).includes(term));
}
export type SearchItem = {
  id: string;
  url: string;
  title: string;
  description: string;
  tags: string[];
  content: string;
  type: "post" | "project";
};
export function searchItems(items: SearchItem[], query: string) {
  if (!query.trim()) return [];
  return items
    .filter((item) =>
      matches(
        [item.title, item.description, item.content, ...item.tags].join(" "),
        query,
      ),
    )
    .sort(
      (a, b) =>
        Number(matches(b.title, query)) - Number(matches(a.title, query)),
    )
    .slice(0, 10);
}
