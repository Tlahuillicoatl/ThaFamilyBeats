import { Link } from "wouter";
import { SiInstagram } from "react-icons/si";
import wordmarkPath from "@assets/thafamilybeats-wordmark.png";

export default function Footer() {
  return (
    <footer className="brand-footer border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src={wordmarkPath} alt="ThaFamily Beats" className="w-60 h-24 object-cover object-center" />
            <p className="text-sm text-muted-foreground">
              Professional recording studio delivering premium sound quality and exceptional service.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/studio-booking" className="hover:text-foreground transition-colors" data-testid="footer-link-studio">Studio Booking</Link></li>
              <li><Link href="/partner-studios" className="hover:text-foreground transition-colors" data-testid="footer-link-partner-studios">Hollywood Partner Studios</Link></li>
              <li><Link href="/thafamilymixes" className="hover:text-foreground transition-colors" data-testid="footer-link-mixing">Mix References</Link></li>
              <li><Link href="/sync-licensing" className="hover:text-foreground transition-colors" data-testid="footer-link-licensing">Sync Licensing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors" data-testid="footer-link-about">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors" data-testid="footer-link-contact">Contact</Link></li>
              <li><Link href="/admin/login" className="hover:text-foreground transition-colors" data-testid="footer-link-admin">Admin</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/thafamilybeatstudios/" target="_blank" rel="noopener noreferrer" className="brand-social" data-testid="link-instagram">
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ThaFamilyBeats. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
