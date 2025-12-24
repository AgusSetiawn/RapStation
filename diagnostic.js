// DIAGNOSTIC SCRIPT - Run this in browser console (F12) while on localhost:5173
// This will check if CSS variables are loading correctly

console.log('=== LIGHT MODE DIAGNOSTIC ===');
console.log('');

// 1. Check if light.css variables are defined
const rootStyles = getComputedStyle(document.documentElement);
console.log('1. CSS Variables Status:');
console.log('--surface-page:', rootStyles.getPropertyValue('--surface-page').trim() || '❌ NOT DEFINED');
console.log('--surface-card:', rootStyles.getPropertyValue('--surface-card').trim() || '❌ NOT DEFINED');
console.log('--text-primary:', rootStyles.getPropertyValue('--text-primary').trim() || '❌ NOT DEFINED');
console.log('--border-light:', rootStyles.getPropertyValue('--border-light').trim() || '❌ NOT DEFINED');
console.log('');

// 2. Check body background
const bodyBg = getComputedStyle(document.body).backgroundColor;
console.log('2. Body Background Color:', bodyBg);
console.log('Expected: rgb(226, 232, 240) which is #e2e8f0');
console.log('Match:', bodyBg === 'rgb(226, 232, 240)' ? '✅ CORRECT' : '❌ WRONG');
console.log('');

// 3. Check if page is in light or dark mode
const isDark = document.documentElement.classList.contains('dark');
console.log('3. Current Theme:', isDark ? 'Dark Mode' : 'Light Mode');
console.log('');

// 4. Check if Tailwind is processing var() correctly
const testDiv = document.createElement('div');
testDiv.className = 'bg-[var(--surface-page)]';
document.body.appendChild(testDiv);
const testBg = getComputedStyle(testDiv).backgroundColor;
document.body.removeChild(testDiv);
console.log('4. Tailwind var() Processing:');
console.log('Test element bg:', testBg);
console.log('Working:', testBg !== 'rgba(0, 0, 0, 0)' ? '✅ YES' : '❌ NO');
console.log('');

// 5. Summary
console.log('=== DIAGNOSIS ===');
if (rootStyles.getPropertyValue('--surface-page').trim() === '') {
    console.log('❌ PROBLEM: CSS variables not defined');
    console.log('   → light.css may not be loading');
    console.log('   → Check if file exists at src/styles/light.css');
    console.log('   → Check if import in index.css is correct');
} else if (testBg === 'rgba(0, 0, 0, 0)' || testBg === '') {
    console.log('❌ PROBLEM: Tailwind not processing var() syntax');
    console.log('   → Tailwind v4 may have syntax issues');
    console.log('   → Try restarting dev server');
} else if (bodyBg !== 'rgb(226, 232, 240)') {
    console.log('❌ PROBLEM: Variables defined but not applied to body');
    console.log('   → Check index.css @apply statement');
    console.log('   → Current body bg:', bodyBg);
} else {
    console.log('✅ Everything looks correct!');
    console.log('   → Try hard refresh (Ctrl+Shift+R)');
}

console.log('===================');
