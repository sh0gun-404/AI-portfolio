// Simple script to test the /api/chat endpoint for Gemini
async function testApi() {
  console.log('Sending request to /api/chat...');
  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: 'What is React?'
      })
    });

    const status = response.status;
    const data = await response.json();
    console.log(`Status: ${status}`);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (status === 400 && data.error && data.error.includes('Gemini API Key is missing')) {
      console.log('✔ PASS: Missing Gemini API Key correctly triggers 400 error.');
    } else if (status === 500 && data.error && data.error.includes('API key not valid')) {
      console.log('✔ PASS: Invalid Gemini API Key triggers authentication error.');
    } else {
      console.log('Test complete. Review response above.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();
