import { Link } from "wouter";
import { SiInstagram, SiYoutube } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold">ThaFamilyBeats</h3>
            <p className="text-sm text-muted-foreground">
              Professional recording studio delivering premium sound quality and exceptional service.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/studio-booking" className="hover:text-foreground transition-colors" data-testid="footer-link-studio">Studio Booking</Link></li>
              <li><Link href="/thafamilymixes" className="hover:text-foreground transition-colors" data-testid="footer-link-mixing">ThaFamilyMixes</Link></li>
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
              <a href="https://www.instagram.com/thafamilybeats/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-instagram">
                <SiInstagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@thafamilybeats" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-youtube">
                <SiYoutube className="h-5 w-5" />
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
