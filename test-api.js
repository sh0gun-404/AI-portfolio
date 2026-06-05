// Script to test the Gemini hybrid Q&A and grounding logic
async function runTests() {
  const cases = [
    {
      name: 'General Query (React)',
      question: 'What is React?'
    },
    {
      name: 'Grounded Profile Query (Education)',
      question: 'Where does Shubh study?'
    },
    {
      name: 'Unknown Profile Query (Favorite Food)',
      question: 'What is Shubh\'s favorite food?'
    }
  ];

  for (const tc of cases) {
    console.log(`\n--- Running Case: ${tc.name} ---`);
    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: tc.question })
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

runTests();
