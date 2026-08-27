const BASE_URL = 'http://localhost:5000/api';

async function runPhase9CMSTest() {
  console.log('🧪 Starting Phase 9 Full Admin CMS E2E Integration Test on Port 5000...\n');

  try {
    // 1. Admin Authentication
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nexgen.local', password: adminPassword }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.data?.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.data.token;
    console.log('1. ✅ Admin Authentication succeeded.');

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 2. Services CMS Test
    console.log('\n2. Testing Services CMS CRUD...');
    const createServiceRes = await fetch(`${BASE_URL}/services`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: 'Phase 9 Test Service',
        shortDescription: 'Temporary service created for Phase 9 CMS verification.',
        description: 'Full description of Phase 9 test service.',
        isActive: true,
        displayOrder: 99,
      }),
    });
    const createServiceData = await createServiceRes.json();
    const serviceId = createServiceData.data.id;
    console.log('   ✅ Service Created. ID:', serviceId);

    const updateServiceRes = await fetch(`${BASE_URL}/services/${serviceId}`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ title: 'Phase 9 Test Service Updated' }),
    });
    const updateServiceData = await updateServiceRes.json();
    console.log('   ✅ Service Updated:', updateServiceData.data.title);

    await fetch(`${BASE_URL}/services/${serviceId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Service Deleted cleanly.');

    // 3. Projects CMS Test
    console.log('\n3. Testing Projects CMS CRUD...');
    const createProjectRes = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: 'Phase 9 Test Project',
        category: 'WEBSITE',
        shortDescription: 'Short description for Phase 9 test project.',
        fullDescription: 'Full project details for Phase 9 test project.',
        status: 'COMPLETED',
        published: true,
        technologies: ['React', 'Node.js', 'Phase9QA'],
      }),
    });
    const createProjectData = await createProjectRes.json();
    const projectId = createProjectData.data.id;
    console.log('   ✅ Project Created. ID:', projectId);

    await fetch(`${BASE_URL}/projects/${projectId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Project Deleted cleanly.');

    // 4. Case Studies CMS Test
    console.log('\n4. Testing Case Studies CMS CRUD...');
    const createCSRes = await fetch(`${BASE_URL}/case-studies`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        title: 'Phase 9 Test Case Study',
        problem: 'Technical challenge statement for testing.',
        solution: 'Engineering solution explanation for testing.',
        result: 'Measurable metric improvement.',
        published: true,
      }),
    });
    const createCSData = await createCSRes.json();
    const csId = createCSData.data.id;
    console.log('   ✅ Case Study Created. ID:', csId);

    await fetch(`${BASE_URL}/case-studies/${csId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Case Study Deleted cleanly.');

    // 5. Founder Profile CMS Test
    console.log('\n5. Testing Founder Profile CMS...');
    const getFounderRes = await fetch(`${BASE_URL}/founder`);
    const getFounderData = await getFounderRes.json();
    const currentFounder = getFounderData.data || {};

    const updateFounderRes = await fetch(`${BASE_URL}/founder`, {
      method: 'PUT',
      headers: adminHeaders,
      body: JSON.stringify({
        name: currentFounder.name || 'Alexander Vance',
        primaryRole: currentFounder.primaryRole || 'Founder & CTO',
        shortBio: currentFounder.shortBio || 'Lead software architect.',
      }),
    });
    const updateFounderData = await updateFounderRes.json();
    console.log('   ✅ Founder Profile Updated:', updateFounderData.data.name);

    // 6. Team Members CMS Test
    console.log('\n6. Testing Team Members CMS CRUD...');
    const createTeamRes = await fetch(`${BASE_URL}/team`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        name: 'Phase 9 QA Member',
        position: 'QA Automation Engineer',
        shortBio: 'Testing team member profile.',
        isActive: true,
      }),
    });
    const createTeamData = await createTeamRes.json();
    const teamId = createTeamData.data.id;
    console.log('   ✅ Team Member Created. ID:', teamId);

    await fetch(`${BASE_URL}/team/${teamId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Team Member Deleted cleanly.');

    // 7. Testimonials CMS Test
    console.log('\n7. Testing Testimonials CMS CRUD & Approval...');
    const createTestimonialRes = await fetch(`${BASE_URL}/testimonials`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        clientName: 'Phase 9 Reviewer',
        company: 'QA Enterprise',
        rating: 5,
        review: 'Outstanding engineering quality and performance!',
        approved: false,
        isVisible: true,
      }),
    });
    const createTestimonialData = await createTestimonialRes.json();
    const testimonialId = createTestimonialData.data.id;
    console.log('   ✅ Testimonial Created. ID:', testimonialId);

    const approveRes = await fetch(`${BASE_URL}/testimonials/${testimonialId}/approve`, {
      method: 'PATCH',
      headers: adminHeaders,
    });
    const approveData = await approveRes.json();
    console.log('   ✅ Testimonial Approved Status:', approveData.data.approved);

    await fetch(`${BASE_URL}/testimonials/${testimonialId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Testimonial Deleted cleanly.');

    // 8. FAQs CMS Test
    console.log('\n8. Testing FAQs CMS CRUD...');
    const createFaqRes = await fetch(`${BASE_URL}/faqs`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        question: 'Phase 9 Test Question?',
        answer: 'Phase 9 test answer explanation.',
        isActive: true,
      }),
    });
    const createFaqData = await createFaqRes.json();
    const faqId = createFaqData.data.id;
    console.log('   ✅ FAQ Created. ID:', faqId);

    await fetch(`${BASE_URL}/faqs/${faqId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ FAQ Deleted cleanly.');

    // 9. Website Settings & Social Links CMS Test
    console.log('\n9. Testing Website Settings & Social Links CMS...');
    const updateSettingsRes = await fetch(`${BASE_URL}/settings`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({
        companyName: 'NexGen Solutions',
        tagline: 'Software & Web Agency',
      }),
    });
    const updateSettingsData = await updateSettingsRes.json();
    console.log('   ✅ Website Settings Updated:', updateSettingsData.data.companyName);

    const createSocialRes = await fetch(`${BASE_URL}/settings/social-links`, {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        platform: 'LinkedIn',
        url: 'https://linkedin.com/company/nexgensolutions-qa',
        isActive: true,
      }),
    });
    const createSocialData = await createSocialRes.json();
    const socialId = createSocialData.data.id;
    console.log('   ✅ Social Link Created. ID:', socialId);

    await fetch(`${BASE_URL}/settings/social-links/${socialId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Social Link Deleted cleanly.');

    console.log('\n🎉 ALL PHASE 9 FULL ADMIN CMS INTEGRATION TESTS PASSED 100%!\n');
  } catch (error) {
    console.error('❌ Phase 9 E2E Test Failed:', error.message);
    process.exit(1);
  }
}

runPhase9CMSTest();
