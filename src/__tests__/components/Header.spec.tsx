import { render, screen, fireEvent } from '@testing-library/react';
import mockRouter from 'next-router-mock';
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';

import Header from '../../components/Header';


describe('Header', () => {
  it('should be able to render logo', () => {
    render(<Header />);

    screen.getByAltText('logo');
  });

  it('should be able to navigate to home page after a click', () => {
    render(<Header />, {
      wrapper: MemoryRouterProvider,
    });

    const secondLink = screen.getByAltText('logo');

    fireEvent.click(secondLink);

    expect(mockRouter.asPath).toEqual('/')
  });
});
