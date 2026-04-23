import { useRouteContext } from "@tanstack/react-router";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
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
  const dialog = (
    <div
      className="fixed inset-0 z-[220] flex items-start justify-center overflow-y-auto bg-background/80 px-3 py-4 backdrop-blur-sm sm:items-center sm:p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={popupTitle || m.home_popup_title()}
      onClick={close}
      style={{
        paddingTop: "max(1rem, env(safe-area-inset-top))",
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
      }}
    >
      <div
        className="relative my-auto flex w-full max-w-5xl flex-col overflow-hidden border border-border/40 bg-background shadow-[0_28px_80px_-40px_rgba(15,23,42,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border/30 px-4 py-4 sm:gap-4 sm:px-6 md:px-7 md:py-5">
          <div className="min-w-0 flex-1 space-y-1.5">
            {popupTitle ? (
              <h2 className="break-words text-xl font-serif font-medium leading-tight tracking-tight text-foreground sm:text-2xl">
                {popupTitle}
              </h2>
            ) : null}
            {popupDescription ? (
              <p className="max-w-2xl break-words text-sm leading-6 text-muted-foreground">
                {popupDescription}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center border border-border/40 text-muted-foreground transition-colors hover:text-foreground"
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
                height: `min(${iframeHeight}px, calc(100dvh - 13.5rem))`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;

  return createPortal(dialog, document.body);
}
