import { slugify } from './slugify';

// Test cases
const testCases = [
  { input: 'patrón de diseño', expected: 'patron-de-diseno' },
  { input: 'JavaScript', expected: 'javascript' },
  { input: 'React.js', expected: 'reactjs' },
  { input: 'C++', expected: 'c' },
  { input: 'Node.js & Express', expected: 'nodejs-express' },
  { input: '¡Hola Mundo!', expected: 'hola-mundo' },
  { input: 'Programación Orientada a Objetos', expected: 'programacion-orientada-a-objetos' },
  { input: '  spaces  ', expected: 'spaces' },
];

// Run tests
console.log('Testing slugify function:');
testCases.forEach(({ input, expected }) => {
  const result = slugify(input);
  const passed = result === expected;
  console.log(`"${input}" -> "${result}" ${passed ? '✓' : `✗ (expected "${expected}")`}`);
});