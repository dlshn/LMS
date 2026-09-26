import PublicNavbar from '../../components/PublicNavbar';
import SiteFooter from '../../components/SiteFooter';
import { IconPhone, IconMail } from '../../components/icons';

export default function Contact() {
  return (
    <div className="app-shell public-shell">
      <PublicNavbar />

      <div className="static-page static-page--narrow">
        <div className="static-page-header">
          <span className="page-eyebrow">
            <IconMail /> Contact
          </span>
          <h1>අපිව Contact කරන්න</h1>
          <p className="muted">ප්‍රශ්නයක් තියෙනවද? අපිට කෙලින්ම කතා කරන්න, message එකක් යවන්න.</p>
        </div>

        <div className="sheet-card contact-card">
          <div className="contact-row">
            <span className="stat-icon-badge stat-icon-badge--ink">
              <IconPhone />
            </span>
            <div>
              <div className="stat-label">Phone</div>
              <a href="tel:+94705570433" className="contact-value">070 557 0433</a>
              <p className="muted text-sm">Dilshan Gamage</p>
            </div>
          </div>

          <div className="contact-row">
            <span className="stat-icon-badge stat-icon-badge--red">
              <IconMail />
            </span>
            <div>
              <div className="stat-label">Email</div>
              <a href="mailto:dgsolutions.contact@gmail.com" className="contact-value">
                dgsolutions.contact@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
