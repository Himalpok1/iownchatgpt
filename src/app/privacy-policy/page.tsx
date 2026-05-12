import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for iownchatgpt.com - how we collect, use, and protect your information.",
  alternates: { canonical: "https://iownchatgpt.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <nav className="breadcrumb-nav">
        <div className="container flex items-center gap-[var(--space-8)]">
          <Link href="/">Home</Link>
          <span className="text-[var(--color-gray-400)]">&rsaquo;</span>
          <span className="text-[var(--color-gray-300)]">Privacy Policy</span>
        </div>
      </nav>

      <section className="content-section">
        <div className="container">
          <h1 className="text-3xl sm:text-4xl md:text-[48px] text-center mb-[var(--space-16)] gradient-text-section" style={{ fontWeight: "var(--font-weight-bold)" }}>
            Privacy Policy
          </h1>
          <p className="text-center text-[var(--font-size-xl)] text-[var(--color-gray-300)] mb-[var(--space-32)]">
            Last Updated: February 18, 2026
          </p>

          <div className="max-w-[800px] mx-auto space-y-6">
            <div className="content-block">
              <h2>1. Introduction</h2>
              <p>Welcome to iownchatgpt (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <a href="https://iownchatgpt.com">iownchatgpt.com</a> and use our browser-based arcade games and guides.</p>
            </div>

            <div className="content-block">
              <h2>2. Information We Collect</h2>
              <h3>2.1 Information You Provide</h3>
              <p>We collect information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Submit a game request through our forms</li>
                <li>Contact us via our contact form</li>
                <li>Subscribe to our communications</li>
              </ul>
              <p>This information may include: name, email address, and any other information you choose to provide.</p>
              <h3>2.2 Automatically Collected Information</h3>
              <p>When you visit our website, we may automatically collect certain information about your device, including:</p>
              <ul>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Pages visited and time spent on pages</li>
                <li>Referral source</li>
              </ul>
            </div>

            <div className="content-block">
              <h2>3. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Respond to your inquiries and fulfill your requests</li>
                <li>Process game requests and suggestions</li>
                <li>Improve our website and gaming experience</li>
                <li>Send you updates about new games (if you&apos;ve subscribed)</li>
                <li>Analyze website usage and trends</li>
                <li>Protect against fraudulent or illegal activity</li>
              </ul>
            </div>

            <div className="content-block">
              <h2>4. Cookies and Tracking Technologies</h2>
              <p>We may use cookies and similar tracking technologies to enhance your experience on our website. Cookies are small data files stored on your device. You can control cookies through your browser settings.</p>
              <p>Types of cookies we may use:</p>
              <ul>
                <li><strong>Essential Cookies:</strong> Necessary for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
            </div>

            <div className="content-block">
              <h2>5. Third-Party Services</h2>
              <p>We may use third-party services to help us operate our website and provide our services. These third parties may have access to your information only to perform specific tasks on our behalf.</p>
              <ul>
                <li>Form submission services</li>
                <li>Analytics providers</li>
                <li>Hosting services</li>
              </ul>
            </div>

            <div className="content-block">
              <h2>6. Data Security</h2>
              <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.</p>
            </div>

            <div className="content-block">
              <h2>7. Your Rights and Choices</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from our communications at any time</li>
              </ul>
              <p>To exercise these rights, please contact us at <a href="mailto:mailme@himal.info.np">mailme@himal.info.np</a>.</p>
            </div>

            <div className="content-block">
              <h2>8. Children&apos;s Privacy</h2>
              <p>Our website is intended for general audiences and is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.</p>
            </div>

            <div className="content-block">
              <h2>9. Changes to This Privacy Policy</h2>
              <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &ldquo;Last Updated&rdquo; date.</p>
            </div>

            <div className="content-block">
              <h2>10. Contact Us</h2>
              <p>If you have any questions regarding this Privacy Policy, please contact us at:</p>
              <p>
                <strong>Email:</strong> <a href="mailto:mailme@himal.info.np">mailme@himal.info.np</a><br />
                <strong>Website:</strong> <a href="https://iownchatgpt.com">iownchatgpt.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
