// __mocks__/react-router-dom.js
const React = require('react');

module.exports = {
  useNavigate: () => jest.fn(),
  MemoryRouter: ({ children }) => <>{children}</>,
  BrowserRouter: ({ children }) => <>{children}</>,
  Routes: ({ children }) => <>{children}</>,
  Route: () => null,
};
