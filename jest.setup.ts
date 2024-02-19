import '@testing-library/jest-dom';
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
