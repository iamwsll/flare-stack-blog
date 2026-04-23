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
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/35 p-4 backdrop-blur-md md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={popupTitle || m.home_popup_title()}
      onClick={close}
    >
      <div
        className="fuwari-card-base relative flex w-full max-w-5xl flex-col overflow-hidden rounded-[1.5rem] border border-black/5 shadow-[0_40px_120px_-48px_rgba(15,23,42,0.65)] dark:border-white/10"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-black/5 px-5 py-4 dark:border-white/10 md:px-6 md:py-5">
          <div className="space-y-1">
            {popupTitle ? (
              <h2
                className="text-2xl font-semibold tracking-tight fuwari-text-90"
              >
                {popupTitle}
              </h2>
            ) : null}
            {popupDescription ? (
              <p
                className="max-w-2xl text-sm leading-6 fuwari-text-50"
              >
                {popupDescription}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={close}
            className="fuwari-btn-regular inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            aria-label={m.home_popup_close()}
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        <div className="p-3 md:p-5">
          <div className="overflow-hidden rounded-[1.25rem] border border-black/5 bg-white/80 shadow-inner dark:border-white/10 dark:bg-black/10">
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
