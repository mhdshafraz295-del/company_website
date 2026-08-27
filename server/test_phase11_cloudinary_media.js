const BASE_URL = 'http://localhost:5000/api';

async function runPhase11CloudinaryTest() {
  console.log('🧪 Starting Phase 11 Cloudinary Media Storage Integration Test on Port 5000...\n');

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

    // Create temporary valid image buffer (1x1 transparent PNG)
    const validPngBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
      'base64'
    );

    // 2. Unauthenticated Upload Test (Must Fail 401)
    console.log('\n2. Testing Unauthenticated Image Upload (Must fail 401)...');
    const blob1 = new Blob([validPngBuffer], { type: 'image/png' });
    const formData1 = new FormData();
    formData1.append('image', blob1, 'test-unauth.png');

    const unauthRes = await fetch(`${BASE_URL}/media/upload?folder=projects`, {
      method: 'POST',
      body: formData1,
    });
    if (unauthRes.status === 401) {
      console.log('   ✅ Unauthenticated upload correctly rejected (401 Unauthorized)');
    } else {
      throw new Error(`Unauthenticated upload test failed with status ${unauthRes.status}`);
    }

    // 3. Single Image Upload via Media Service
    console.log('\n3. Testing Single Image Upload via Media Storage Service...');
    const formData2 = new FormData();
    formData2.append('image', blob1, 'phase11-test.png');

    const uploadRes = await fetch(`${BASE_URL}/media/upload?folder=projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData2,
    });
    const uploadData = await uploadRes.json();
    if (uploadRes.status === 201 && uploadData.success && uploadData.data?.url) {
      console.log('   ✅ Single Image Upload succeeded!');
      console.log('      Provider:', uploadData.data.provider);
      console.log('      URL:', uploadData.data.url);
    } else {
      throw new Error(`Single upload failed: ${JSON.stringify(uploadData)}`);
    }

    const uploadedUrl = uploadData.data.url;

    // 4. Multiple Image Upload via Media Service
    console.log('\n4. Testing Multiple Image Upload via Media Storage Service...');
    const formDataMulti = new FormData();
    formDataMulti.append('images', new Blob([validPngBuffer], { type: 'image/png' }), 'multi1.png');
    formDataMulti.append('images', new Blob([validPngBuffer], { type: 'image/png' }), 'multi2.png');

    const multiRes = await fetch(`${BASE_URL}/media/upload-multiple?folder=projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formDataMulti,
    });
    const multiData = await multiRes.json();
    if (multiRes.status === 201 && multiData.success && Array.isArray(multiData.data) && multiData.data.length === 2) {
      console.log('   ✅ Multiple Image Upload succeeded! Returned 2 items.');
    } else {
      throw new Error(`Multiple upload failed: ${JSON.stringify(multiData)}`);
    }

    // 5. Protected Design Asset Deletion Test
    console.log('\n5. Testing Protection Against Official Logo Deletion...');
    const logoDeleteRes = await fetch(`${BASE_URL}/media/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: '/images/nexgen-logo.png' }),
    });
    const logoDeleteData = await logoDeleteRes.json();
    if (logoDeleteRes.status === 403) {
      console.log('   ✅ Official logo deletion attempt correctly blocked (403 Forbidden):', logoDeleteData.message);
    } else {
      throw new Error(`Logo deletion test failed: ${JSON.stringify(logoDeleteData)}`);
    }

    // 6. Controlled Image Delete Test
    console.log('\n6. Testing Managed Image Delete via Media Storage Service...');
    const deleteRes = await fetch(`${BASE_URL}/media/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: uploadedUrl }),
    });
    const deleteData = await deleteRes.json();
    if (deleteRes.status === 200 && deleteData.success) {
      console.log('   ✅ Temporary image deleted cleanly via storage service.');
    } else {
      throw new Error(`Controlled image delete failed: ${JSON.stringify(deleteData)}`);
    }

    console.log('\n🎉 ALL PHASE 11 CLOUDINARY MEDIA STORAGE INTEGRATION TESTS PASSED 100%!\n');
  } catch (error) {
    console.error('❌ Phase 11 Cloudinary Test Failed:', error.message);
    process.exit(1);
  }
}

runPhase11CloudinaryTest();
