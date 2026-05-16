'use client';

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api from '@/lib/api';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const adminHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` } });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', adminHeaders());
      setUsers(data.users);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return;
    try {
      await api.delete(`/admin/users/${id}`, adminHeaders());
      fetchUsers();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-light text-white">Users</h1>
        <p className="text-white/30 text-sm">{users.length} users</p>
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                  <th className="text-left p-4 font-normal">Name</th>
                  <th className="text-left p-4 font-normal">Email</th>
                  <th className="text-left p-4 font-normal">Phone</th>
                  <th className="text-left p-4 font-normal">Role</th>
                  <th className="text-left p-4 font-normal">Orders</th>
                  <th className="text-left p-4 font-normal">Joined</th>
                  <th className="text-right p-4 font-normal">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 text-white/80">{user.name}</td>
                    <td className="p-4 text-white/40">{user.email}</td>
                    <td className="p-4 text-white/40">{user.phone || '—'}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-white/60 capitalize">{user.role}</span>
                    </td>
                    <td className="p-4 text-white/60">{user._count?.orders || 0}</td>
                    <td className="p-4 text-white/40 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => handleDelete(user.id)} className="p-2 text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
