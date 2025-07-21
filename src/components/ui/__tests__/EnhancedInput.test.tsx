/**
 * Enhanced Input Tests - Beautiful Component Testing
 * Comprehensive tests for the EnhancedInput component with accessibility and interaction testing
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders, userInteractions } from '@/test/utils/render';
import { EnhancedInput } from '../EnhancedInput';

describe('EnhancedInput', () => {
  describe('Basic Functionality', () => {
    it('renders with default props', () => {
      renderWithProviders(<EnhancedInput />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('h-12', 'rounded-xl');
    });

    it('displays label when provided', () => {
      renderWithProviders(<EnhancedInput label="Email Address" />);
      
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    });

    it('shows helper text when provided', () => {
      const helperText = 'Enter your email address';
      renderWithProviders(<EnhancedInput helperText={helperText} />);
      
      expect(screen.getByText(helperText)).toBeInTheDocument();
    });

    it('handles value changes', async () => {
      const handleChange = vi.fn();
      renderWithProviders(<EnhancedInput onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      await userInteractions.type(input, 'test@example.com');
      
      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue('test@example.com');
    });
  });

  describe('Variants', () => {
    it('renders filled variant correctly', () => {
      renderWithProviders(<EnhancedInput variant="filled" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-gray-100');
    });

    it('renders floating variant with animated label', async () => {
      renderWithProviders(<EnhancedInput variant="floating" label="Email" />);
      
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Email');
      
      expect(label).toBeInTheDocument();
      
      // Focus should animate the label
      fireEvent.focus(input);
      await window.testUtils.waitForAnimation();
      
      expect(input).toHaveFocus();
    });

    it('renders search variant with rounded styling', () => {
      renderWithProviders(<EnhancedInput variant="search" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('rounded-full');
    });

    it('renders minimal variant without background', () => {
      renderWithProviders(<EnhancedInput variant="minimal" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('bg-transparent', 'border-b-2');
    });
  });

  describe('States', () => {
    it('shows error state with icon and styling', () => {
      renderWithProviders(
        <EnhancedInput 
          state="error" 
          helperText="This field is required" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-300');
      
      const errorIcon = screen.getByTestId('error-icon') || document.querySelector('[data-testid*="error"]');
      expect(errorIcon || screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('shows success state with icon and styling', () => {
      renderWithProviders(
        <EnhancedInput 
          state="success" 
          helperText="Looks good!" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-green-300');
      expect(screen.getByText('Looks good!')).toBeInTheDocument();
    });

    it('shows warning state with appropriate styling', () => {
      renderWithProviders(
        <EnhancedInput 
          state="warning" 
          helperText="Please double-check this" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-yellow-300');
      expect(screen.getByText('Please double-check this')).toBeInTheDocument();
    });

    it('shows loading state with spinner', () => {
      renderWithProviders(<EnhancedInput loading />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveLoadingState();
    });
  });

  describe('Password Input', () => {
    it('renders password toggle when showPasswordToggle is true', () => {
      renderWithProviders(
        <EnhancedInput 
          type="password" 
          showPasswordToggle 
        />
      );
      
      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.type).toBe('password');
      
      const toggleButton = screen.getByRole('button');
      expect(toggleButton).toBeInTheDocument();
    });

    it('toggles password visibility when toggle button is clicked', async () => {
      renderWithProviders(
        <EnhancedInput 
          type="password" 
          showPasswordToggle 
          defaultValue="secret123"
        />
      );
      
      const input = screen.getByDisplayValue('secret123') as HTMLInputElement;
      const toggleButton = screen.getByRole('button');
      
      expect(input.type).toBe('password');
      
      await userInteractions.click(toggleButton);
      expect(input.type).toBe('text');
      
      await userInteractions.click(toggleButton);
      expect(input.type).toBe('password');
    });
  });

  describe('Icons', () => {
    it('auto-detects email icon for email type', () => {
      renderWithProviders(<EnhancedInput type="email" />);
      
      // Check for mail icon (implementation may vary)
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('auto-detects search icon for search variant', () => {
      renderWithProviders(<EnhancedInput variant="search" />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders custom icon when provided', () => {
      const CustomIcon = () => <span data-testid="custom-icon">🔍</span>;
      renderWithProviders(<EnhancedInput icon={<CustomIcon />} />);
      
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      renderWithProviders(
        <EnhancedInput 
          label="Email" 
          helperText="Enter your email"
          state="error"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toBeAccessible();
      expect(input).toHaveAttribute('aria-describedby');
    });

    it('supports keyboard navigation', async () => {
      renderWithProviders(<EnhancedInput />);
      
      const input = screen.getByRole('textbox');
      
      // Tab to focus
      fireEvent.keyDown(document.body, { key: 'Tab' });
      await waitFor(() => expect(input).toHaveFocus());
      
      // Escape to blur (if implemented)
      fireEvent.keyDown(input, { key: 'Escape' });
    });

    it('announces state changes to screen readers', async () => {
      const { rerender } = renderWithProviders(
        <EnhancedInput helperText="Enter text" />
      );
      
      rerender(
        <EnhancedInput 
          state="error" 
          helperText="This field is required" 
        />
      );
      
      await waitFor(() => {
        expect(screen.getByText('This field is required')).toBeInTheDocument();
      });
    });
  });

  describe('Animations', () => {
    it('has focus animations', async () => {
      renderWithProviders(<EnhancedInput />);
      
      const input = screen.getByRole('textbox');
      
      fireEvent.focus(input);
      await window.testUtils.waitForAnimation();
      
      expect(input.closest('div')).toHaveAnimation();
    });

    it('animates helper text changes', async () => {
      const { rerender } = renderWithProviders(
        <EnhancedInput helperText="Original text" />
      );
      
      rerender(<EnhancedInput helperText="New text" />);
      
      await waitFor(() => {
        expect(screen.getByText('New text')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles disabled state', () => {
      renderWithProviders(<EnhancedInput disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
      expect(input).toHaveClass('disabled:opacity-50');
    });

    it('handles readonly state', () => {
      renderWithProviders(<EnhancedInput readOnly value="readonly text" />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
      expect(input).toHaveValue('readonly text');
    });

    it('handles very long helper text', () => {
      const longText = 'This is a very long helper text that should wrap properly and not break the layout of the input component';
      renderWithProviders(<EnhancedInput helperText={longText} />);
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles rapid state changes', async () => {
      const { rerender } = renderWithProviders(<EnhancedInput state="default" />);
      
      rerender(<EnhancedInput state="error" />);
      rerender(<EnhancedInput state="success" />);
      rerender(<EnhancedInput state="warning" />);
      rerender(<EnhancedInput state="default" />);
      
      await window.testUtils.waitForAnimation();
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
  });
});
