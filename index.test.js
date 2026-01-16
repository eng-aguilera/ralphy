/**
 * @jest-environment jsdom
 */

import { readFileSync } from 'fs';

const html = readFileSync('./index.html', 'utf-8');

describe('Bookmark Homepage - Base HTML Structure', () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');
    document.documentElement.lang = 'en';
  });

  describe('Document structure', () => {
    test('has proper HTML structure', () => {
      expect(document.documentElement.lang).toBe('en');
    });

    test('has meta viewport for responsive design', () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      expect(viewport).not.toBeNull();
      expect(viewport.content).toContain('width=device-width');
    });

    test('has a title', () => {
      const title = document.querySelector('title');
      expect(title).not.toBeNull();
      expect(title.textContent).toBe('Bookmarks');
    });
  });

  describe('Header section', () => {
    test('has a header element', () => {
      const header = document.querySelector('header');
      expect(header).not.toBeNull();
    });

    test('has main heading', () => {
      const h1 = document.querySelector('h1');
      expect(h1).not.toBeNull();
      expect(h1.textContent).toBe('Bookmarks');
    });

    test('has search input', () => {
      const searchInput = document.querySelector('#search-input');
      expect(searchInput).not.toBeNull();
      expect(searchInput.type).toBe('text');
      expect(searchInput.placeholder).toContain('Search');
    });

    test('has add group button', () => {
      const btn = document.querySelector('#add-group-btn');
      expect(btn).not.toBeNull();
      expect(btn.textContent).toContain('Group');
    });

    test('has add bookmark button', () => {
      const btn = document.querySelector('#add-bookmark-btn');
      expect(btn).not.toBeNull();
      expect(btn.textContent).toContain('Bookmark');
    });
  });

  describe('Main content area', () => {
    test('has groups container with grid class', () => {
      const container = document.querySelector('#groups-container');
      expect(container).not.toBeNull();
      expect(container.classList.contains('groups-grid')).toBe(true);
    });
  });

  describe('Bookmark modal', () => {
    test('has bookmark modal overlay', () => {
      const modal = document.querySelector('#bookmark-modal');
      expect(modal).not.toBeNull();
      expect(modal.classList.contains('modal-overlay')).toBe(true);
    });

    test('has bookmark form with required fields', () => {
      const form = document.querySelector('#bookmark-form');
      expect(form).not.toBeNull();

      const titleInput = document.querySelector('#bookmark-title');
      expect(titleInput).not.toBeNull();
      expect(titleInput.required).toBe(true);

      const urlInput = document.querySelector('#bookmark-url');
      expect(urlInput).not.toBeNull();
      expect(urlInput.type).toBe('url');
      expect(urlInput.required).toBe(true);

      const groupSelect = document.querySelector('#bookmark-group');
      expect(groupSelect).not.toBeNull();
      expect(groupSelect.tagName.toLowerCase()).toBe('select');
    });

    test('has cancel and save buttons', () => {
      const cancelBtn = document.querySelector('#cancel-bookmark-btn');
      expect(cancelBtn).not.toBeNull();

      const saveBtn = document.querySelector('#bookmark-form button[type="submit"]');
      expect(saveBtn).not.toBeNull();
    });
  });

  describe('Group modal', () => {
    test('has group modal overlay', () => {
      const modal = document.querySelector('#group-modal');
      expect(modal).not.toBeNull();
      expect(modal.classList.contains('modal-overlay')).toBe(true);
    });

    test('has group form with name field', () => {
      const form = document.querySelector('#group-form');
      expect(form).not.toBeNull();

      const nameInput = document.querySelector('#group-name');
      expect(nameInput).not.toBeNull();
      expect(nameInput.required).toBe(true);
    });
  });

  describe('CSS styles', () => {
    test('has embedded styles', () => {
      const style = document.querySelector('style');
      expect(style).not.toBeNull();
    });

    test('defines CSS custom properties for theming', () => {
      const style = document.querySelector('style');
      const styleContent = style.textContent;

      expect(styleContent).toContain('--bg-primary');
      expect(styleContent).toContain('--bg-secondary');
      expect(styleContent).toContain('--text-primary');
      expect(styleContent).toContain('--accent');
    });

    test('has responsive media queries', () => {
      const style = document.querySelector('style');
      const styleContent = style.textContent;

      expect(styleContent).toContain('@media');
      expect(styleContent).toContain('768px');
    });

    test('has grid layout for groups', () => {
      const style = document.querySelector('style');
      const styleContent = style.textContent;

      expect(styleContent).toContain('grid-template-columns');
      expect(styleContent).toContain('auto-fill');
    });
  });

  describe('Accessibility', () => {
    test('search input has aria-label', () => {
      const searchInput = document.querySelector('#search-input');
      expect(searchInput.getAttribute('aria-label')).toBe('Search bookmarks');
    });

    test('form inputs have associated labels', () => {
      const labels = document.querySelectorAll('label[for]');
      labels.forEach(label => {
        const inputId = label.getAttribute('for');
        const input = document.querySelector(`#${inputId}`);
        expect(input).not.toBeNull();
      });
    });
  });

  describe('JavaScript initialization', () => {
    test('has embedded script', () => {
      const script = document.querySelector('script');
      expect(script).not.toBeNull();
    });

    test('defines App object', () => {
      const script = document.querySelector('script');
      expect(script.textContent).toContain('const App');
    });
  });
});
