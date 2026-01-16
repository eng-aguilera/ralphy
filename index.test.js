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

describe('Renderer', () => {
  let Renderer;
  let SAMPLE_DATA;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    Renderer = window.Renderer;
    SAMPLE_DATA = window.SAMPLE_DATA;
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('getFaviconUrl', () => {
    test('returns Google favicon URL for valid URL', () => {
      const faviconUrl = Renderer.getFaviconUrl('https://github.com');
      expect(faviconUrl).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=32');
    });

    test('extracts hostname from URL with path', () => {
      const faviconUrl = Renderer.getFaviconUrl('https://example.com/some/path');
      expect(faviconUrl).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=32');
    });

    test('handles URL with subdomain', () => {
      const faviconUrl = Renderer.getFaviconUrl('https://news.ycombinator.com');
      expect(faviconUrl).toBe('https://www.google.com/s2/favicons?domain=news.ycombinator.com&sz=32');
    });

    test('returns fallback for invalid URL', () => {
      const faviconUrl = Renderer.getFaviconUrl('not-a-valid-url');
      expect(faviconUrl).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=32');
    });
  });

  describe('createBookmarkElement', () => {
    const testBookmark = {
      id: 'test-bookmark-1',
      title: 'Test Site',
      url: 'https://test.com',
      order: 0
    };

    test('returns an anchor element', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      expect(element.tagName.toLowerCase()).toBe('a');
    });

    test('has correct href', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      expect(element.href).toBe('https://test.com/');
    });

    test('has bookmark-item class', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      expect(element.classList.contains('bookmark-item')).toBe(true);
    });

    test('opens in new tab', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      expect(element.target).toBe('_blank');
      expect(element.rel).toBe('noopener noreferrer');
    });

    test('has data-id attribute', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      expect(element.dataset.id).toBe('test-bookmark-1');
    });

    test('contains favicon image', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      const favicon = element.querySelector('.bookmark-favicon');
      expect(favicon).not.toBeNull();
      expect(favicon.tagName.toLowerCase()).toBe('img');
      expect(favicon.src).toContain('google.com/s2/favicons');
    });

    test('favicon has lazy loading', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      const favicon = element.querySelector('.bookmark-favicon');
      expect(favicon.loading).toBe('lazy');
    });

    test('contains title', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      const title = element.querySelector('.bookmark-title');
      expect(title).not.toBeNull();
      expect(title.textContent).toBe('Test Site');
    });

    test('contains edit and delete buttons', () => {
      const element = Renderer.createBookmarkElement(testBookmark);
      const actions = element.querySelector('.bookmark-actions');
      expect(actions).not.toBeNull();

      const editBtn = actions.querySelector('[data-action="edit"]');
      expect(editBtn).not.toBeNull();
      expect(editBtn.dataset.id).toBe('test-bookmark-1');

      const deleteBtn = actions.querySelector('[data-action="delete"]');
      expect(deleteBtn).not.toBeNull();
      expect(deleteBtn.dataset.id).toBe('test-bookmark-1');
    });
  });

  describe('createGroupElement', () => {
    const testGroup = {
      id: 'test-group-1',
      name: 'Test Group',
      order: 0,
      bookmarks: [
        { id: 'bm-1', title: 'Site A', url: 'https://a.com', order: 1 },
        { id: 'bm-2', title: 'Site B', url: 'https://b.com', order: 0 }
      ]
    };

    test('returns a div element', () => {
      const element = Renderer.createGroupElement(testGroup);
      expect(element.tagName.toLowerCase()).toBe('div');
    });

    test('has group-card class', () => {
      const element = Renderer.createGroupElement(testGroup);
      expect(element.classList.contains('group-card')).toBe(true);
    });

    test('has data-id attribute', () => {
      const element = Renderer.createGroupElement(testGroup);
      expect(element.dataset.id).toBe('test-group-1');
    });

    test('contains group header with title', () => {
      const element = Renderer.createGroupElement(testGroup);
      const header = element.querySelector('.group-header');
      expect(header).not.toBeNull();

      const title = header.querySelector('.group-title');
      expect(title).not.toBeNull();
      expect(title.textContent).toBe('Test Group');
    });

    test('contains edit and delete group buttons', () => {
      const element = Renderer.createGroupElement(testGroup);
      const actions = element.querySelector('.group-actions');
      expect(actions).not.toBeNull();

      const editBtn = actions.querySelector('[data-action="edit-group"]');
      expect(editBtn).not.toBeNull();
      expect(editBtn.dataset.id).toBe('test-group-1');

      const deleteBtn = actions.querySelector('[data-action="delete-group"]');
      expect(deleteBtn).not.toBeNull();
      expect(deleteBtn.dataset.id).toBe('test-group-1');
    });

    test('contains bookmarks list', () => {
      const element = Renderer.createGroupElement(testGroup);
      const bookmarksList = element.querySelector('.bookmarks-list');
      expect(bookmarksList).not.toBeNull();
    });

    test('renders bookmarks sorted by order', () => {
      const element = Renderer.createGroupElement(testGroup);
      const bookmarks = element.querySelectorAll('.bookmark-item');
      expect(bookmarks.length).toBe(2);
      // Site B has order 0, Site A has order 1
      expect(bookmarks[0].querySelector('.bookmark-title').textContent).toBe('Site B');
      expect(bookmarks[1].querySelector('.bookmark-title').textContent).toBe('Site A');
    });

    test('shows empty state for group with no bookmarks', () => {
      const emptyGroup = { id: 'empty', name: 'Empty', order: 0, bookmarks: [] };
      const element = Renderer.createGroupElement(emptyGroup);
      const emptyState = element.querySelector('.empty-state');
      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toBe('No bookmarks yet');
    });
  });

  describe('render', () => {
    test('renders groups to container', () => {
      Renderer.render(SAMPLE_DATA);
      const container = document.getElementById('groups-container');
      const groups = container.querySelectorAll('.group-card');
      expect(groups.length).toBe(SAMPLE_DATA.groups.length);
    });

    test('renders groups sorted by order', () => {
      Renderer.render(SAMPLE_DATA);
      const container = document.getElementById('groups-container');
      const titles = container.querySelectorAll('.group-title');
      // SAMPLE_DATA has Development (0), Social (1), News (2)
      expect(titles[0].textContent).toBe('Development');
      expect(titles[1].textContent).toBe('Social');
      expect(titles[2].textContent).toBe('News');
    });

    test('renders bookmarks within groups', () => {
      Renderer.render(SAMPLE_DATA);
      const container = document.getElementById('groups-container');
      const bookmarks = container.querySelectorAll('.bookmark-item');
      const totalBookmarks = SAMPLE_DATA.groups.reduce((sum, g) => sum + g.bookmarks.length, 0);
      expect(bookmarks.length).toBe(totalBookmarks);
    });

    test('shows empty state when no groups', () => {
      Renderer.render({ groups: [] });
      const container = document.getElementById('groups-container');
      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toContain('No bookmark groups yet');
    });

    test('shows empty state for null data', () => {
      Renderer.render(null);
      const container = document.getElementById('groups-container');
      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).not.toBeNull();
    });

    test('clears container before rendering', () => {
      const container = document.getElementById('groups-container');
      container.innerHTML = '<div class="old-content">Old</div>';

      Renderer.render(SAMPLE_DATA);

      expect(container.querySelector('.old-content')).toBeNull();
      expect(container.querySelectorAll('.group-card').length).toBe(SAMPLE_DATA.groups.length);
    });

    test('renders favicons with Google favicon service URL', () => {
      Renderer.render(SAMPLE_DATA);
      const container = document.getElementById('groups-container');
      const favicons = container.querySelectorAll('.bookmark-favicon');
      favicons.forEach(favicon => {
        expect(favicon.src).toContain('https://www.google.com/s2/favicons');
      });
    });
  });
});
