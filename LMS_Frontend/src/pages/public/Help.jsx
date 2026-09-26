import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import SiteFooter from '../../components/SiteFooter';
import { IconHelpCircle } from '../../components/icons';

export default function Help() {
  return (
    <div className="app-shell public-shell">
      <PublicNavbar />

      <div className="static-page">
        <div className="static-page-header">
          <span className="page-eyebrow">
            <IconHelpCircle /> Help
          </span>
          <h1>ඔබට උදව් අවශ්‍යද?</h1>
          <p className="muted">Step-by-step instructions — student එක account eka හදාගන්න, login වෙන්න සහ Result check කරන්න.</p>
        </div>

        <div className="sheet-card">
          <h2>ශිෂ්‍යයෙක් ලෙස register වෙන්නේ කොහොමද?</h2>
          <ol className="help-steps">
            <li>
              <strong>ඔබගේ Admin (ටියුෂන් class eke ගුරුවරයා) ගෙන් මේ දෙක ලබාගන්න:</strong>
              <p className="muted text-sm">Student Number එක (උදා: S001) සහ Class Join Code එක (උදා: ABC123)</p>
            </li>
            <li>
              <strong><Link to="/student/register">Student Register</Link> පිටුවට යන්න</strong>
              <p className="muted text-sm">Navbar එකේ "Student Register" click කරන්න, නැත්නම් home page එකේ "Student Registr" button එකෙන්.</p>
            </li>
            <li>
              <strong>Form එක fill කරන්න</strong>
              <p className="muted text-sm">
                "Given by your admin" section එකට Student Number සහ Join Code එක ඇතුල් කරන්න. පසුව ඔබටම
                username එකක් සහ password එකක් තෝරගන්න.
              </p>
            </li>
            <li>
              <strong>"Create account" click කරන්න</strong>
              <p className="muted text-sm">සාර්ථක උනොත් ඔබ කෙලින්ම ඔබගේ dashboard එකට login වෙනවා.</p>
            </li>
          </ol>
        </div>

        <div className="sheet-card spacer-top">
          <h2>Login වෙන්නේ කොහොමද?</h2>
          <ol className="help-steps">
            <li>
              <strong><Link to="/student/login">Student Login</Link> පිටුවට යන්න</strong>
            </li>
            <li>
              <strong>Register වෙනකොට ඔබ තෝරගත් username සහ password එක type කරන්න</strong>
            </li>
          </ol>
        </div>

        <div className="sheet-card spacer-top">
          <h2>ප්‍රතිඵල, පැමිණීම සහ සටහන් බලාගන්නේ කොහොමද?</h2>
          <p className="text-sm muted">
            Login වුනාට පස්සේ ඔබගේ dashboard එකේ, admin publish කරපු exam ප්‍රතිඵල, rank එක, class average එක,
            පැමිණීමේ % එක සහ upload කරපු notes සියල්ලම එකම තැනකින් බලාගන්න පුළුවන්.
          </p>
        </div>

        

        <div className="sheet-card spacer-top">
          <h2>නිතර අහන ප්‍රශ්න (FAQ)</h2>

          <details className="faq-item">
            <summary>Join Code එක නැත්නම් මොකද කරන්නේ?</summary>
            <p className="text-sm muted">ඔබගේ ටියුෂන් class admin/ගුරුවරයාගෙන් Class Join Code එක අහගන්න — එය admin ගේ dashboard එකේ තිබෙනවා.</p>
          </details>

          <details className="faq-item">
            <summary>Password එක අමතක උනොත්?</summary>
            <p className="text-sm muted">
              දැනට self-service password reset feature එකක් නැහැ. කරුණාකර ඔබගේ admin ව <Link to="/contact">Contact</Link> කර
              උදව් ලබාගන්න.
            </p>
          </details>

          <details className="faq-item">
            <summary>මගේ Student Number ඇත්තටම register වුනාද කියලා දන්නේ කොහොමද?</summary>
            <p className="text-sm muted">
              දැනටමත් register වුනු Student Number එකක් ආයේ register කරන්න try කලොත්, "already registered" error එකක් එනවා —
              එතකොට <Link to="/student/login">Student Login</Link> එකෙන් කෙලින්ම login වෙන්න.
            </p>
          </details>

          <details className="faq-item">
            <summary>Exam publish කරලා තියෙනකොටත් ලකුණු නොපෙන්නෙනවා නම්?</summary>
            <p className="text-sm muted">
              ඔබගේ admin තවම ඔබගේ marks entry කරලා නැති නිසා වෙන්න පුළුවන්. Exam එක "Published" උනත්, ඇතුල් කරපු ලකුණු
              witharai penenne.
            </p>
          </details>
        </div>

        <div className="sheet-card spacer-top help-cta">
          <div>
            <h3>තවත් උදව් අවශ්‍යද?</h3>
            <p className="muted text-sm">අපිට කෙලින්ම contact කරන්න.</p>
          </div>
          <Link to="/contact" className="btn btn-accent">Contact Us</Link>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
