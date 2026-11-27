import { describe, expect, it } from "vitest";
import { resolveSiteConfig } from "@/features/config/config.resolve";
import {
  createSiteConfigInputFormSchema,
  SiteConfigInputSchema,
} from "@/features/config/site-config.schema";
import {
  clampHomePopupHeight,
  parseHomePopupEmbedCode,
} from "./home-popup-embed";

const embedCode =
  '<iframe src="https://example.com/feature" height="600" allowfullscreen></iframe>';

describe("homepage popup", () => {
  it("preserves the saved settings and leaves existing configs disabled by default", () => {
    expect(
      resolveSiteConfig({ site: { title: "Blog" } }).homePopup.enabled,
    ).toBe(false);
    const homePopup = {
      enabled: true,
      title: "Featured page",
      description: "Popup description",
      embedCode,
    };
    const saved = SiteConfigInputSchema.parse({ homePopup });
    expect(resolveSiteConfig({ site: saved }).homePopup).toEqual(homePopup);
    expect(createSiteConfigInputFormSchema().parse(saved).homePopup).toEqual(
      homePopup,
    );
    expect(parseHomePopupEmbedCode(embedCode)).toMatchObject({
      src: "https://example.com/feature",
      height: 600,
      allowFullScreen: true,
    });
  });

  it("rejects unsupported iframe sources and clamps configured heights", () => {
    for (const invalid of [
      '<iframe src="http://example.com/"></iframe>',
      '<iframe src="https://example.com/" srcdoc="text"></iframe>',
    ]) {
      expect(
        SiteConfigInputSchema.safeParse({ homePopup: { embedCode: invalid } })
          .success,
      ).toBe(false);
    }
    expect(clampHomePopupHeight(100)).toBe(320);
    expect(clampHomePopupHeight(1500)).toBe(900);
  });
});
