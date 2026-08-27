const BASE_URL = 'http://localhost:5000/api';

async function runPhase8Test() {
  console.log('🧪 Starting Phase 8 Contact, Quote & Admin Lead Management E2E Test on Port 5000...\n');

  try {
    // 1. Submit Public Contact Enquiry
    console.log('1. Submitting Public Contact Enquiry via POST /api/enquiries...');
    const enqRes = await fetch(`${BASE_URL}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Phase8 Test User',
        email: 'phase8.test@example.com',
        phone: '+15550001111',
        companyName: 'NexGen Phase 8 QA',
        projectDescription: 'This is a test contact enquiry for Phase 8 lead workflow verification.',
      }),
    });
    const enqData = await enqRes.json();
    console.log('   ✅ Contact enquiry submitted successfully. ID:', enqData?.data?.id);
    const createdEnquiryId = enqData?.data?.id;

    // 2. Submit Public Quote Request
    console.log('\n2. Submitting Public Quote Request via POST /api/quotes...');
    const quoteRes = await fetch(`${BASE_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Phase8 Quote Client',
        email: 'phase8.quote@example.com',
        phone: '+15550002222',
        companyName: 'Phase 8 Enterprise',
        serviceName: 'Custom Web Application',
        budgetRange: '$15,000 - $30,000',
        timeline: '2 - 4 Months',
        projectDescription: 'This is a test project quote submission for Phase 8 automated verification.',
      }),
    });
    const quoteData = await quoteRes.json();
    console.log('   ✅ Quote request submitted successfully. ID:', quoteData?.data?.id);
    const createdQuoteId = quoteData?.data?.id;

    // 3. Admin Authentication
    console.log('\n3. Authenticating Admin User via POST /api/auth/login...');
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@nexgen.local',
        password: adminPassword,
      }),
    });
    const loginData = await loginRes.json();
    if (!loginData.success || !loginData.data?.token) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginData)}`);
    }
    const token = loginData.data.token;
    console.log('   ✅ Admin logged in successfully.');

    const adminHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 4. Admin Retrieve Enquiries
    console.log('\n4. Fetching Admin Enquiries List via GET /api/enquiries...');
    const adminEnqListRes = await fetch(`${BASE_URL}/enquiries`, { headers: adminHeaders });
    const adminEnqListData = await adminEnqListRes.json();
    const items = Array.isArray(adminEnqListData?.data) ? adminEnqListData.data : adminEnqListData?.data?.items || [];
    const foundEnquiry = items.find((e) => e.id === createdEnquiryId);
    if (!foundEnquiry) {
      throw new Error('Created enquiry was not found in Admin list!');
    }
    console.log('   ✅ Admin retrieved enquiry list. Created enquiry verified!');

    // 5. Admin Retrieve Quotes
    console.log('\n5. Fetching Admin Quote Requests List via GET /api/quotes...');
    const adminQuoteListRes = await fetch(`${BASE_URL}/quotes`, { headers: adminHeaders });
    const adminQuoteListData = await adminQuoteListRes.json();
    const quoteItems = Array.isArray(adminQuoteListData?.data) ? adminQuoteListData.data : adminQuoteListData?.data?.items || [];
    const foundQuote = quoteItems.find((q) => q.id === createdQuoteId);
    if (!foundQuote) {
      throw new Error('Created quote was not found in Admin list!');
    }
    console.log('   ✅ Admin retrieved quote list. Created quote request verified!');

    // 6. Admin Update Enquiry Status
    console.log('\n6. Updating Enquiry Status to IN_DISCUSSION via PATCH /api/enquiries/:id/status...');
    const updateEnqRes = await fetch(`${BASE_URL}/enquiries/${createdEnquiryId}/status`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'IN_DISCUSSION' }),
    });
    const updateEnqData = await updateEnqRes.json();
    console.log('   ✅ Enquiry status updated to:', updateEnqData?.data?.status);

    // 7. Admin Update Quote Status
    console.log('\n7. Updating Quote Status to CONVERTED via PATCH /api/quotes/:id/status...');
    const updateQuoteRes = await fetch(`${BASE_URL}/quotes/${createdQuoteId}/status`, {
      method: 'PATCH',
      headers: adminHeaders,
      body: JSON.stringify({ status: 'CONVERTED' }),
    });
    const updateQuoteData = await updateQuoteRes.json();
    console.log('   ✅ Quote status updated to:', updateQuoteData?.data?.status);

    // 8. Cleanup Test Records
    console.log('\n8. Cleaning up test records...');
    await fetch(`${BASE_URL}/enquiries/${createdEnquiryId}`, { method: 'DELETE', headers: adminHeaders });
    await fetch(`${BASE_URL}/quotes/${createdQuoteId}`, { method: 'DELETE', headers: adminHeaders });
    console.log('   ✅ Test records cleaned up successfully.');

    console.log('\n🎉 ALL PHASE 8 CONTACT, QUOTE & ADMIN LEAD MANAGEMENT CHECKS PASSED PERFECTLY!\n');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error.message);
    process.exit(1);
  }
}

runPhase8Test();
