import React, { useEffect, useState } from 'react';
import { fetchApi } from '../lib/api';
import { Users, Droplet, Package, ShoppingCart, Edit, Trash2, UserPlus, Shield, Mail, User } from 'lucide-react';

/* ─── UNCHANGED LOGIC ─────────────────────────────────────────────────────── */

export default function AdminDashboard({ user }: { user?: any }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('today');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', roleName: 'Supervisor' });
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchApi(`/stats?range=${timeRange}`).then(setStats).catch(console.error);
  }, [timeRange]);

  useEffect(() => {
    if (user?.role === 'Admin') {
      fetchApi('/users').then(setUsers).catch(console.error);
    }
  }, [user]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await fetchApi(`/users/${editingUser.id}`, { method: 'PUT', body: JSON.stringify(newUser) });
        alert('User updated successfully');
      } else {
        await fetchApi('/users', { method: 'POST', body: JSON.stringify(newUser) });
        alert('User added successfully');
      }
      fetchApi('/users').then(setUsers);
      setNewUser({ name: '', email: '', password: '', roleName: 'Supervisor' });
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await fetchApi(`/users/${id}`, { method: 'DELETE' });
      fetchApi('/users').then(setUsers);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (u: any) => {
    setEditingUser(u);
    setNewUser({ name: u.name, email: u.email, password: '', roleName: u.role });
  };

  if (!stats) return (
    <div style={styles.loadingWrap}>
      <MilkBottleIllustration />
      <span style={styles.loadingText}>Loading dashboard…</span>
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div style={styles.root}>
        {/* Atmospheric background blobs */}
        <div style={styles.blobTopRight} />
        <div style={styles.blobBottomLeft} />
        <div style={styles.blobMidCenter} />

        {/* ── Header ── */}
        <div style={styles.header} className="fade-in">
          <div style={styles.headerLeft}>
            <div style={styles.logoMark}><CowIllustration /></div>
            <div>
              <p style={styles.headerEyebrow}>🥛 DAIRY MANAGEMENT SYSTEM</p>
              <h1 style={styles.headerTitle}>Dashboard Overview</h1>
            </div>
          </div>
          <div style={styles.headerControls}>
            {activeTab === 'overview' && (
              <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={styles.glassSelect}>
                <option value="today">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="yearly">This Year</option>
                <option value="all">All Time</option>
              </select>
            )}
            {user?.role === 'Admin' && (
              <div style={styles.tabGroup}>
                {['overview', 'users'].map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ ...styles.tabBtn, ...(activeTab === tab ? styles.tabBtnActive : {}) }}>
                    {tab === 'overview' ? '📊 Overview' : '👥 Manage Users'}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <>
            <div style={styles.statsGrid}>
              <StatCard title="Milk Collected" value={`${stats.totalMilkCollected} L`} icon={<Droplet size={22}/>} accent="#22d3ee" gradient="linear-gradient(135deg,#164e6380,#0e7490)" illustration={<DropletIllustration/>} delay="0s"/>
              <StatCard title="Total Production" value={`${stats.totalProduction} Units`} icon={<Package size={22}/>} accent="#86efac" gradient="linear-gradient(135deg,#14532d80,#166534)" illustration={<BoxIllustration/>} delay="0.08s"/>
              <StatCard title="Total Sales" value={`₹${stats.totalSales}`} icon={<ShoppingCart size={22}/>} accent="#fbbf24" gradient="linear-gradient(135deg,#78350f80,#92400e)" illustration={<CoinIllustration/>} delay="0.16s"/>
              {user?.role === 'Admin' && (
                <StatCard title="Active Users" value={users.length.toString()} icon={<Users size={22}/>} accent="#f9a8d4" gradient="linear-gradient(135deg,#83184380,#9d174d)" illustration={<PeopleIllustration/>} delay="0.24s"/>
              )}
            </div>

            {/* Dairy scene banner */}
            <div style={styles.illustrationBanner} className="fade-in-up">
              <DairySceneBanner/>
              <div style={styles.bannerText}>
                <p style={styles.bannerSubtitle}>Freshness, tracked daily</p>
                <p style={styles.bannerCaption}>Every litre collected, every unit produced — all in one place.</p>
              </div>
            </div>

            {/* Inventory Table */}
            <div style={styles.card} className="fade-in-up">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.cardHeaderIcon, background: '#22d3ee20', color: '#22d3ee' }}><Package size={18}/></div>
                <h2 style={styles.cardTitle}>Current Inventory</h2>
                <span style={styles.liveChip}><span style={styles.liveDot}/>LIVE</span>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr><Th>Product</Th><Th>Quantity Available</Th></tr>
                  </thead>
                  <tbody>
                    {stats.inventory.map((item: any) => (
                      <tr key={item.id} className="trow">
                        <Td>
                          <div style={styles.productCell}>
                            <span style={styles.productDot}/>
                            <span style={styles.productName}>{item.productName}</span>
                          </div>
                        </Td>
                        <Td>
                          <div style={styles.quantityCell}>
                            <div style={{ ...styles.quantityBar, width: `${Math.min(item.quantity, 200) / 2}%`, background: item.quantity < 50 ? 'linear-gradient(90deg,#f87171,#ef4444)' : 'linear-gradient(90deg,#4ade80,#22c55e)' }}/>
                            <span style={{ ...styles.badge, background: item.quantity < 50 ? '#ef444420' : '#22c55e20', color: item.quantity < 50 ? '#f87171' : '#4ade80', border: `1px solid ${item.quantity < 50 ? '#ef444440' : '#22c55e40'}` }}>
                              {item.quantity} units
                            </span>
                          </div>
                        </Td>
                      </tr>
                    ))}
                    {stats.inventory.length === 0 && (
                      <tr><td colSpan={2} style={styles.emptyCell}><EmptyIllustration/>No inventory records found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && user?.role === 'Admin' && (
          <div style={styles.usersGrid}>
            <div style={{ ...styles.card, ...styles.formCard }} className="fade-in-up">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.cardHeaderIcon, background: '#fbbf2420', color: '#fbbf24' }}><UserPlus size={18}/></div>
                <h2 style={styles.cardTitle}>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              </div>
              <div style={styles.formIllustrationWrap}><TeamIllustration/></div>
              <form onSubmit={handleAddUser} style={styles.form}>
                <Field label="Full Name" icon={<User size={15}/>}>
                  <input type="text" placeholder="John Doe" required style={styles.input} value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}/>
                </Field>
                <Field label="Email Address" icon={<Mail size={15}/>}>
                  <input type="email" placeholder="john@example.com" required style={styles.input} value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}/>
                </Field>
                {!editingUser && (
                  <Field label="Password" icon={null}>
                    <input type="password" placeholder="••••••••" required style={styles.input} value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })}/>
                  </Field>
                )}
                <Field label="Role" icon={<Shield size={15}/>}>
                  <select style={styles.input} value={newUser.roleName} onChange={e => setNewUser({ ...newUser, roleName: e.target.value })}>
                    <option>Supervisor</option>
                    <option>Counter Staff</option>
                    <option>Dairy Production Worker</option>
                    <option>Delivery Worker</option>
                    <option>Admin</option>
                  </select>
                </Field>
                <div style={styles.formActions}>
                  <button type="submit" style={styles.btnPrimary} className="btn-hover">{editingUser ? 'Update User' : 'Add User'}</button>
                  {editingUser && (
                    <button type="button" style={styles.btnSecondary} className="btn-hover"
                      onClick={() => { setEditingUser(null); setNewUser({ name: '', email: '', password: '', roleName: 'Supervisor' }); }}>
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div style={styles.card} className="fade-in-up">
              <div style={styles.cardHeader}>
                <div style={{ ...styles.cardHeaderIcon, background: '#22d3ee20', color: '#22d3ee' }}><Users size={18}/></div>
                <h2 style={styles.cardTitle}>User Directory</h2>
                <span style={styles.userCount}>{users.length} members</span>
              </div>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr><Th>Name</Th><Th>Email</Th><Th>Role</Th><Th align="right">Actions</Th></tr>
                  </thead>
                  <tbody>
                    {users.map((u: any) => (
                      <tr key={u.id} className="trow">
                        <Td>
                          <div style={styles.userCell}>
                            <div style={{ ...styles.avatar, background: stringToGradient(u.name) }}>{u.name.charAt(0).toUpperCase()}</div>
                            <span style={styles.userName}>{u.name}</span>
                          </div>
                        </Td>
                        <Td><span style={styles.emailText}>{u.email}</span></Td>
                        <Td><span style={{ ...styles.badge, ...roleBadge(u.role) }}>{u.role}</span></Td>
                        <Td align="right">
                          <div style={styles.actionBtns}>
                            <button onClick={() => startEdit(u)} style={styles.iconBtnEdit} className="btn-hover" title="Edit"><Edit size={15}/></button>
                            <button onClick={() => handleDeleteUser(u.id)} style={styles.iconBtnDelete} className="btn-hover" title="Delete"><Trash2 size={15}/></button>
                          </div>
                        </Td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={4} style={styles.emptyCell}><EmptyIllustration/>No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div style={styles.footer}>🐄 &nbsp;Dairy Management System &nbsp;·&nbsp; All data is real-time</div>
      </div>
    </>
  );
}

/* ─── SUB-COMPONENTS ──────────────────────────────────────────────────────── */

function StatCard({ title, value, icon, accent, gradient, illustration, delay }: {
  title: string; value: string; icon: React.ReactNode;
  accent: string; gradient: string; illustration: React.ReactNode; delay: string;
}) {
  return (
    <div style={{ ...styles.statCard, background: gradient, borderColor: accent + '40', animationDelay: delay }} className="stat-card fade-in-up">
      <div style={styles.statIllustration}>{illustration}</div>
      <div style={{ ...styles.statIcon, color: accent, background: accent + '22', boxShadow: `0 0 24px ${accent}50` }}>{icon}</div>
      <div style={styles.statBody}>
        <p style={{ ...styles.statLabel, color: accent }}>{title.toUpperCase()}</p>
        <p style={styles.statValue}>{value}</p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={styles.fieldWrap}>
      <label style={styles.fieldLabel}>{label}</label>
      <div style={styles.fieldInner}>
        {icon && <span style={styles.fieldIcon}>{icon}</span>}
        {children}
      </div>
    </div>
  );
}

function Th({ children, align = 'left' }: { children?: React.ReactNode; align?: string }) {
  return <th style={{ ...styles.th, textAlign: align as any }}>{children}</th>;
}
function Td({ children, align = 'left' }: { children?: React.ReactNode; align?: string }) {
  return <td style={{ ...styles.td, textAlign: align as any }}>{children}</td>;
}

/* ─── SVG ILLUSTRATIONS ───────────────────────────────────────────────────── */

function CowIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="26" cy="32" rx="16" ry="12" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      <ellipse cx="18" cy="24" rx="7" ry="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      <ellipse cx="34" cy="24" rx="7" ry="8" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5"/>
      <ellipse cx="15" cy="16" rx="3" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <ellipse cx="33" cy="16" rx="3" ry="4" fill="#fbbf24" stroke="#d97706" strokeWidth="1"/>
      <ellipse cx="16" cy="20" rx="1" ry="1.2" fill="#1c1917"/>
      <ellipse cx="32" cy="20" rx="1" ry="1.2" fill="#1c1917"/>
      <path d="M22 27 Q26 30 30 27" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      <rect x="18" y="42" width="3" height="6" rx="1.5" fill="#92400e"/>
      <rect x="25" y="42" width="3" height="6" rx="1.5" fill="#92400e"/>
      <ellipse cx="30" cy="32" rx="4" ry="3" fill="#d97706" opacity="0.3"/>
      <ellipse cx="20" cy="35" rx="3" ry="2" fill="#d97706" opacity="0.3"/>
    </svg>
  );
}

function DropletIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <path d="M26 6 C26 6 11 24 11 33 A15 15 0 0 0 41 33 C41 24 26 6 26 6Z" fill="#bae6fd" opacity="0.45"/>
      <path d="M26 14 C26 14 15 27 15 33 A11 11 0 0 0 37 33 C37 27 26 14 26 14Z" fill="#38bdf8" opacity="0.65"/>
      <ellipse cx="21" cy="31" rx="3.5" ry="5" fill="white" opacity="0.35"/>
    </svg>
  );
}

function BoxIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <rect x="9" y="22" width="34" height="23" rx="3" fill="#86efac" opacity="0.45"/>
      <rect x="9" y="22" width="34" height="8" rx="2" fill="#4ade80" opacity="0.65"/>
      <path d="M9 22 L26 15 L43 22" fill="#bbf7d0" opacity="0.7"/>
      <rect x="21" y="22" width="10" height="6" rx="1" fill="#166534" opacity="0.4"/>
      <path d="M7 22 L26 13 L45 22" stroke="#22c55e" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    </svg>
  );
}

function CoinIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <ellipse cx="26" cy="33" rx="15" ry="6" fill="#fbbf24" opacity="0.3"/>
      <circle cx="26" cy="23" r="15" fill="#fde68a" opacity="0.6"/>
      <circle cx="26" cy="23" r="12" fill="#fbbf24" opacity="0.75"/>
      <text x="26" y="29" textAnchor="middle" fill="#92400e" fontSize="13" fontWeight="900">₹</text>
      <ellipse cx="22" cy="19" rx="5" ry="3" fill="white" opacity="0.2"/>
    </svg>
  );
}

function PeopleIllustration() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
      <circle cx="17" cy="19" r="7" fill="#f9a8d4" opacity="0.75"/>
      <circle cx="35" cy="19" r="7" fill="#f472b6" opacity="0.75"/>
      <circle cx="26" cy="16" r="7" fill="#fce7f3" opacity="0.9"/>
      <path d="M7 44 C7 35 11 30 17 30 C21 30 24 32 26 36 C28 32 31 30 35 30 C41 30 45 35 45 44" fill="#f9a8d4" opacity="0.4"/>
    </svg>
  );
}

function DairySceneBanner() {
  return (
    <svg width="230" height="96" viewBox="0 0 230 96" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <circle cx="200" cy="22" r="18" fill="#fde68a" opacity="0.6"/>
      <ellipse cx="45" cy="90" rx="65" ry="32" fill="#86efac" opacity="0.3"/>
      <ellipse cx="155" cy="96" rx="85" ry="38" fill="#4ade80" opacity="0.2"/>
      <rect x="75" y="48" width="42" height="38" fill="#fbbf24" opacity="0.6"/>
      <polygon points="75,48 96,26 117,48" fill="#f87171" opacity="0.7"/>
      <rect x="87" y="64" width="17" height="22" rx="2" fill="#92400e" opacity="0.55"/>
      <rect x="158" y="52" width="15" height="26" rx="4" fill="white" opacity="0.8"/>
      <rect x="158" y="46" width="15" height="11" rx="3" fill="#e0f2fe" opacity="0.85"/>
      <rect x="161" y="48" width="9" height="5" rx="1" fill="#7dd3fc" opacity="0.7"/>
      <ellipse cx="32" cy="77" rx="13" ry="9" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
      <ellipse cx="24" cy="70" rx="6" ry="7" fill="#fef3c7" stroke="#d97706" strokeWidth="1"/>
      <circle cx="22" cy="67" r="1.5" fill="#1c1917"/>
      <ellipse cx="64" cy="17" rx="22" ry="10" fill="white" opacity="0.35"/>
      <ellipse cx="80" cy="14" rx="16" ry="9" fill="white" opacity="0.35"/>
    </svg>
  );
}

function TeamIllustration() {
  return (
    <svg width="100%" height="82" viewBox="0 0 290 82" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[42,94,146,198,250].map((x, i) => (
        <g key={i}>
          <circle cx={x} cy="29" r="15" fill={['#fde68a','#bbf7d0','#bae6fd','#fce7f3','#ddd6fe'][i]} opacity="0.7"/>
          <text x={x} y="35" textAnchor="middle" fontSize="15">{['👩‍🌾','👨‍🏭','👩‍💼','🧑‍🚚','🛡️'][i]}</text>
          <rect x={x-17} y="48" width="34" height="26" rx="7" fill={['#fde68a','#bbf7d0','#bae6fd','#fce7f3','#ddd6fe'][i]} opacity="0.4"/>
        </g>
      ))}
    </svg>
  );
}

function MilkBottleIllustration() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      <rect x="16" y="20" width="24" height="30" rx="7" fill="#e0f2fe" opacity="0.9"/>
      <rect x="16" y="12" width="24" height="13" rx="5" fill="#bae6fd" opacity="0.9"/>
      <rect x="20" y="14" width="16" height="6" rx="2" fill="#7dd3fc" opacity="0.8"/>
      <ellipse cx="28" cy="37" rx="7" ry="4" fill="white" opacity="0.4"/>
      <path d="M21 42 Q28 47 35 42" stroke="#38bdf8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function EmptyIllustration() {
  return (
    <div style={{ display:'flex', justifyContent:'center', marginBottom:'0.5rem' }}>
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="30" fill="#0d1f1a" stroke="#1e3a2f" strokeWidth="1.5"/>
        <path d="M21 42 Q32 30 43 42" stroke="#334155" strokeWidth="2" strokeLinecap="round" fill="none"/>
        <circle cx="23" cy="27" r="3.5" fill="#334155"/>
        <circle cx="41" cy="27" r="3.5" fill="#334155"/>
      </svg>
    </div>
  );
}

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */

function stringToGradient(str: string) {
  const g = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#14b8a6,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#22c55e,#16a34a)',
  ];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
  return g[Math.abs(h) % g.length];
}

function roleBadge(role: string) {
  const map: Record<string, any> = {
    Admin:      { background: '#fbbf2420', color: '#fbbf24', border: '1px solid #fbbf2440' },
    Supervisor: { background: '#22d3ee20', color: '#22d3ee', border: '1px solid #22d3ee40' },
  };
  return map[role] ?? { background: '#94a3b820', color: '#cbd5e1', border: '1px solid #94a3b840' };
}

/* ─── STYLES ──────────────────────────────────────────────────────────────── */

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #0d1f1a 0%, #0f2a1e 30%, #111827 60%, #1a1207 100%)',
    padding: '2rem',
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    color: '#e7f0ec',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    position: 'relative',
    overflow: 'hidden',
  },
  blobTopRight: {
    position: 'fixed', top: '-120px', right: '-100px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, #22d3ee18 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blobBottomLeft: {
    position: 'fixed', bottom: '-150px', left: '-100px',
    width: '500px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(circle, #86efac12 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  blobMidCenter: {
    position: 'fixed', top: '40%', left: '40%',
    width: '400px', height: '400px', borderRadius: '50%',
    background: 'radial-gradient(circle, #fbbf2408 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
    justifyContent: 'center', height: '100vh',
    background: '#0d1f1a', color: '#6ee7b7',
    fontFamily: "'Nunito', sans-serif",
  },
  loadingText: { fontSize: '0.9rem', letterSpacing: '0.1em', color: '#6ee7b7' },

  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '1rem' },
  logoMark: {
    width: 64, height: 64, borderRadius: '1.1rem',
    background: 'linear-gradient(135deg,#fde68a28,#fbbf2418)',
    border: '1px solid #fbbf2435',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 28px #fbbf2418',
  },
  headerEyebrow: {
    fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em',
    color: '#6ee7b7', marginBottom: '0.3rem', margin: 0,
  },
  headerTitle: {
    fontSize: '2rem', fontWeight: 900,
    background: 'linear-gradient(90deg,#ecfdf5,#6ee7b7,#fbbf24)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    margin: 0, lineHeight: 1.1,
  },
  headerControls: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' },
  glassSelect: {
    background: 'rgba(13,31,26,0.85)', border: '1px solid #22d3ee35',
    color: '#e7f0ec', padding: '0.5rem 1rem',
    borderRadius: '0.7rem', fontSize: '0.85rem', fontWeight: 700,
    cursor: 'pointer', outline: 'none', backdropFilter: 'blur(8px)',
  },
  tabGroup: {
    display: 'flex', background: 'rgba(13,31,26,0.75)',
    border: '1px solid #22d3ee28', borderRadius: '0.85rem', padding: '0.3rem',
    backdropFilter: 'blur(8px)',
  },
  tabBtn: {
    padding: '0.45rem 1.2rem', borderRadius: '0.6rem',
    fontSize: '0.82rem', fontWeight: 700,
    background: 'transparent', border: 'none',
    color: '#64748b', cursor: 'pointer', transition: 'all 0.2s',
  },
  tabBtnActive: {
    background: 'linear-gradient(135deg,#064e3b,#065f46)',
    color: '#6ee7b7', boxShadow: '0 0 14px #22d3ee28',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '1.25rem',
  },
  statCard: {
    position: 'relative', overflow: 'hidden',
    borderRadius: '1.2rem', border: '1px solid',
    padding: '1.4rem 1.2rem',
    display: 'flex', alignItems: 'center', gap: '1rem',
    backdropFilter: 'blur(12px)',
    transition: 'transform 0.25s, box-shadow 0.25s',
  },
  statIllustration: {
    position: 'absolute', right: 6, top: 4, opacity: 0.55,
    pointerEvents: 'none',
  },
  statIcon: {
    width: 50, height: 50, borderRadius: '0.85rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  statBody: { flex: 1, minWidth: 0, position: 'relative', zIndex: 1 },
  statLabel: {
    fontSize: '0.58rem', fontWeight: 900, letterSpacing: '0.15em', marginBottom: '0.4rem',
    display: 'block',
  },
  statValue: {
    fontSize: '1.85rem', fontWeight: 900, color: '#f0fdf4', lineHeight: 1,
  },

  illustrationBanner: {
    background: 'linear-gradient(135deg, rgba(6,78,59,0.55), rgba(20,83,45,0.35))',
    border: '1px solid #22d3ee22',
    borderRadius: '1.2rem',
    padding: '1.25rem 1.75rem',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    backdropFilter: 'blur(10px)',
    overflow: 'hidden', position: 'relative',
  },
  bannerText: { flex: 1 },
  bannerSubtitle: {
    fontSize: '1.1rem', fontWeight: 800, color: '#6ee7b7', margin: '0 0 0.3rem',
  },
  bannerCaption: {
    fontSize: '0.82rem', color: '#94a3b8', margin: 0,
  },

  card: {
    background: 'rgba(13,31,26,0.72)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(34,211,238,0.13)',
    borderRadius: '1.2rem',
    overflow: 'hidden',
    boxShadow: '0 4px 32px rgba(0,0,0,0.28)',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '1.25rem 1.5rem',
    borderBottom: '1px solid rgba(34,211,238,0.09)',
  },
  cardHeaderIcon: {
    width: 36, height: 36, borderRadius: '0.6rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '0.95rem', fontWeight: 800, color: '#ecfdf5', margin: 0, flex: 1,
  },
  liveChip: {
    display: 'flex', alignItems: 'center', gap: '0.4rem',
    fontSize: '0.63rem', fontWeight: 800, letterSpacing: '0.1em',
    color: '#4ade80', background: '#14532d45',
    border: '1px solid #22c55e38', padding: '0.2rem 0.65rem', borderRadius: '999px',
  },
  liveDot: {
    width: 6, height: 6, borderRadius: '50%', background: '#4ade80',
    display: 'inline-block', boxShadow: '0 0 8px #4ade80',
  },
  userCount: {
    fontSize: '0.75rem', fontWeight: 700, color: '#6ee7b7',
    background: 'rgba(6,78,59,0.55)', padding: '0.25rem 0.75rem',
    borderRadius: '999px', border: '1px solid #22d3ee28',
  },

  tableWrap: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '0.85rem 1.5rem',
    fontSize: '0.63rem', fontWeight: 900, letterSpacing: '0.14em',
    color: '#374151', background: 'rgba(13,31,26,0.95)', textTransform: 'uppercase',
  },
  td: {
    padding: '0.9rem 1.5rem',
    borderTop: '1px solid rgba(34,211,238,0.07)',
    fontSize: '0.875rem', verticalAlign: 'middle',
  },
  productCell: { display: 'flex', alignItems: 'center', gap: '0.65rem' },
  productDot: {
    width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', flexShrink: 0,
    boxShadow: '0 0 8px #22d3ee80', display: 'inline-block',
  },
  productName: { fontWeight: 800, color: '#ecfdf5' },
  quantityCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  quantityBar: {
    height: 5, borderRadius: '999px', minWidth: 4, maxWidth: '80px',
    transition: 'width 0.5s ease',
  },
  badge: {
    padding: '0.22rem 0.7rem', borderRadius: '999px',
    fontSize: '0.72rem', fontWeight: 800, whiteSpace: 'nowrap' as const,
    display: 'inline-block',
  },
  emptyCell: {
    padding: '2.5rem', textAlign: 'center' as const,
    color: '#475569', fontSize: '0.875rem',
  },

  userCell: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  avatar: {
    width: 36, height: 36, borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '0.875rem', fontWeight: 900, color: '#fff', flexShrink: 0,
    boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
  },
  userName: { fontWeight: 800, color: '#ecfdf5' },
  emailText: { color: '#64748b', fontSize: '0.83rem' },

  actionBtns: { display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' },
  iconBtnEdit: {
    width: 34, height: 34, borderRadius: '0.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#22d3ee14', color: '#22d3ee',
    border: '1px solid #22d3ee32', cursor: 'pointer', transition: 'all 0.2s',
  },
  iconBtnDelete: {
    width: 34, height: 34, borderRadius: '0.5rem',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#ef444414', color: '#f87171',
    border: '1px solid #ef444432', cursor: 'pointer', transition: 'all 0.2s',
  },

  usersGrid: {
    display: 'grid', gridTemplateColumns: '340px 1fr',
    gap: '1.5rem', alignItems: 'start',
  },
  formCard: {},
  formIllustrationWrap: {
    padding: '0.5rem 1.5rem 0',
    borderBottom: '1px solid rgba(34,211,238,0.08)',
  },
  form: { padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  fieldWrap: { display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  fieldLabel: {
    fontSize: '0.72rem', fontWeight: 800, color: '#6ee7b7', letterSpacing: '0.07em',
  },
  fieldInner: { position: 'relative' },
  fieldIcon: {
    position: 'absolute', left: '0.75rem', top: '50%',
    transform: 'translateY(-50%)', color: '#475569',
    display: 'flex', pointerEvents: 'none',
  },
  input: {
    width: '100%', background: 'rgba(13,31,26,0.92)',
    border: '1px solid rgba(34,211,238,0.18)', color: '#ecfdf5',
    padding: '0.65rem 0.85rem 0.65rem 2.3rem',
    borderRadius: '0.65rem', fontSize: '0.875rem',
    outline: 'none', boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s, box-shadow 0.2s',
    appearance: 'none' as const, fontFamily: 'inherit', fontWeight: 600,
  },
  formActions: { display: 'flex', gap: '0.75rem', paddingTop: '0.5rem' },
  btnPrimary: {
    flex: 1, padding: '0.7rem 1.25rem',
    background: 'linear-gradient(135deg,#065f46,#0d9488)',
    color: '#ecfdf5', border: '1px solid #22d3ee38',
    borderRadius: '0.65rem', fontSize: '0.875rem',
    fontWeight: 800, cursor: 'pointer',
    letterSpacing: '0.02em', transition: 'opacity 0.2s, transform 0.1s',
    fontFamily: 'inherit', boxShadow: '0 0 18px #22d3ee18',
  },
  btnSecondary: {
    flex: 1, padding: '0.7rem 1.25rem',
    background: 'rgba(30,41,59,0.75)', color: '#94a3b8',
    border: '1px solid #334155',
    borderRadius: '0.65rem', fontSize: '0.875rem',
    fontWeight: 800, cursor: 'pointer',
    transition: 'background 0.2s', fontFamily: 'inherit',
  },

  footer: {
    textAlign: 'center' as const,
    fontSize: '0.72rem', color: '#1e3a2f', letterSpacing: '0.08em',
    padding: '0.5rem 0',
  },
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');

  .stat-card:hover {
    transform: translateY(-5px) scale(1.015);
    box-shadow: 0 24px 50px rgba(0,0,0,0.5);
  }
  .trow:hover td { background: rgba(34,211,238,0.04) !important; }
  .btn-hover:hover { opacity: 0.85; transform: translateY(-1px); }

  .fade-in { animation: fadeIn 0.5s ease both; }
  .fade-in-up { animation: fadeInUp 0.55s ease both; }

  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  input:focus, select:focus {
    border-color: #22d3ee !important;
    box-shadow: 0 0 0 3px #22d3ee16 !important;
  }
  input::placeholder { color: #1e3a2f; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #0d1f1a; }
  ::-webkit-scrollbar-thumb { background: #134e2a; border-radius: 3px; }

  @media (max-width: 900px) {
    [data-usersgrid] { grid-template-columns: 1fr !important; }
  }
`;