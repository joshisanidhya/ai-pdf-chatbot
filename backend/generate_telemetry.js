const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:5000/api';
const EMAIL = 'jane@example.com';
const PASSWORD = 'Password123!';

async function run() {
  console.log('🚀 Starting Telemetry Generator Script...');

  let token = '';

  // 1. Register User (catch error if already registered)
  try {
    const regRes = await fetch(`${BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jane Doe',
        email: EMAIL,
        password: PASSWORD
      })
    });
    const regData = await regRes.json();
    if (regRes.status === 201) {
      console.log('✅ User registered successfully!');
      token = regData.data.token;
    } else {
      console.log(`ℹ️ Register response status: ${regRes.status}. Message: ${regData.message}`);
    }
  } catch (err) {
    console.log('ℹ️ Registration failed or already registered:', err.message);
  }

  // 2. Login User
  if (!token) {
    console.log('🔑 Logging in user...');
    const loginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD })
    });
    const loginData = await loginRes.json();
    if (loginRes.status === 200) {
      console.log('✅ Login successful!');
      token = loginData.data.token;
    } else {
      console.error('❌ Login failed:', loginData.message);
      process.exit(1);
    }
  }

  const authHeader = { 'Authorization': `Bearer ${token}` };

  // Helper function to upload document
  async function uploadDocument(filePath, customName) {
    console.log(`📤 Uploading ${customName} (${path.basename(filePath)})...`);
    const fileBuffer = fs.readFileSync(filePath);
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('pdf', fileBlob, path.basename(filePath));
    formData.append('name', customName);

    const res = await fetch(`${BACKEND_URL}/documents/upload`, {
      method: 'POST',
      headers: {
        ...authHeader
      },
      body: formData
    });

    const data = await res.json();
    if (res.status === 201) {
      console.log(`✅ Uploaded successfully! ID: ${data.data.document._id}`);
      return data.data.document._id;
    } else {
      console.log(`❌ Upload failed for ${customName}: ${data.message}`);
      return null;
    }
  }

  // Helper function to send chat message
  async function askQuestion(docId, question) {
    console.log(`💬 Asking: "${question}"`);
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeader
      },
      body: JSON.stringify({
        documentId: docId,
        question: question
      })
    });
    const data = await res.json();
    if (res.status === 200) {
      console.log(`🤖 AI: "${data.data.answer.substring(0, 100)}..." (${data.data.responseTimeMs}ms)`);
      return data.data.conversationId;
    } else {
      console.log(`❌ Chat failed: ${data.message}`);
      return null;
    }
  }

  // 3. Upload invalid PDF to generate handled error
  console.log('\n--- Test 1: Upload Invalid PDF ---');
  try {
    const invalidId = await uploadDocument('/home/sanidhya-joshi/invalid.pdf', 'invalid-doc');
  } catch (err) {
    console.log('✅ Handled expected upload error:', err.message);
  }

  // 4. Upload small PDF
  console.log('\n--- Test 2: Upload Small PDF ---');
  const smallDocId = await uploadDocument('/home/sanidhya-joshi/Striver_A2Z_15QPD_Plan.pdf', 'striver-plan');

  // 5. Upload medium PDF
  console.log('\n--- Test 3: Upload Medium PDF ---');
  const medDocId = await uploadDocument('/home/sanidhya-joshi/National Scholarships Portal 2.0.pdf', 'scholarships-info');

  // 6. Upload large PDF
  console.log('\n--- Test 4: Upload Large PDF ---');
  const largeDocId = await uploadDocument('/home/sanidhya-joshi/PM25_Research_Results_07-05-2026.pdf', 'pm25-research');

  // 7. Ask questions on small PDF
  if (smallDocId) {
    console.log('\n--- Test 5: Chatting about Small PDF ---');
    await askQuestion(smallDocId, 'What is this document about?');
    await askQuestion(smallDocId, 'Summarize the stages or schedule of the plan in 3 bullet points.');
    await askQuestion(smallDocId, 'Who is the target audience for this plan?');
    await askQuestion(smallDocId, 'Are there any resources recommended?');
  }

  // 8. Ask questions on large PDF
  if (largeDocId) {
    console.log('\n--- Test 6: Chatting about Large PDF ---');
    await askQuestion(largeDocId, 'What is the primary objective of this PM2.5 research?');
    await askQuestion(largeDocId, 'What are the main results of the PM2.5 measurements?');
    await askQuestion(largeDocId, 'Describe the study area details and environment.');
    await askQuestion(largeDocId, 'What methodology was used to measure PM2.5 in this paper?');
  }

  // 9. Trigger other handled validation and routing errors
  console.log('\n--- Test 7: Handled Validation and Route Errors ---');
  try {
    console.log('💬 Asking chat with invalid documentId...');
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ documentId: '60d5ec423d248b11c4723c34', question: 'Hello?' })
    });
    const data = await res.json();
    console.log(`status: ${res.status}, message: ${data.message}`);
  } catch (err) {
    console.log('Error calling chat:', err.message);
  }

  try {
    console.log('💬 Sending chat with validation errors (missing question)...');
    const res = await fetch(`${BACKEND_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader },
      body: JSON.stringify({ documentId: smallDocId })
    });
    const data = await res.json();
    console.log(`status: ${res.status}, message: ${data.message}`);
  } catch (err) {
    console.log('Error calling chat validation:', err.message);
  }

  console.log('\n🏁 Telemetry Generation Completed!');
}

run().catch(console.error);
