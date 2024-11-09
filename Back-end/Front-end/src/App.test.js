import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import Dashboardhome from './Dasboardhome'; // Ensure the path is correct

test('renders Dashboardhome component', () => {
  render(
    <Router>
      <Dashboardhome />
    </Router>
  );
  const linkElement = screen.getByText(/Create your custom graph/i); // Example text
  expect(linkElement).toBeInTheDocument();
});
