// Using global fetch (Node 18+)

async function register(emailSuffix) {
  const email = `node_test+${emailSuffix}@example.com`;
  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `NodeTest ${emailSuffix}`, email, password: 'password123', role: 'artist' }),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

async function login(email) {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  });
  const body = await res.json().catch(() => null);
  return { status: res.status, body };
}

(async () => {
  try {
    for (let i = 0; i < 3; i++) {
      const em = `node_test+${i}@example.com`;
      console.log('--- REGISTER', em);
      const r = await register(i);
      console.log('status', r.status, 'body', JSON.stringify(r.body));
      console.log('--- LOGIN', em);
      const l = await login(em);
      console.log('status', l.status, 'body', JSON.stringify(l.body));
    }
  } catch (e) {
    console.error('ERROR', e);
  }
})();
