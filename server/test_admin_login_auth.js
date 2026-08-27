const BASE_URL = 'http://localhost:5000/api';

async function runAdminLoginTest() {
  console.log('🧪 Starting Admin Login & Auth Verification on Port 5000...\n');

  try {
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'change_me';

    // 1. Invalid Admin Password Login
    console.log('1. Testing Invalid Admin Login Credentials...');
    const invalidRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nexgen.local', password: 'WrongPassword999!' }),
    });
    const invalidData = await invalidRes.json();
    if (invalidRes.status === 401 && invalidData.success === false) {
      console.log('   ✅ Invalid credentials correctly rejected (401 Unauthorized):', invalidData.message);
    } else {
      throw new Error(`Invalid login test failed: ${JSON.stringify(invalidData)}`);
    }

    // 2. Valid Admin Login
    console.log('\n2. Testing Valid Admin Credentials...');
    const validRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@nexgen.local', password: adminPassword }),
    });
    const validData = await validRes.json();
    if (validRes.status === 200 && validData.success === true && validData.data?.token) {
      console.log('   ✅ Valid Admin Login succeeded! Admin name:', validData.data.admin?.name);
    } else {
      throw new Error(`Valid login test failed: ${JSON.stringify(validData)}`);
    }

    const token = validData.data.token;

    // 3. Session Restoration via GET /api/auth/me
    console.log('\n3. Testing Session Restoration via GET /api/auth/me...');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const meData = await meRes.json();
    if (meRes.status === 200 && meData.success === true && meData.data?.admin?.email === 'admin@nexgen.local') {
      console.log('   ✅ Session Restoration verified! Logged in as:', meData.data.admin.email);
    } else {
      throw new Error(`Session restoration failed: ${JSON.stringify(meData)}`);
    }

    // 4. Invalid Token Session Failure
    console.log('\n4. Testing Session Invalidation with Bad Token...');
    const badTokenRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer invalid_token_123`,
      },
    });
    const badTokenData = await badTokenRes.json();
    if (badTokenRes.status === 401 && badTokenData.success === false) {
      console.log('   ✅ Invalid token correctly rejected session restoration (401 Unauthorized)');
    } else {
      throw new Error(`Bad token test failed: ${JSON.stringify(badTokenData)}`);
    }

    console.log('\n🎉 ALL ADMIN LOGIN & AUTHENTICATION TESTS PASSED 100%!\n');
  } catch (error) {
    console.error('❌ Admin Login Test Failed:', error.message);
    process.exit(1);
  }
}

runAdminLoginTest();
