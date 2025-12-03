import { Building2, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-civic-navy text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Building2 className="h-6 w-6 text-civic-teal" />
              </div>
              <div>
                <span className="font-display text-xl font-bold">CivicReport</span>
                <p className="text-xs text-white/60">Issue Reporting System</p>
              </div>
            </div>
            <p className="text-sm text-white/70 max-w-md">
              Empowering citizens to report civic issues and collaborate with local authorities 
              for faster resolution. Together, we build better communities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-civic-teal-light">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/report" className="text-white/70 hover:text-white transition-colors">
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-white/70 hover:text-white transition-colors">
                  View Dashboard
                </Link>
              </li>
              <li>
                <Link to="/track" className="text-white/70 hover:text-white transition-colors">
                  Track Complaint
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-white/70 hover:text-white transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-civic-teal-light">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-white/70">
                <Phone className="h-4 w-4" />
                <span>1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-2 text-white/70">
                <Mail className="h-4 w-4" />
                <span>support@civicreport.gov</span>
              </li>
              <li className="flex items-start gap-2 text-white/70">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>Municipal Corporation Office<br />City Center</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} CivicReport. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-white/50">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="#" className="hover:text-white transition-colors">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
