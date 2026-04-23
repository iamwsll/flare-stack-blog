import { useEffect, useMemo, useState } from "react";
import type { HomePopupSiteConfig } from "@/features/config/site-config.schema";
import { parseHomePopupEmbedCode } from "./home-popup-embed";

export function useHomePopup(homePopup: HomePopupSiteConfig) {
  const embed = useMemo(
    () => parseHomePopupEmbedCode(homePopup.embedCode),
    [homePopup.embedCode],
  );
  const shouldAutoOpen = homePopup.enabled && embed !== null;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(shouldAutoOpen);
  }, [shouldAutoOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return {
    embed,
    isOpen,
    close: () => setIsOpen(false),
  };
}
