import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BASE_URL = 'http://localhost:5000/api';

async function runPhase10MediaTest() {
  console.log('🧪 Starting Phase 10 Media & Image Upload Integration Test on Port 5000...\n');

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
    console.log('\n2. Testing Unauthenticated Image Upload (Must fail with 401)...');
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

    // 3. Valid Admin Image Upload Test (PNG)
    console.log('\n3. Testing Valid PNG Image Upload...');
    const formData2 = new FormData();
    formData2.append('image', blob1, 'test-project.png');

    const uploadRes = await fetch(`${BASE_URL}/media/upload?folder=projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData2,
    });
    const uploadData = await uploadRes.json();
    if (uploadRes.status === 201 && uploadData.success && uploadData.data?.url) {
      console.log('   ✅ Image Upload succeeded! Server URL:', uploadData.data.url);
    } else {
      throw new Error(`Valid upload failed: ${JSON.stringify(uploadData)}`);
    }

    const uploadedUrl = uploadData.data.url;

    // 4. Static Serving Verification (GET http://localhost:5000/uploads/projects/...)
    console.log('\n4. Testing Static File Serving over HTTP...');
    const staticRes = await fetch(`http://localhost:5000${uploadedUrl}`);
    if (staticRes.status === 200) {
      console.log('   ✅ Uploaded image successfully fetched via Express static route (200 OK)');
    } else {
      throw new Error(`Static file serving failed with status ${staticRes.status}`);
    }

    // 5. Invalid File MIME Type Test (.js file must fail)
    console.log('\n5. Testing Invalid File Extension / MIME Type (.js file)...');
    const jsBlob = new Blob(['console.log("malicious script");'], { type: 'text/javascript' });
    const formData3 = new FormData();
    formData3.append('image', jsBlob, 'exploit.js');

    const invalidMimeRes = await fetch(`${BASE_URL}/media/upload?folder=projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData3,
    });
    const invalidMimeData = await invalidMimeRes.json();
    if (invalidMimeRes.status === 400 && invalidMimeData.success === false) {
      console.log('   ✅ Invalid file format rejected correctly (400 Bad Request):', invalidMimeData.message);
    } else {
      throw new Error(`Invalid MIME type test failed: ${JSON.stringify(invalidMimeData)}`);
    }

    // 6. Oversized File (>5MB) Rejection Test
    console.log('\n6. Testing Oversized File (>5MB Rejection)...');
    const bigBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB
    const bigBlob = new Blob([bigBuffer], { type: 'image/png' });
    const formData4 = new FormData();
    formData4.append('image', bigBlob, 'huge.png');

    const bigFileRes = await fetch(`${BASE_URL}/media/upload?folder=projects`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData4,
    });
    const bigFileData = await bigFileRes.json();
    if (bigFileRes.status === 400 && bigFileData.success === false) {
      console.log('   ✅ Oversized file rejected correctly (400 Bad Request):', bigFileData.message);
    } else {
      throw new Error(`Oversized file test failed: ${JSON.stringify(bigFileData)}`);
    }

    // 7. Path Traversal Protection Test
    console.log('\n7. Testing Path Traversal Protection on Delete Endpoint...');
    const pathTraversalRes = await fetch(`${BASE_URL}/media/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url: '/uploads/../../server.js' }),
    });
    const pathTraversalData = await pathTraversalRes.json();
    if (pathTraversalRes.status === 403 || pathTraversalRes.status === 400) {
      console.log('   ✅ Path traversal attempt correctly blocked:', pathTraversalData.message);
    } else {
      throw new Error(`Path traversal test failed: ${JSON.stringify(pathTraversalData)}`);
    }

    // 8. Controlled File Delete Test
    console.log('\n8. Testing Controlled Managed Image Deletion...');
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
      console.log('   ✅ Temporary image deleted safely from disk.');
    } else {
      throw new Error(`Controlled image delete failed: ${JSON.stringify(deleteData)}`);
    }

    console.log('\n🎉 ALL PHASE 10 MEDIA & IMAGE UPLOAD INTEGRATION TESTS PASSED 100%!\n');
  } catch (error) {
    console.error('❌ Phase 10 Media Test Failed:', error.message);
    process.exit(1);
  }
}

runPhase10MediaTest();
