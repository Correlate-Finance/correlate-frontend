import '@testing-library/jest-dom';
import { TextDecoder as NodeTextDecoder, TextEncoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = NodeTextDecoder as typeof TextDecoder;

class ResizeObserverMock {
  observe() {
    // Mock implementation
  }
  unobserve() {
    // Mock implementation
  }
  disconnect() {
    // Mock implementation
  }
}

global.ResizeObserver = ResizeObserverMock;

Element.prototype.hasPointerCapture = () => false;
window.HTMLElement.prototype.scrollIntoView = jest.fn();
