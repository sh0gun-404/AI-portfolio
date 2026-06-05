// Expanded script to test the /api/chat endpoint with different keys and questions
async function testApi() {
  const cases = [
    {
      name: 'No key provided',
      body: {
        question: 'What is React?',
        provider: 'grok'
      }
    },
    {
      name: 'Mock Grok Key provided (unrelated query)',
      body: {
        question: 'What is React?',
        customApiKey: 'xai-mockkey1234567890abcdef',
        provider: 'grok'
      }
    },
    {
      name: 'Mock Grok Key provided (about Shubh, in profile)',
      body: {
        question: 'Where does Shubh study?',
        customApiKey: 'xai-mockkey1234567890abcdef',
        provider: 'grok'
      }
    },
    {
      name: 'Mock Grok Key provided (about Shubh, not in profile)',
      body: {
        question: 'What is Shubh\'s favorite movie?',
        customApiKey: 'xai-mockkey1234567890abcdef',
        provider: 'grok'
      }
    }
  ];

  for (const tc of cases) {
    console.log(`\n--- Running Case: ${tc.name} ---`);
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tc.body)
      });

      const status = response.status;
      const data = await response.json();
      console.log(`Status: ${status}`);
      console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

testApi();
