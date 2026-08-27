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

async function runPhase5Tests() {
  console.log(`🧪 Starting Public API Integration & Admin Regression Verification on Port ${PORT}...\n`);

  // If server is already running on port 5000, test existing server directly; otherwise start ephemeral server on port 5000
  let server = null;
  try {
    const healthTest = await fetch(`${BASE_URL}/health`).catch(() => null);
    if (!healthTest || healthTest.status !== 200) {
      server = http.createServer(app);
      await new Promise((resolve, reject) => {
        server.listen(PORT, resolve);
        server.on('error', reject);
      });
    }
  } catch (e) {
    console.log(`Note: Testing against existing active server on port ${PORT}...`);
  }

  try {
    // 1. Health Endpoint Check
    console.log('1. Testing GET /api/health...');
    const health = await request('/health');
    if (health.status === 200 && health.json.success === true) {
      console.log('   ✅ Health endpoint returned 200 OK');
    } else {
      throw new Error(`Health check failed: ${JSON.stringify(health.json)}`);
    }

    // 2. Public Services Endpoint
    console.log('\n2. Testing GET /api/services...');
    const servicesRes = await request('/services');
    if (servicesRes.status === 200 && Array.isArray(servicesRes.json.data)) {
      console.log(`   ✅ Services API returned ${servicesRes.json.data.length} active service categories`);
    } else {
      throw new Error(`Services API failed: ${JSON.stringify(servicesRes.json)}`);
    }

    // 3. Public Projects Endpoint
    console.log('\n3. Testing GET /api/projects...');
    const projectsRes = await request('/projects');
    if (projectsRes.status === 200 && Array.isArray(projectsRes.json.data)) {
      console.log(`   ✅ Projects API returned ${projectsRes.json.data.length} published projects`);
    } else {
      throw new Error(`Projects API failed: ${JSON.stringify(projectsRes.json)}`);
    }

    // 4. Public Founder Profile Endpoint
    console.log('\n4. Testing GET /api/founder...');
    const founderRes = await request('/founder');
    if (founderRes.status === 200) {
      console.log('   ✅ Founder API returned valid status 200');
    } else {
      throw new Error(`Founder API failed: ${JSON.stringify(founderRes.json)}`);
    }

    // 5. Public Team Endpoint
    console.log('\n5. Testing GET /api/team...');
    const teamRes = await request('/team');
    if (teamRes.status === 200 && Array.isArray(teamRes.json.data)) {
      console.log(`   ✅ Team API returned ${teamRes.json.data.length} active team members`);
    } else {
      throw new Error(`Team API failed: ${JSON.stringify(teamRes.json)}`);
    }

    // 6. Public Testimonials Endpoint
    console.log('\n6. Testing GET /api/testimonials...');
    const testimonialsRes = await request('/testimonials');
    if (testimonialsRes.status === 200 && Array.isArray(testimonialsRes.json.data)) {
      console.log(`   ✅ Testimonials API returned ${testimonialsRes.json.data.length} approved testimonials`);
    } else {
      throw new Error(`Testimonials API failed: ${JSON.stringify(testimonialsRes.json)}`);
    }

    // 7. Public FAQs Endpoint
    console.log('\n7. Testing GET /api/faqs...');
    const faqsRes = await request('/faqs');
    if (faqsRes.status === 200 && Array.isArray(faqsRes.json.data)) {
      console.log(`   ✅ FAQs API returned ${faqsRes.json.data.length} informational FAQs`);
    } else {
      throw new Error(`FAQs API failed: ${JSON.stringify(faqsRes.json)}`);
    }

    // 8. Public Website Settings Endpoint
    console.log('\n8. Testing GET /api/settings...');
    const settingsRes = await request('/settings');
    if (settingsRes.status === 200 && settingsRes.json.data?.setting) {
      console.log(`   ✅ Settings API returned setting: "${settingsRes.json.data.setting.companyName}"`);
    } else {
      throw new Error(`Settings API failed: ${JSON.stringify(settingsRes.json)}`);
    }

    // 9. Admin Regression Test - Admin Login & /auth/me
    console.log('\n9. Testing Admin Authentication Regression...');
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@nexgen.local', password: adminPassword },
    });

    if (loginRes.status === 200 && loginRes.json.data?.token) {
      const token = loginRes.json.data.token;
      const meRes = await request('/auth/me', { token });
      if (meRes.status === 200 && meRes.json.data?.admin?.email === 'admin@nexgen.local') {
        console.log('   ✅ Admin Authentication & Session Restoration remain 100% functional!');
      } else {
        throw new Error(`Admin /auth/me regression failed`);
      }
    } else {
      throw new Error(`Admin login regression failed: ${JSON.stringify(loginRes.json)}`);
    }

    console.log('\n🎉 ALL PUBLIC API & ADMIN REGRESSION CHECKS PASSED ON CONFIGURED PORT 5000!');
  } catch (err) {
    console.error('\n❌ Test Suite Failed:', err);
    throw err;
  } finally {
    if (server) {
      server.close();
    }
  }
}

runPhase5Tests().catch((err) => {
  process.exit(1);
});
