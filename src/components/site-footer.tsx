import { useT } from "@/lib/i18n";

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="site-footer">
      <div className="shell">
        <span>© {new Date().getFullYear()} Alena Kuritka</span>
        <a href="#top">{t.footer.backToTop}</a>
      </div>
    </footer>
  );
}
