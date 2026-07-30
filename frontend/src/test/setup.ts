// Vitest runs this file once before any test file. It adds extra matchers
// like `toBeInTheDocument()` on top of the plain `expect()` Vitest already
// has, so assertions about rendered HTML read naturally.
import '@testing-library/jest-dom';
