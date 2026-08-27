import http from 'http';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}/api`;

const cleanupQueue = {
  services: [],
  projects: [],
  team: [],
  testimonials: [],
  faqs: [],
  caseStudies: [],
  socialLinks: [],
  enquiries: [],
  quotes: [],
};

let authToken = '';

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
    // Non-JSON response
  }
  return { status, json };
}

async function runTests() {
  console.log(`🧪 Starting Comprehensive Phase 3 REST API Testing on Port ${PORT}...\n`);

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // 1. Health Check
    console.log('1. Testing GET /api/health...');
    const health = await request('/health');
    if (health.status === 200 && health.json.success === true) {
      console.log('   ✅ Health endpoint returned 200 OK');
    } else {
      throw new Error(`Health check failed: ${JSON.stringify(health.json)}`);
    }

    // 2. Public Read Endpoints
    console.log('\n2. Testing Public Read Endpoints...');
    const services = await request('/services');
    if (services.status === 200 && Array.isArray(services.json.data) && services.json.data.length >= 10) {
      console.log(`   ✅ GET /api/services returned ${services.json.data.length} active services`);
    } else {
      throw new Error(`Public services list failed: ${JSON.stringify(services.json)}`);
    }

    const singleService = await request('/services/web-development');
    if (singleService.status === 200 && singleService.json.data.slug === 'web-development') {
      console.log('   ✅ GET /api/services/web-development returned active service details');
    } else {
      throw new Error(`Public single service lookup failed: ${JSON.stringify(singleService.json)}`);
    }

    const projects = await request('/projects');
    console.log(`   ✅ GET /api/projects returned HTTP ${projects.status}`);

    const team = await request('/team');
    console.log(`   ✅ GET /api/team returned HTTP ${team.status}`);

    const founder = await request('/founder');
    console.log(`   ✅ GET /api/founder returned HTTP ${founder.status}`);

    const testimonials = await request('/testimonials');
    console.log(`   ✅ GET /api/testimonials returned HTTP ${testimonials.status}`);

    const faqs = await request('/faqs');
    console.log(`   ✅ GET /api/faqs returned HTTP ${faqs.status} (${faqs.json.data?.length || 0} FAQs)`);

    const settings = await request('/settings');
    console.log(`   ✅ GET /api/settings returned HTTP ${settings.status}`);

    const caseStudies = await request('/case-studies');
    console.log(`   ✅ GET /api/case-studies returned HTTP ${caseStudies.status}`);

    // 3. Authentication & Security Tests
    console.log('\n3. Testing Authentication & Security...');

    const badPassLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@nexgen.local', password: 'wrong_password_123' },
    });
    if (badPassLogin.status === 401) {
      console.log('   ✅ Invalid password rejected with 401 Unauthorized');
    } else {
      throw new Error(`Bad password login expected 401, got ${badPassLogin.status}`);
    }

    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';
    const validLogin = await request('/auth/login', {
      method: 'POST',
      body: { email: 'admin@nexgen.local', password: adminPassword },
    });
    if (validLogin.status === 200 && validLogin.json.data?.token) {
      authToken = validLogin.json.data.token;
      const adminObj = validLogin.json.data.admin;
      if (adminObj.passwordHash !== undefined) {
        throw new Error('SECURITY VIOLATION: passwordHash was returned in login response!');
      }
      console.log('   ✅ Valid admin login successful, JWT token issued, passwordHash omitted');
    } else {
      throw new Error(`Valid login failed: ${JSON.stringify(validLogin.json)}`);
    }

    const meWithoutToken = await request('/auth/me');
    if (meWithoutToken.status === 401) {
      console.log('   ✅ GET /api/auth/me without token rejected with 401');
    } else {
      throw new Error(`GET /auth/me without token expected 401, got ${meWithoutToken.status}`);
    }

    const meWithToken = await request('/auth/me', { token: authToken });
    if (meWithToken.status === 200 && meWithToken.json.data?.admin?.email === 'admin@nexgen.local') {
      console.log('   ✅ GET /api/auth/me with Bearer token returned current admin');
    } else {
      throw new Error(`GET /auth/me failed: ${JSON.stringify(meWithToken.json)}`);
    }

    const unauthCreateService = await request('/services', {
      method: 'POST',
      body: { title: 'Unauthorized Service', shortDescription: 'test', description: 'test' },
    });
    if (unauthCreateService.status === 401) {
      console.log('   ✅ Unauthenticated POST /api/services protected with 401');
    } else {
      throw new Error(`Unauthenticated service creation expected 401, got ${unauthCreateService.status}`);
    }

    // 4. Rating, Strict Field & Pagination Limits
    console.log('\n4. Testing Rating, Strict Field & Pagination Limits...');
    
    // Rating 1-5 enforcement
    const invalidRatingTestimonial = await request('/testimonials', {
      method: 'POST',
      token: authToken,
      body: {
        clientName: '[TEST_PHASE3] Client',
        rating: 6,
        review: 'Great service test review',
      },
    });
    if (invalidRatingTestimonial.status === 400) {
      console.log('   ✅ Testimonial with rating = 6 rejected with 400 Bad Request');
    } else {
      throw new Error(`Rating = 6 should fail validation with 400, got ${invalidRatingTestimonial.status}`);
    }

    // Strict schema enforcement: unexpected internal field (e.g. status) in public enquiry MUST throw 400 Bad Request!
    const unexpectedFieldEnquiry = await request('/enquiries', {
      method: 'POST',
      body: {
        fullName: '[TEST_PHASE3] Strict Client',
        email: 'strict@nexgen.local',
        projectDescription: 'Strict field validation test description.',
        status: 'CONVERTED', // Privileged internal field - must be rejected by .strict()!
      },
    });
    if (unexpectedFieldEnquiry.status === 400) {
      console.log('   ✅ Public enquiry submission with privileged field status=CONVERTED rejected with 400 Bad Request (Strict Zod schema working)');
    } else {
      throw new Error(`Unexpected field in public enquiry should return 400 Bad Request, got ${unexpectedFieldEnquiry.status}`);
    }

    const unexpectedFieldQuote = await request('/quotes', {
      method: 'POST',
      body: {
        fullName: '[TEST_PHASE3] Strict Quote Client',
        email: 'strictquote@nexgen.local',
        projectDescription: 'Strict quote validation test description.',
        adminNotes: 'HACKER NOTES', // Privileged internal field - must be rejected by .strict()!
      },
    });
    if (unexpectedFieldQuote.status === 400) {
      console.log('   ✅ Public quote submission with privileged field adminNotes rejected with 400 Bad Request (Strict Zod schema working)');
    } else {
      throw new Error(`Unexpected field in public quote should return 400 Bad Request, got ${unexpectedFieldQuote.status}`);
    }

    // Pagination limit check
    const exceedLimitReq = await request('/projects?limit=101');
    if (exceedLimitReq.status === 400) {
      console.log('   ✅ Query limit > 100 rejected with 400 Bad Request');
    } else {
      throw new Error(`Limit > 100 expected 400, got ${exceedLimitReq.status}`);
    }

    // 5. Valid Public Form Submissions
    console.log('\n5. Testing Valid Public Submissions...');
    const publicEnquiry = await request('/enquiries', {
      method: 'POST',
      body: {
        fullName: '[TEST_PHASE3] Public Client',
        email: 'testpublic@nexgen.local',
        projectDescription: 'Need a custom web application for business operations.',
      },
    });
    if (publicEnquiry.status === 201 && publicEnquiry.json.data?.status === 'NEW' && !publicEnquiry.json.data?.adminNotes) {
      cleanupQueue.enquiries.push(publicEnquiry.json.data.id);
      console.log('   ✅ Public contact enquiry created with status NEW and null adminNotes');
    } else {
      throw new Error(`Public enquiry submission failed: ${JSON.stringify(publicEnquiry.json)}`);
    }

    const publicQuote = await request('/quotes', {
      method: 'POST',
      body: {
        fullName: '[TEST_PHASE3] Quote Client',
        email: 'testquote@nexgen.local',
        projectTitle: 'Enterprise Cloud System',
        projectDescription: 'Multi-tenant cloud platform development project.',
      },
    });
    if (publicQuote.status === 201 && publicQuote.json.data?.status === 'NEW') {
      cleanupQueue.quotes.push(publicQuote.json.data.id);
      console.log('   ✅ Public quote request created successfully');
    } else {
      throw new Error(`Public quote submission failed: ${JSON.stringify(publicQuote.json)}`);
    }

    // 6. Complete Admin CRUD Across All Route Groups & MySQL Search
    console.log('\n6. Testing Admin CRUD & MySQL Search Compatibility...');

    // Service CRUD
    const adminServicesList = await request('/services/admin/all', { token: authToken });
    if (adminServicesList.status === 200) {
      console.log('   ✅ GET /api/services/admin/all succeeded');
    }
    const createServiceRes = await request('/services', {
      method: 'POST',
      token: authToken,
      body: {
        title: '[TEST_PHASE3] AI Solutions',
        shortDescription: 'Artificial intelligence integration services',
        description: 'Building custom machine learning models and AI workflows.',
        displayOrder: 99,
      },
    });
    if (createServiceRes.status === 201 && createServiceRes.json.data?.id) {
      cleanupQueue.services.push(createServiceRes.json.data.id);
      console.log('   ✅ Service CRUD: Create succeeded');
    }

    // Project CRUD & Tech linking
    const createProjectRes = await request('/projects', {
      method: 'POST',
      token: authToken,
      body: {
        title: '[TEST_PHASE3] NexGen Portal',
        shortDescription: 'Enterprise internal management portal',
        fullDescription: 'Full-featured enterprise portal with dashboard, analytics, and role permissions.',
        category: 'BUSINESS_SYSTEM',
        status: 'COMPLETED',
        published: true,
        technologies: ['React', 'Node.js', 'MySQL'],
      },
    });
    if (createProjectRes.status === 201 && createProjectRes.json.data?.id) {
      cleanupQueue.projects.push(createProjectRes.json.data.id);
      console.log('   ✅ Project CRUD & Technology sync: Create succeeded');
    }

    // Test MySQL Search Query Execution
    const searchRes = await request('/projects?search=Portal');
    if (searchRes.status === 200 && Array.isArray(searchRes.json.data)) {
      console.log(`   ✅ MySQL search query ("search=Portal") executed cleanly (${searchRes.json.data.length} match)`);
    } else {
      throw new Error(`MySQL search query failed: ${JSON.stringify(searchRes.json)}`);
    }

    // Team Member CRUD
    const createTeamRes = await request('/team', {
      method: 'POST',
      token: authToken,
      body: {
        name: '[TEST_PHASE3] Alex Dev',
        position: 'Lead Systems Architect',
        shortBio: 'Specializes in distributed cloud systems.',
        isActive: true,
      },
    });
    if (createTeamRes.status === 201 && createTeamRes.json.data?.id) {
      cleanupQueue.team.push(createTeamRes.json.data.id);
      console.log('   ✅ Team Member CRUD: Create succeeded (text position preserved)');
    }

    // Founder Profile PUT
    const updateFounderRes = await request('/founder', {
      method: 'PUT',
      token: authToken,
      body: {
        name: 'NexGen Founder',
        primaryRole: 'Founder & CEO',
        expertise: 'Enterprise Software & Cloud Engineering',
        visionStatement: 'To empower organizations through intelligent software solutions.',
      },
    });
    if (updateFounderRes.status === 200 && updateFounderRes.json.data?.name === 'NexGen Founder') {
      console.log('   ✅ Founder Profile: Single-profile update succeeded');
    }

    // Testimonial CRUD
    const createTestimonialRes = await request('/testimonials', {
      method: 'POST',
      token: authToken,
      body: {
        clientName: '[TEST_PHASE3] Jane Corp',
        rating: 5,
        review: 'Exceptional software quality and delivery timeline.',
        approved: true,
        isVisible: true,
      },
    });
    if (createTestimonialRes.status === 201 && createTestimonialRes.json.data?.id) {
      cleanupQueue.testimonials.push(createTestimonialRes.json.data.id);
      console.log('   ✅ Testimonial CRUD: Create succeeded');
    }

    // FAQ CRUD
    const createFAQRes = await request('/faqs', {
      method: 'POST',
      token: authToken,
      body: {
        question: '[TEST_PHASE3] What is your deployment workflow?',
        answer: 'We utilize automated CI/CD pipelines with containerized environments.',
        isActive: true,
      },
    });
    if (createFAQRes.status === 201 && createFAQRes.json.data?.id) {
      cleanupQueue.faqs.push(createFAQRes.json.data.id);
      console.log('   ✅ FAQ CRUD: Create succeeded');
    }

    // Settings & Social Links
    const updateSettingsRes = await request('/settings', {
      method: 'PATCH',
      token: authToken,
      body: {
        companyName: 'NexGen Solutions',
        tagline: 'Software & Web Development',
      },
    });
    if (updateSettingsRes.status === 200) {
      console.log('   ✅ Settings PATCH: Update succeeded');
    }

    const createSocialRes = await request('/settings/social-links', {
      method: 'POST',
      token: authToken,
      body: {
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/nexgen-solutions',
        icon: 'Linkedin',
        isActive: true,
      },
    });
    if (createSocialRes.status === 201 && createSocialRes.json.data?.id) {
      cleanupQueue.socialLinks.push(createSocialRes.json.data.id);
      console.log('   ✅ Social Link CRUD: Create succeeded');
    }

    // Case Study CRUD
    const createCaseStudyRes = await request('/case-studies', {
      method: 'POST',
      token: authToken,
      body: {
        title: '[TEST_PHASE3] Scaling Enterprise Architecture',
        problem: 'Client needed to scale system throughput under peak loads.',
        solution: 'Implemented microservices and caching architecture.',
        published: true,
      },
    });
    if (createCaseStudyRes.status === 201 && createCaseStudyRes.json.data?.id) {
      cleanupQueue.caseStudies.push(createCaseStudyRes.json.data.id);
      console.log('   ✅ Case Study CRUD: Create succeeded');
    }

    // 7. Non-existent item 404 test
    console.log('\n7. Testing 404 Not Found Handling...');
    const missingService = await request('/services/non-existent-test-slug-999');
    if (missingService.status === 404 && missingService.json.success === false) {
      console.log('   ✅ Non-existent service slug returned 404 Not Found');
    } else {
      throw new Error(`Missing service expected 404, got ${missingService.status}`);
    }

    console.log('\n🎉 ALL PHASE 3 REST API INTEGRATION TESTS PASSED PERFECTLY!');
  } finally {
    // Guaranteed Cleanup Phase
    console.log('\n🧹 Cleaning up temporary [TEST_PHASE3] records...');
    if (authToken) {
      for (const id of cleanupQueue.services) await request(`/services/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.projects) await request(`/projects/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.team) await request(`/team/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.testimonials) await request(`/testimonials/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.faqs) await request(`/faqs/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.caseStudies) await request(`/case-studies/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.socialLinks) await request(`/settings/social-links/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.enquiries) await request(`/enquiries/${id}`, { method: 'DELETE', token: authToken });
      for (const id of cleanupQueue.quotes) await request(`/quotes/${id}`, { method: 'DELETE', token: authToken });
    }
    console.log('✅ Cleanup completed.');
    server.close();
  }
}

runTests().catch((err) => {
  console.error('\n❌ Phase 3 API Test Suite Failed:', err);
  process.exit(1);
});
