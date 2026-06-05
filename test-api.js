// Simple script to test the /api/chat endpoint
async function testApi() {
  console.log('Sending request to /api/chat with no key...');
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What projects has Shubh worked on?',
        provider: 'grok'
      })
    });

    const status = response.status;
    const data = await response.json();
    console.log(`Status: ${status}`);
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (status === 400 && data.error && data.error.includes('API Key is missing')) {
      console.log('✔ PASS: Missing key correctly triggers 400 error.');
    } else {
      console.log('✘ FAIL: Expected 400 with missing key error.');
    }
  } catch (error) {
    console.error('Error during test:', error);
  }
}

testApi();
