import { useT } from "@/lib/i18n";
import { content } from "@/generated/content";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="site-footer">
      <div className="shell">
        <span>© {new Date().getFullYear()} {content.site.name}</span>
        <a href="#top">{t.footer.backToTop}</a>
      </div>
    </footer>
  );
}
