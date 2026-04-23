import { useRouteContext } from "@tanstack/react-router";
import { X } from "lucide-react";
import { clampHomePopupHeight } from "@/features/home-popup/home-popup-embed";
import { useHomePopup } from "@/features/home-popup/use-home-popup";
import { m } from "@/paraglide/messages";

export function HomePopup() {
  const { siteConfig } = useRouteContext({ from: "__root__" });
  const { embed, isOpen, close } = useHomePopup(siteConfig.homePopup);
  const popupTitle = siteConfig.homePopup.title.trim();
  const popupDescription = siteConfig.homePopup.description.trim();

  if (!isOpen || !embed) return null;

  const iframeHeight = clampHomePopupHeight(embed.height);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={popupTitle || m.home_popup_title()}
      onClick={close}
    >
      <div
        className="relative flex w-full max-w-5xl flex-col overflow-hidden border border-border/40 bg-background shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-border/30 px-6 py-5 md:px-7">
          <div className="space-y-1">
            {popupTitle ? (
              <h2
                className="text-2xl font-serif font-medium tracking-tight text-foreground"
              >
                {popupTitle}
              </h2>
            ) : null}
            {popupDescription ? (
              <p
                className="max-w-2xl text-sm leading-6 text-muted-foreground"
              >
                {popupDescription}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border/40 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={m.home_popup_close()}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-3 md:p-5">
          <div className="overflow-hidden border border-border/20 bg-background shadow-inner">
            <iframe
              src={embed.src}
              title={popupTitle || m.home_popup_title()}
              allow={embed.allow}
              allowFullScreen={embed.allowFullScreen || undefined}
              loading={embed.loading}
              referrerPolicy={embed.referrerPolicy}
              className="block w-full bg-white"
              style={{
                height: `min(${iframeHeight}px, calc(100vh - 12rem))`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
