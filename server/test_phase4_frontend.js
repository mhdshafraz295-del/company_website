import http from 'http';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const status = res.status;
  let json = {};
  try {
    json = await res.json();
  } catch (e) {
    // non-json
  }
  return { status, json };
}

async function runPhase4Tests() {
  console.log(`🧪 Starting Phase 4 Backend Integration & Security Checks on Port ${PORT}...\n`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // 1. Health Endpoint Check
    console.log('1. Testing GET /api/health...');
    const health = await request('/health');
    if (health.status === 200 && health.json.success === true) {
      console.log('   ✅ Health endpoint returned 200 OK');
    } else {
      throw new Error(`Health check failed: ${JSON.stringify(health.json)}`);
    }

    // 2. Authentication Login for Phase 4 Frontend
    console.log('\n2. Testing Admin Login for Phase 4 AuthContext...');
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@nexgen.local', password: adminPassword },
    });

    if (loginRes.status === 200 && loginRes.json.data?.token) {
      const { token, admin } = loginRes.json.data;
      if (admin.passwordHash !== undefined) {
        throw new Error('SECURITY VIOLATION: passwordHash exposed in response!');
      }
      console.log(`   ✅ Admin login returned valid JWT token (${token.substring(0, 15)}...)`);
      console.log(`   ✅ Admin user info: ${admin.name} (${admin.role})`);

      // 3. Session Restoration Test (/api/auth/me)
      console.log('\n3. Testing Session Restoration via GET /api/auth/me...');
      const meRes = await request('/auth/me', { token });
      if (meRes.status === 200 && meRes.json.data?.admin?.email === 'admin@nexgen.local') {
        console.log('   ✅ Session restoration endpoint /api/auth/me verified successfully');
      } else {
        throw new Error(`/auth/me failed: ${JSON.stringify(meRes.json)}`);
      }
    } else {
      throw new Error(`Login failed: ${JSON.stringify(loginRes.json)}`);
    }

    // 4. Invalid Password Test
    console.log('\n4. Testing Invalid Password Login...');
    const invalidLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@nexgen.local', password: 'wrongpassword' },
    });
    if (invalidLogin.status === 401 && invalidLogin.json.success === false) {
      console.log('   ✅ Invalid password rejected with 401 and readable error');
    } else {
      throw new Error(`Invalid login should return 401, got ${invalidLogin.status}`);
    }

    // 5. Protected Route Enforcement
    console.log('\n5. Testing Protected Route Guard Enforcement...');
    const unauthReq = await request('/services/admin/all');
    if (unauthReq.status === 401) {
      console.log('   ✅ Unauthenticated request to /services/admin/all correctly rejected with 401');
    } else {
      throw new Error(`Unauthenticated request should return 401, got ${unauthReq.status}`);
    }

    console.log('\n🎉 ALL PHASE 4 BACKEND REGRESSION & SECURITY CHECKS PASSED!');
  } finally {
    server.close();
  }
}

runPhase4Tests().catch((err) => {
  console.error('\n❌ Phase 4 Test Suite Failed:', err);
  process.exit(1);
});
