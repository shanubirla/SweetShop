import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SweetCard from './SweetCard';

// RED: Test SweetCard component renders
describe('SweetCard Component - TDD', () => {
  it('should render sweet card with name and price', () => {
    const sweet = {
      id: '1',
      name: 'Chocolate Cake',
      category: 'Cakes',
      price: 25.99,
      quantity: 10,
    };

    render(<SweetCard sweet={sweet} />);

    expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    expect(screen.getByText(/25.99/)).toBeInTheDocument();
  });

  it('should disable purchase button when quantity is 0', () => {
    const sweet = {
      id: '1',
      name: 'Chocolate Cake',
      category: 'Cakes',
      price: 25.99,
      quantity: 0,
    };

    render(<SweetCard sweet={sweet} />);

    const purchaseButton = screen.getByRole('button', { name: /purchase/i });
    expect(purchaseButton).toBeDisabled();
  });

  it('should show admin buttons only for admin users', () => {
    const sweet = {
      id: '1',
      name: 'Chocolate Cake',
      category: 'Cakes',
      price: 25.99,
      quantity: 10,
    };

    const { rerender } = render(<SweetCard sweet={sweet} isAdmin={false} />);
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();

    rerender(<SweetCard sweet={sweet} isAdmin={true} />);
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});
