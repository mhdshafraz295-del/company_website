import http from 'http';
import app from './src/app.js';
import prisma from './src/utils/prisma.js';

const PORT = 5055; // Use an isolated test port to prevent collisions
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
  } catch (e) {}
  return { status, json };
}

async function runTests() {
  console.log(`🧪 Starting Phase 12 Collaborator API Verification on Port ${PORT}...\n`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Authenticate Admin
    console.log('1. Authenticating Admin User...');
    const loginRes = await request('/auth/login', {
      method: 'POST',
      body: {
        email: process.env.SEED_ADMIN_EMAIL || 'admin@nexgen.local',
        password: process.env.SEED_ADMIN_PASSWORD || 'change_me',
      },
    });

    assert(loginRes.status === 200, 'Admin login returned 200 OK');
    const token = loginRes.json.data?.token;
    assert(Boolean(token), 'JWT Token obtained for admin authorization');

    // 2. Test Admin Collaborator Creation
    console.log('\n2. Testing POST /api/collaborators...');
    const createCollabRes = await request('/collaborators', {
      method: 'POST',
      token,
      body: {
        name: 'Quantum FinTech Labs',
        partnerType: 'Fintech Innovation Partner',
        shortDescription: 'Enterprise financial platform engineering and AI automation.',
        phone: '+94 11 234 5678',
        whatsapp: '94112345678',
        email: 'partners@quantumfintech.io',
        website: 'https://quantumfintech.io',
        displayOrder: 1,
        isActive: true,
        isFeatured: true,
      },
    });

    assert(createCollabRes.status === 201, 'POST /api/collaborators returned 201 Created');
    const collabId = createCollabRes.json.data?.id;
    assert(Boolean(collabId), 'Created collaborator has valid ID');

    // 3. Test Public GET /api/collaborators
    console.log('\n3. Testing GET /api/collaborators (Public active partners)...');
    const publicCollabs = await request('/collaborators');
    assert(publicCollabs.status === 200, 'GET /api/collaborators returned 200 OK');
    assert(Array.isArray(publicCollabs.json.data), 'Public response data is an array');
    const foundInPublic = publicCollabs.json.data.some((c) => c.id === collabId);
    assert(foundInPublic, 'New active collaborator appears in public endpoint');

    // 4. Test Public GET /api/collaborators/featured
    console.log('\n4. Testing GET /api/collaborators/featured...');
    const featuredCollabs = await request('/collaborators/featured');
    assert(featuredCollabs.status === 200, 'GET /api/collaborators/featured returned 200 OK');
    const foundInFeatured = featuredCollabs.json.data.some((c) => c.id === collabId);
    assert(foundInFeatured, 'Featured collaborator appears in featured endpoint');

    // 5. Test Admin Toggle Feature & Active
    console.log('\n5. Testing PATCH /api/collaborators/:id/toggle-featured & toggle-active...');
    const toggleFeaturedRes = await request(`/collaborators/${collabId}/toggle-featured`, {
      method: 'PATCH',
      token,
    });
    assert(toggleFeaturedRes.status === 200, 'Toggle featured returned 200 OK');
    assert(toggleFeaturedRes.json.data?.isFeatured === false, 'isFeatured toggled to false');

    const toggleActiveRes = await request(`/collaborators/${collabId}/toggle-active`, {
      method: 'PATCH',
      token,
    });
    assert(toggleActiveRes.status === 200, 'Toggle active returned 200 OK');
    assert(toggleActiveRes.json.data?.isActive === false, 'isActive toggled to false');

    // Re-activate
    await request(`/collaborators/${collabId}/toggle-active`, { method: 'PATCH', token });
    await request(`/collaborators/${collabId}/toggle-featured`, { method: 'PATCH', token });

    // 6. Test Linking Project to Collaborator via POST /api/projects
    console.log('\n6. Testing POST /api/projects with collaboratorId...');
    const projectRes = await request('/projects', {
      method: 'POST',
      token,
      body: {
        title: 'Algorithmic Trading Dashboard',
        slug: 'algorithmic-trading-dashboard',
        category: 'BUSINESS_SYSTEM',
        shortDescription: 'High-frequency trading interface built for Quantum.',
        fullDescription: 'Comprehensive low-latency trading portal with real-time WebSockets.',
        collaboratorId: collabId,
        published: true,
        technologies: ['React', 'Node.js', 'WebSocket'],
      },
    });

    assert(projectRes.status === 201, 'POST /api/projects returned 201 Created');
    const projectId = projectRes.json.data?.id;
    assert(projectRes.json.data?.collaborator?.name === 'Quantum FinTech Labs', 'Project response includes nested collaborator');

    // 7. Test Linking Testimonial to Collaborator & Project via POST /api/testimonials
    console.log('\n7. Testing POST /api/testimonials with collaboratorId & projectId...');
    const testimonialRes = await request('/testimonials', {
      method: 'POST',
      token,
      body: {
        clientName: 'Alexander Vance',
        company: 'Quantum FinTech Labs',
        position: 'Chief Technology Officer',
        rating: 5,
        review: 'Nexgen engineering standards are world class. The trading portal exceeded performance benchmarks.',
        collaboratorId: collabId,
        projectId: projectId,
        approved: true,
        isVisible: true,
      },
    });

    assert(testimonialRes.status === 201, 'POST /api/testimonials returned 201 Created');
    const testimonialId = testimonialRes.json.data?.id;
    assert(testimonialRes.json.data?.collaborator?.id === collabId, 'Testimonial has linked collaborator');
    assert(testimonialRes.json.data?.project?.id === projectId, 'Testimonial has linked project');

    // 8. Test Collaborator Detail with Joined Projects and Reviews
    console.log('\n8. Testing GET /api/collaborators/:id...');
    const detailRes = await request(`/collaborators/${collabId}`);
    assert(detailRes.status === 200, 'GET /api/collaborators/:id returned 200 OK');
    assert(detailRes.json.data?.projects?.length === 1, 'Collaborator detail includes linked project');
    assert(detailRes.json.data?.testimonials?.length === 1, 'Collaborator detail includes linked review');

    // 9. Test Deletion Safety
    console.log('\n9. Testing Safe Collaborator Deletion...');
    const deleteCollabRes = await request(`/collaborators/${collabId}`, {
      method: 'DELETE',
      token,
    });
    assert(deleteCollabRes.status === 200, 'DELETE /api/collaborators/:id returned 200 OK');

    // Verify Project Still Exists with collaboratorId = null
    const checkProject = await prisma.project.findUnique({ where: { id: projectId } });
    assert(checkProject !== null, 'Project is preserved (NOT deleted)');
    assert(checkProject.collaboratorId === null, 'Project collaboratorId safely detached to null');

    // Verify Testimonial Still Exists with collaboratorId = null
    const checkTestimonial = await prisma.testimonial.findUnique({ where: { id: testimonialId } });
    assert(checkTestimonial !== null, 'Testimonial is preserved (NOT deleted)');
    assert(checkTestimonial.collaboratorId === null, 'Testimonial collaboratorId safely detached to null');

    // Clean up test records
    await prisma.testimonial.delete({ where: { id: testimonialId } });
    await prisma.project.delete({ where: { id: projectId } });

    console.log('\n========================================');
    console.log(`API TEST RESULT: ${passed} passed, ${failed} failed.`);
    console.log('========================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ API test error:', err);
    process.exit(1);
  } finally {
    server.close();
    await prisma.$disconnect();
  }
}

runTests();

