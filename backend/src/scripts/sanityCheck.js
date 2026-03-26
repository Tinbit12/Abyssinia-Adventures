/**
 * Sanity check: verifies API is reachable and a booking flow works.
 * Run after backend is up: node src/scripts/sanityCheck.js
 * Requires: API_BASE_URL (default http://localhost:5000) or run with backend on 5000.
 */

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5000';

async function request(method, path, body = null, token = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (token) opts.headers.Authorization = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function run() {
  console.log('Sanity check – API base:', API_BASE);
  let passed = 0;
  let failed = 0;

  const { ok: healthOk } = await request('GET', '/api/health');
  if (healthOk) {
    console.log('  ✓ Health check');
    passed++;
  } else {
    console.log('  ✗ Health check failed');
    failed++;
    console.log('  Ensure backend is running: npm run dev (in backend/)');
    process.exit(1);
  }

  const { ok: destOk, data: destinations } = await request('GET', '/api/destinations');
  if (destOk && Array.isArray(destinations) && destinations.length > 0) {
    console.log('  ✓ Destinations loaded:', destinations.length);
    passed++;
  } else {
    console.log('  ✗ Destinations empty or failed');
    failed++;
  }

  const { ok: pkgOk, data: packages } = await request('GET', '/api/packages');
  if (pkgOk && Array.isArray(packages) && packages.length > 0) {
    console.log('  ✓ Packages loaded:', packages.length);
    passed++;
  } else {
    console.log('  ✗ Packages empty or failed');
    failed++;
  }

  const { ok: loginOk, data: loginData } = await request('POST', '/api/auth/login', {
    email: 'user@test.com',
    password: 'TestUser123!',
  });
  if (!loginOk || !loginData?.token) {
    console.log('  ✗ Login failed (use test user: user@test.com / TestUser123!)');
    failed++;
  } else {
    console.log('  ✓ Login as test user');
    passed++;
    const token = loginData.token;
    const tomorrow = new Date();
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
    tomorrow.setUTCHours(0, 0, 0, 0);
    const destId = destinations?.[0]?._id;
    if (destId) {
      const { ok: bookOk, data: bookData, status } = await request(
        'POST',
        '/api/bookings',
        {
          itemType: 'destination',
          itemId: destId,
          date: tomorrow.toISOString(),
          numberOfPeople: 2,
          note: 'Sanity check booking',
        },
        token
      );
      if (bookOk && bookData?._id) {
        console.log('  ✓ Create booking');
        passed++;
        const { ok: delOk } = await request('DELETE', `/api/bookings/${bookData._id}`, null, token);
        if (delOk) {
          console.log('  ✓ Delete booking');
          passed++;
        } else {
          console.log('  ✗ Delete booking failed');
          failed++;
        }
      } else {
        console.log('  ✗ Create booking failed:', bookData?.error || status);
        failed++;
      }
    }
  }

  console.log('');
  console.log('Result:', passed, 'passed', failed > 0 ? `, ${failed} failed` : '');
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Sanity check error:', err);
  process.exit(1);
});
