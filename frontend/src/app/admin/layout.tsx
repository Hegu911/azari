'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  Tag, Briefcase, Percent, Star, MessageCircle, LogOut, Menu, X, ChevronDown 
} from 'lucide-react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Mesajlar', href: '/admin/messages', icon: MessageCircle },
  { label: 'Məhsullar', href: '/admin/products', icon: Package },
  { label: 'Sifarişlər', href: '/admin/orders', icon: ShoppingCart },
  { label: 'İstifadəçilər', href: '/admin/users', icon: Users },
  { label: 'Kateqoriyalar', href: '/admin/categories', icon: Tag },
  { label: 'Brendlər', href: '/admin/brands', icon: Briefcase },
  { label: 'Kuponlar', href: '/admin/coupons', icon: Percent },
  { label: 'Rəylər', href: '/admin/reviews', icon: Star },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const t = localStorage.getItem('admin_token');
    const a = localStorage.getItem('admin');
    if (t && a) { setToken(t); setAdmin(JSON.parse(a)); }
    else if (!pathname.includes('/admin/login')) { router.push('/admin/login'); }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    router.push('/admin/login');
  };

  if (pathname?.includes('/admin/login')) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-[#050505] border-r border-white/5 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="text-white">
              <img src="/logo.png" alt="Azari Parfumes" className="h-8 w-auto" />
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white cursor-pointer"><X size={18} /></button>
          </div>
          <p className="text-xs text-white/30 mt-1">Admin Panel</p>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href));
            return (
              <Link key={link.href} href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive ? 'bg-[#d4af37]/10 text-[#d4af37]' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          {admin && (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/80">{admin.name}</p>
                <p className="text-xs text-white/30">{admin.email}</p>
              </div>
              <button onClick={logout} className="text-white/30 hover:text-red-400 transition-colors cursor-pointer p-2">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 px-6 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/40 hover:text-white cursor-pointer">
            <Menu size={20} />
          </button>
          <div className="text-sm text-white/30">{sidebarLinks.find(l => l.href === pathname || (l.href !== '/admin' && pathname.startsWith(l.href)))?.label || 'Dashboard'}</div>
          <Link href="/" className="text-xs text-white/20 hover:text-white/60 transition-colors">View Site →</Link>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
