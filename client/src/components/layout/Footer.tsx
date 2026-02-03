import Link from 'next/link';
import { Briefcase, Twitter, Linkedin, Github, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                <Briefcase className="text-white" size={20} />
              </div>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">HireUp</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              The world's most advanced job portal, empowering developers and recruiters to connect through technology and trust.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <a key={i} href="#" className="p-2 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">For Talent</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><Link href="/jobs" className="hover:text-blue-600 transition-colors">Browse Vacancies</Link></li>
              <li><Link href="/dashboard/profile" className="hover:text-blue-600 transition-colors">Career Identification</Link></li>
              <li><Link href="/companies" className="hover:text-blue-600 transition-colors">Company Insights</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Salary Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">For Recruiters</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li><Link href="/dashboard/jobs/new" className="hover:text-blue-600 transition-colors">Publish Opportunity</Link></li>
              <li><Link href="/dashboard/companies/new" className="hover:text-blue-600 transition-colors">Brand Registration</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">Talent Sourcing</Link></li>
              <li><Link href="#" className="hover:text-blue-600 transition-colors">API Access</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-widest text-xs">Join our Network</h4>
            <p className="text-sm text-gray-500 mb-4 font-medium">Get the latest tech roles delivered to your inbox weekly.</p>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={18} />
              <input
                type="email"
                placeholder="name@email.com"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-blue-300 outline-none transition-all text-sm font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© 2026 HireUp Platforms LLC. All rights reserved.</p>
          <div className="flex gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-gray-600">Privacy</Link>
            <Link href="#" className="hover:text-gray-600">Terms</Link>
            <Link href="#" className="hover:text-gray-600">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
