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

    test('defines Storage object', () => {
      const script = document.querySelector('script');
      expect(script.textContent).toContain('const Storage');
    });

    test('defines STORAGE_KEY constant', () => {
      const script = document.querySelector('script');
      expect(script.textContent).toContain('STORAGE_KEY');
    });

    test('defines SAMPLE_DATA with groups', () => {
      const script = document.querySelector('script');
      expect(script.textContent).toContain('SAMPLE_DATA');
      expect(script.textContent).toContain('groups');
    });
  });
});

describe('Storage Service', () => {
  let Storage;
  let STORAGE_KEY;
  let SAMPLE_DATA;

  beforeEach(() => {
    // Reset the document and execute the script
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    // Extract and evaluate the script content
    const script = document.querySelector('script');
    eval(script.textContent);

    Storage = window.Storage;
    STORAGE_KEY = window.STORAGE_KEY;
    SAMPLE_DATA = window.SAMPLE_DATA;

    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('generateId', () => {
    test('returns a string', () => {
      const id = Storage.generateId();
      expect(typeof id).toBe('string');
    });

    test('returns unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(Storage.generateId());
      }
      expect(ids.size).toBe(100);
    });

    test('ID starts with "id-" prefix', () => {
      const id = Storage.generateId();
      expect(id.startsWith('id-')).toBe(true);
    });

    test('ID has reasonable length', () => {
      const id = Storage.generateId();
      expect(id.length).toBeGreaterThan(10);
      expect(id.length).toBeLessThan(30);
    });
  });

  describe('saveData', () => {
    test('saves data to localStorage', () => {
      const testData = { groups: [{ id: 'test', name: 'Test', order: 0, bookmarks: [] }] };
      const result = Storage.saveData(testData);

      expect(result).toBe(true);
      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(testData));
    });

    test('returns true on successful save', () => {
      const result = Storage.saveData({ groups: [] });
      expect(result).toBe(true);
    });

    test('overwrites existing data', () => {
      Storage.saveData({ groups: [{ id: '1', name: 'First', order: 0, bookmarks: [] }] });
      Storage.saveData({ groups: [{ id: '2', name: 'Second', order: 0, bookmarks: [] }] });

      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(stored.groups.length).toBe(1);
      expect(stored.groups[0].name).toBe('Second');
    });
  });

  describe('loadData', () => {
    test('returns saved data from localStorage', () => {
      const testData = { groups: [{ id: 'test', name: 'Test Group', order: 0, bookmarks: [] }] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(testData));

      const loaded = Storage.loadData();
      expect(loaded).toEqual(testData);
    });

    test('initializes with sample data if localStorage is empty', () => {
      const loaded = Storage.loadData();

      expect(loaded).toEqual(SAMPLE_DATA);
      // Also verify it was saved to localStorage
      expect(localStorage.getItem(STORAGE_KEY)).toBe(JSON.stringify(SAMPLE_DATA));
    });

    test('sample data has correct structure', () => {
      const loaded = Storage.loadData();

      expect(loaded).toHaveProperty('groups');
      expect(Array.isArray(loaded.groups)).toBe(true);
      expect(loaded.groups.length).toBeGreaterThan(0);

      const firstGroup = loaded.groups[0];
      expect(firstGroup).toHaveProperty('id');
      expect(firstGroup).toHaveProperty('name');
      expect(firstGroup).toHaveProperty('order');
      expect(firstGroup).toHaveProperty('bookmarks');
      expect(Array.isArray(firstGroup.bookmarks)).toBe(true);
    });

    test('sample bookmarks have correct structure', () => {
      const loaded = Storage.loadData();
      const bookmark = loaded.groups[0].bookmarks[0];

      expect(bookmark).toHaveProperty('id');
      expect(bookmark).toHaveProperty('title');
      expect(bookmark).toHaveProperty('url');
      expect(bookmark).toHaveProperty('order');
      expect(bookmark.url.startsWith('https://')).toBe(true);
    });

    test('returns empty groups array on parse error', () => {
      localStorage.setItem(STORAGE_KEY, 'invalid json{');

      const loaded = Storage.loadData();
      expect(loaded).toEqual({ groups: [] });
    });
  });

  describe('Sample Data', () => {
    test('contains Development group', () => {
      const devGroup = SAMPLE_DATA.groups.find(g => g.name === 'Development');
      expect(devGroup).toBeDefined();
      expect(devGroup.bookmarks.length).toBeGreaterThan(0);
    });

    test('contains Social group', () => {
      const socialGroup = SAMPLE_DATA.groups.find(g => g.name === 'Social');
      expect(socialGroup).toBeDefined();
    });

    test('contains News group', () => {
      const newsGroup = SAMPLE_DATA.groups.find(g => g.name === 'News');
      expect(newsGroup).toBeDefined();
    });

    test('groups have sequential order values', () => {
      const orders = SAMPLE_DATA.groups.map(g => g.order).sort((a, b) => a - b);
      for (let i = 0; i < orders.length; i++) {
        expect(orders[i]).toBe(i);
      }
    });

    test('bookmarks within groups have sequential order values', () => {
      SAMPLE_DATA.groups.forEach(group => {
        const orders = group.bookmarks.map(b => b.order).sort((a, b) => a - b);
        for (let i = 0; i < orders.length; i++) {
          expect(orders[i]).toBe(i);
        }
      });
    });
  });
});
