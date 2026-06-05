const fs = require('fs');
const path = require('path');

// Colors for console output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

// Load files
const resumeData = require('./src/data/resume.json');
const tests = require('./tests.json');

// Replicate the client-side local fallback search logic to test offline grounding
function localSearch(query) {
  const q = query.toLowerCase();
  
  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('number') || q.includes('reach') || q.includes('call') || q.includes('mail')) {
    return `Contact details: Email: ${resumeData.personal.email}, Phone: ${resumeData.personal.phone}, Location: ${resumeData.personal.location}`;
  }

  if (q.includes('cgpa') || q.includes('gpa') || q.includes('grade') || q.includes('marks') || q.includes('percentage') || q.includes('education') || q.includes('bits') || q.includes('college') || q.includes('school') || q.includes('study') || q.includes('campus') || q.includes('pilani')) {
    let eduInfo = `Shubh's education: `;
    resumeData.education.forEach(edu => {
      eduInfo += `${edu.degree} at ${edu.institution} (${edu.period}) - ${edu.score}. Coursework: ${edu.coursework ? edu.coursework.join(', ') : 'None'}. `;
    });
    return eduInfo;
  }

  if (q.includes('skill') || q.includes('language') || q.includes('framework') || q.includes('tool') || q.includes('know') || q.includes('program') || q.includes('dsa') || q.includes('oop') || q.includes('java') || q.includes('c++') || q.includes('c ') || q.includes('excel')) {
    return `Skills: Programming: ${resumeData.skills.programmingLanguages.join(', ')}. Frameworks: ${resumeData.skills.frameworksAndTools.join(', ')}. Competencies: ${resumeData.skills.coreCompetencies.join(', ')}. Languages: ${resumeData.skills.languages.join(', ')}.`;
  }

  if (q.includes('project') || q.includes('work') || q.includes('develop') || q.includes('build') || q.includes('make') || q.includes('made') || q.includes('gnss') || q.includes('library') || q.includes('inventory') || q.includes('flutter') || q.includes('mysql') || q.includes('python')) {
    let projInfo = `Shubh's projects: `;
    resumeData.projects.forEach(proj => {
      projInfo += `${proj.title} (${proj.period}) - role ${proj.role}: ${proj.description}. `;
    });
    return projInfo;
  }

  if (q.includes('extracurricular') || q.includes('quark') || q.includes('coordinator') || q.includes('backstage') || q.includes('infrastructure') || q.includes('management') || q.includes('fest')) {
    let extraInfo = `Extracurriculars: `;
    resumeData.extracurriculars.forEach(item => {
      extraInfo += `${item.role} at ${item.organization} (${item.period}): ${item.description}. `;
    });
    return extraInfo;
  }

  return `I don't have that information in Shubh's profile. However, you can reach out directly to Shubh at ${resumeData.personal.email} or call ${resumeData.personal.phone} to ask him!`;
}

console.log(`${YELLOW}====================================================${RESET}`);
console.log(`${YELLOW}   AI PORTFOLIO COPILOT: GROUNDING TEST RUNNER      ${RESET}`);
console.log(`${YELLOW}====================================================${RESET}\n`);

let passedCount = 0;
let failedCount = 0;

tests.forEach((test) => {
  console.log(`Test #${test.id}: "${test.question}"`);
  console.log(`Type: ${test.type}`);
  
  const answer = localSearch(test.question);
  
  // Verify keywords are present in the response
  const missingKeywords = [];
  test.expectedKeywords.forEach((kw) => {
    const regex = new RegExp(kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
    if (!regex.test(answer)) {
      missingKeywords.push(kw);
    }
  });

  if (missingKeywords.length === 0) {
    console.log(`${GREEN}✔ PASS:${RESET} Answer contains all expected grounding keys.`);
    passedCount++;
  } else {
    console.log(`${RED}✘ FAIL:${RESET} Answer is missing key grounding references: ${JSON.stringify(missingKeywords)}`);
    console.log(`Generated Answer: "${answer}"`);
    failedCount++;
  }
  console.log('----------------------------------------------------');
});

console.log(`\n${YELLOW}TEST SUMMARY:${RESET}`);
console.log(`${GREEN}Passed: ${passedCount}${RESET}`);
console.log(`${RED}Failed: ${failedCount}${RESET}`);

const successRate = (passedCount / tests.length) * 100;
console.log(`Success Rate: ${successRate.toFixed(1)}%`);

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log(`\n${GREEN}All grounding rules successfully passed! 100% grounded in profile facts.${RESET}\n`);
  process.exit(0);
}
