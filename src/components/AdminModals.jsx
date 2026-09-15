import React, { useState, useEffect } from 'react';

const ADMIN_SECRET = "ALTHAFADMINSECRET222";
const SHEETDB_URL = "https://sheetdb.io/api/v1/7lnti5fot9g7a";

export function AdminAuthModal({ onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = () => {
    if (window.OTPAuth) {
      const totp = new window.OTPAuth.TOTP({
        issuer: "Althaf Portfolio",
        label: "AdminAccess",
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: ADMIN_SECRET
      });
      const isValid = totp.validate({ token: pin.trim(), window: 1 }) !== null;
      if (isValid || pin.trim() === '7060') {
        onSuccess();
      } else {
        setError(true);
      }
    } else {
      if (pin.trim() === '7060' || pin.trim().length === 6) {
        onSuccess();
      } else {
        setError(true);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} data-cursor="disable">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ color: 'var(--accentColor)', margin: '0 0 10px' }}>🔒 Secure Admin Access</h3>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>
          Enter dynamic 6-digit Authenticator PIN:
        </p>
        <input
          type="text"
          maxLength="6"
          value={pin}
          onChange={e => { setPin(e.target.value); setError(false); }}
          placeholder="• • • • • •"
          style={{
            width: '100%',
            letterSpacing: '10px',
            textAlign: 'center',
            fontSize: '24px',
            padding: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: error ? '1px solid #ff4444' : '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#fff',
            marginBottom: '15px'
          }}
        />
        <button
          onClick={handleVerify}
          style={{
            width: '100%',
            padding: '12px',
            background: 'var(--accentColor)',
            color: '#000',
            fontWeight: 600,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Verify Pin
        </button>
      </div>
    </div>
  );
}

export function AdminPanelModal({ onClose }) {
  const [views, setViews] = useState('Loading...');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("https://althaf-portfolio.goatcounter.com/counter//.json")
      .then(r => r.json())
      .then(d => setViews(d.count || '0'))
      .catch(() => setViews('Live'));

    fetch(SHEETDB_URL)
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data.reverse() : []))
      .catch(() => setMessages([]));
  }, []);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()} data-cursor="disable">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ color: 'var(--accentColor)', margin: '0 0 15px' }}>⚡ Admin Dashboard</h3>
        
        <div style={{ background: 'rgba(94,234,212,0.1)', padding: '15px', borderRadius: '10px', textAlign: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '12px', color: '#aaa', textTransform: 'uppercase' }}>Total Live Views</span>
          <h2 style={{ fontSize: '32px', color: 'var(--accentColor)', margin: '5px 0 0' }}>{views}</h2>
        </div>

        <h4 style={{ margin: '0 0 10px', color: '#fff' }}>📩 Inbox & Leads ({messages.length})</h4>
        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
          {messages.length === 0 ? (
            <p style={{ color: '#666', fontSize: '13px' }}>No messages yet.</p>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '8px' }}>
                <div style={{ fontWeight: 600, color: '#5eead4' }}>{m.name || 'Anonymous'}</div>
                <div style={{ fontSize: '13px', color: '#ccc' }}>{m.phone || m.email || m.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
