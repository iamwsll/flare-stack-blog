import type { JSONContent } from "@tiptap/react";

export async function calculatePostHash(post: {
  title: string;
  contentJson: JSONContent | null;
  summary: string | null;
  tagIds: Array<number>;
  slug: string;
  publishedAt: Date | string | null;
  readTimeInMinutes: number;
}): Promise<string> {
  const stateToHash = {
    title: post.title,
    contentJson: post.contentJson,
    summary: post.summary,
    tagIds: [...post.tagIds].sort(),
    slug: post.slug,
    publishedAt:
      post.publishedAt instanceof Date
        ? post.publishedAt.toISOString()
        : post.publishedAt,
    readTimeInMinutes: post.readTimeInMinutes,
  };

  const msgUint8 = new TextEncoder().encode(JSON.stringify(stateToHash));
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
