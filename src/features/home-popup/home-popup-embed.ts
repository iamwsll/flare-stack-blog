import type { IframeHTMLAttributes } from "react";

const IFRAME_SELF_CLOSING_RE = /^<iframe\b([\s\S]*?)\/>\s*$/i;
const IFRAME_STANDARD_RE = /^<iframe\b([\s\S]*?)>\s*<\/iframe>\s*$/i;
const ATTRIBUTE_RE =
  /([^\s"'=<>`/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

export const HOME_POPUP_DEFAULT_HEIGHT = 600;
export const HOME_POPUP_MIN_HEIGHT = 320;
export const HOME_POPUP_MAX_HEIGHT = 900;
type HomePopupReferrerPolicy = NonNullable<
  IframeHTMLAttributes<HTMLIFrameElement>["referrerPolicy"]
>;

const HOME_POPUP_REFERRER_POLICIES = new Set<HomePopupReferrerPolicy>([
  "no-referrer",
  "no-referrer-when-downgrade",
  "origin",
  "origin-when-cross-origin",
  "same-origin",
  "strict-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url",
]);

export interface HomePopupEmbed {
  src: string;
  height: number;
  allow?: string;
  allowFullScreen: boolean;
  loading: "lazy" | "eager";
  referrerPolicy?: HomePopupReferrerPolicy;
}

function extractAttributeSource(embedCode: string) {
  const selfClosingMatch = embedCode.match(IFRAME_SELF_CLOSING_RE);
  if (selfClosingMatch) return selfClosingMatch[1];

  const standardMatch = embedCode.match(IFRAME_STANDARD_RE);
  if (standardMatch) return standardMatch[1];

  return null;
}

function parseAttributes(source: string): Map<string, string | boolean> | null {
  const attributes = new Map<string, string | boolean>();
  let cursor = 0;

  ATTRIBUTE_RE.lastIndex = 0;

  for (
    let match = ATTRIBUTE_RE.exec(source);
    match;
    match = ATTRIBUTE_RE.exec(source)
  ) {
    const leading = source.slice(cursor, match.index);
    if (leading.trim() !== "") return null;

    const name = match[1]?.toLowerCase();
    if (!name || attributes.has(name)) return null;

    const value = match[2] ?? match[3] ?? match[4];
    attributes.set(name, value ?? true);
    cursor = ATTRIBUTE_RE.lastIndex;
  }

  if (source.slice(cursor).trim() !== "") return null;

  return attributes;
}

function normalizeHeight(value: string | boolean | undefined) {
  if (typeof value !== "string") return HOME_POPUP_DEFAULT_HEIGHT;

  const match = value.trim().match(/^(\d+)(px)?$/i);
  if (!match) return HOME_POPUP_DEFAULT_HEIGHT;

  return Number(match[1]);
}

function normalizeReferrerPolicy(
  value: string | boolean | undefined,
): HomePopupReferrerPolicy | undefined {
  if (typeof value !== "string") return undefined;

  const normalized = value.trim().toLowerCase();

  if (!HOME_POPUP_REFERRER_POLICIES.has(normalized as HomePopupReferrerPolicy)) {
    return undefined;
  }

  return normalized as HomePopupReferrerPolicy;
}

export function clampHomePopupHeight(height: number) {
  return Math.min(HOME_POPUP_MAX_HEIGHT, Math.max(HOME_POPUP_MIN_HEIGHT, height));
}

export function parseHomePopupEmbedCode(
  embedCode: string,
): HomePopupEmbed | null {
  const trimmed = embedCode.trim();
  if (!trimmed) return null;

  const attributeSource = extractAttributeSource(trimmed);
  if (attributeSource === null) return null;

  const attributes = parseAttributes(attributeSource);
  if (!attributes) return null;

  for (const name of attributes.keys()) {
    if (name.startsWith("on") || name === "srcdoc") return null;
  }

  const srcValue = attributes.get("src");
  if (typeof srcValue !== "string" || srcValue.trim() === "") return null;

  let src: URL;
  try {
    src = new URL(srcValue.trim());
  } catch {
    return null;
  }

  if (src.protocol !== "https:") return null;

  const allowValue = attributes.get("allow");
  const referrerPolicyValue = attributes.get("referrerpolicy");
  const loadingValue = attributes.get("loading");

  return {
    src: src.toString(),
    height: normalizeHeight(attributes.get("height")),
    allow:
      typeof allowValue === "string" && allowValue.trim() !== ""
        ? allowValue.trim()
        : undefined,
    allowFullScreen: attributes.has("allowfullscreen"),
    loading:
      typeof loadingValue === "string" &&
      loadingValue.trim().toLowerCase() === "eager"
        ? "eager"
        : "lazy",
    referrerPolicy: normalizeReferrerPolicy(referrerPolicyValue),
  };
}

export function isValidHomePopupEmbedCode(embedCode: string) {
  return embedCode.trim() === "" || parseHomePopupEmbedCode(embedCode) !== null;
}
