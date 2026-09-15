import React, { useState } from 'react';

const SHEETDB_URL = "https://sheetdb.io/api/v1/7lnti5fot9g7a";

export default function ContactModal({ onClose }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    fetch(SHEETDB_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          id: Date.now().toString(),
          name,
          phone,
          date: new Date().toLocaleDateString(),
          status: 'Pending'
        }
      })
    })
      .then(r => r.json())
      .then(() => {
        setSending(false);
        setSent(true);
        setTimeout(onClose, 1800);
      })
      .catch(() => {
        setSending(false);
        alert('Error sending message');
      });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()} data-cursor="disable">
        <button className="modal-close" onClick={onClose}>✕</button>
        <h3 style={{ color: 'var(--accentColor)', margin: '0 0 10px' }}>✉️ Request Contact</h3>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '20px' }}>
          Leave your details and Shaik Althaf will get back to you shortly.
        </p>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#5eead4' }}>
            ✅ Message Sent Successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your Name"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                marginBottom: '12px'
              }}
            />
            <input
              type="tel"
              required
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="Phone Number / Email"
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                color: '#fff',
                marginBottom: '20px'
              }}
            />
            <button
              type="submit"
              disabled={sending}
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
              {sending ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
