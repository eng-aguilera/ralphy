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

describe('BookmarkModal', () => {
  let BookmarkModal;
  let App;
  let SAMPLE_DATA;
  let STORAGE_KEY;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    BookmarkModal = window.BookmarkModal;
    App = window.App;
    SAMPLE_DATA = window.SAMPLE_DATA;
    STORAGE_KEY = window.STORAGE_KEY;
    localStorage.clear();

    // Initialize the app to set up data and modal
    App.init();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('isValidUrl', () => {
    test('returns true for valid https URL', () => {
      expect(BookmarkModal.isValidUrl('https://example.com')).toBe(true);
    });

    test('returns true for valid http URL', () => {
      expect(BookmarkModal.isValidUrl('http://example.com')).toBe(true);
    });

    test('returns true for URL with path', () => {
      expect(BookmarkModal.isValidUrl('https://example.com/path/to/page')).toBe(true);
    });

    test('returns true for URL with query params', () => {
      expect(BookmarkModal.isValidUrl('https://example.com?query=value')).toBe(true);
    });

    test('returns false for URL without protocol', () => {
      expect(BookmarkModal.isValidUrl('example.com')).toBe(false);
    });

    test('returns false for empty string', () => {
      expect(BookmarkModal.isValidUrl('')).toBe(false);
    });

    test('returns false for random string', () => {
      expect(BookmarkModal.isValidUrl('not a url')).toBe(false);
    });

    test('returns false for ftp protocol', () => {
      expect(BookmarkModal.isValidUrl('ftp://example.com')).toBe(false);
    });

    test('returns false for javascript protocol', () => {
      expect(BookmarkModal.isValidUrl('javascript:alert(1)')).toBe(false);
    });
  });

  describe('populateGroups', () => {
    test('populates select with group options', () => {
      BookmarkModal.populateGroups(SAMPLE_DATA);
      const options = BookmarkModal.groupSelect.querySelectorAll('option');
      expect(options.length).toBe(SAMPLE_DATA.groups.length);
    });

    test('option values are group IDs', () => {
      BookmarkModal.populateGroups(SAMPLE_DATA);
      const options = BookmarkModal.groupSelect.querySelectorAll('option');
      SAMPLE_DATA.groups.forEach((group, i) => {
        expect(options[i].value).toBe(group.id);
      });
    });

    test('option text is group name', () => {
      BookmarkModal.populateGroups(SAMPLE_DATA);
      const options = BookmarkModal.groupSelect.querySelectorAll('option');
      SAMPLE_DATA.groups.forEach((group, i) => {
        expect(options[i].textContent).toBe(group.name);
      });
    });

    test('selects specified group when provided', () => {
      const groupId = SAMPLE_DATA.groups[1].id;
      BookmarkModal.populateGroups(SAMPLE_DATA, groupId);
      expect(BookmarkModal.groupSelect.value).toBe(groupId);
    });

    test('shows disabled option when no groups', () => {
      BookmarkModal.populateGroups({ groups: [] });
      const options = BookmarkModal.groupSelect.querySelectorAll('option');
      expect(options.length).toBe(1);
      expect(options[0].disabled).toBe(true);
      expect(options[0].textContent).toContain('No groups');
    });

    test('handles null data gracefully', () => {
      expect(() => BookmarkModal.populateGroups(null)).not.toThrow();
    });
  });

  describe('open', () => {
    test('adds active class to modal', () => {
      BookmarkModal.open();
      expect(BookmarkModal.modal.classList.contains('active')).toBe(true);
    });

    test('sets modal title to Add Bookmark', () => {
      BookmarkModal.open();
      expect(BookmarkModal.modalTitle.textContent).toBe('Add Bookmark');
    });

    test('clears form fields', () => {
      BookmarkModal.titleInput.value = 'test';
      BookmarkModal.urlInput.value = 'https://test.com';
      BookmarkModal.open();
      expect(BookmarkModal.titleInput.value).toBe('');
      expect(BookmarkModal.urlInput.value).toBe('');
    });

    test('clears hidden id field', () => {
      BookmarkModal.idInput.value = 'some-id';
      BookmarkModal.open();
      expect(BookmarkModal.idInput.value).toBe('');
    });

    test('populates group selector', () => {
      BookmarkModal.open();
      const options = BookmarkModal.groupSelect.querySelectorAll('option');
      expect(options.length).toBe(App.data.groups.length);
    });

    test('pre-selects group when groupId is provided', () => {
      const groupId = App.data.groups[2].id;
      BookmarkModal.open(groupId);
      expect(BookmarkModal.groupSelect.value).toBe(groupId);
    });
  });

  describe('close', () => {
    test('removes active class from modal', () => {
      BookmarkModal.open();
      BookmarkModal.close();
      expect(BookmarkModal.modal.classList.contains('active')).toBe(false);
    });

    test('resets form', () => {
      BookmarkModal.titleInput.value = 'test';
      BookmarkModal.urlInput.value = 'https://test.com';
      BookmarkModal.close();
      expect(BookmarkModal.titleInput.value).toBe('');
      expect(BookmarkModal.urlInput.value).toBe('');
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      BookmarkModal.open();
    });

    test('creates new bookmark with correct data', () => {
      const groupId = App.data.groups[0].id;
      const initialCount = App.data.groups[0].bookmarks.length;

      BookmarkModal.titleInput.value = 'New Site';
      BookmarkModal.urlInput.value = 'https://newsite.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      let preventDefaultCalled = false;
      event.preventDefault = () => { preventDefaultCalled = true; };
      BookmarkModal.handleSubmit(event);

      expect(preventDefaultCalled).toBe(true);
      expect(App.data.groups[0].bookmarks.length).toBe(initialCount + 1);

      const newBookmark = App.data.groups[0].bookmarks[initialCount];
      expect(newBookmark.title).toBe('New Site');
      expect(newBookmark.url).toBe('https://newsite.com');
    });

    test('assigns correct order to new bookmark', () => {
      const groupId = App.data.groups[0].id;
      const existingOrders = App.data.groups[0].bookmarks.map(b => b.order);
      const maxOrder = Math.max(...existingOrders);

      BookmarkModal.titleInput.value = 'Another Site';
      BookmarkModal.urlInput.value = 'https://another.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const newBookmark = App.data.groups[0].bookmarks[App.data.groups[0].bookmarks.length - 1];
      expect(newBookmark.order).toBe(maxOrder + 1);
    });

    test('generates unique ID for new bookmark', () => {
      const groupId = App.data.groups[0].id;
      const existingIds = App.data.groups[0].bookmarks.map(b => b.id);

      BookmarkModal.titleInput.value = 'Unique Site';
      BookmarkModal.urlInput.value = 'https://unique.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const newBookmark = App.data.groups[0].bookmarks[App.data.groups[0].bookmarks.length - 1];
      expect(existingIds).not.toContain(newBookmark.id);
      expect(newBookmark.id).toMatch(/^id-/);
    });

    test('saves data to localStorage', () => {
      const groupId = App.data.groups[0].id;

      BookmarkModal.titleInput.value = 'Saved Site';
      BookmarkModal.urlInput.value = 'https://saved.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const savedBookmark = storedData.groups[0].bookmarks.find(b => b.title === 'Saved Site');
      expect(savedBookmark).toBeDefined();
    });

    test('closes modal after successful submission', () => {
      const groupId = App.data.groups[0].id;

      BookmarkModal.titleInput.value = 'Close Test';
      BookmarkModal.urlInput.value = 'https://closetest.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      expect(BookmarkModal.modal.classList.contains('active')).toBe(false);
    });

    test('does not submit with invalid URL', () => {
      const groupId = App.data.groups[0].id;
      const initialCount = App.data.groups[0].bookmarks.length;

      BookmarkModal.titleInput.value = 'Invalid Site';
      BookmarkModal.urlInput.value = 'not-a-valid-url';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      expect(App.data.groups[0].bookmarks.length).toBe(initialCount);
    });

    test('trims whitespace from title and URL', () => {
      const groupId = App.data.groups[0].id;

      BookmarkModal.titleInput.value = '  Trimmed Title  ';
      BookmarkModal.urlInput.value = '  https://trimmed.com  ';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const newBookmark = App.data.groups[0].bookmarks[App.data.groups[0].bookmarks.length - 1];
      expect(newBookmark.title).toBe('Trimmed Title');
      expect(newBookmark.url).toBe('https://trimmed.com');
    });

    test('adds bookmark to correct group', () => {
      const targetGroup = App.data.groups[1];
      const initialCount = targetGroup.bookmarks.length;

      BookmarkModal.titleInput.value = 'Group Test';
      BookmarkModal.urlInput.value = 'https://grouptest.com';
      BookmarkModal.groupSelect.value = targetGroup.id;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      expect(targetGroup.bookmarks.length).toBe(initialCount + 1);
      expect(targetGroup.bookmarks[initialCount].title).toBe('Group Test');
    });
  });

  describe('event bindings', () => {
    test('cancel button closes modal', () => {
      BookmarkModal.open();
      const cancelBtn = document.getElementById('cancel-bookmark-btn');
      cancelBtn.click();
      expect(BookmarkModal.modal.classList.contains('active')).toBe(false);
    });

    test('clicking overlay closes modal', () => {
      BookmarkModal.open();
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: BookmarkModal.modal });
      BookmarkModal.modal.dispatchEvent(clickEvent);
      expect(BookmarkModal.modal.classList.contains('active')).toBe(false);
    });

    test('clicking inside modal does not close it', () => {
      BookmarkModal.open();
      const modalContent = BookmarkModal.modal.querySelector('.modal');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: modalContent });
      BookmarkModal.modal.dispatchEvent(clickEvent);
      expect(BookmarkModal.modal.classList.contains('active')).toBe(true);
    });

    test('add bookmark button opens modal', () => {
      const addBtn = document.getElementById('add-bookmark-btn');
      addBtn.click();
      expect(BookmarkModal.modal.classList.contains('active')).toBe(true);
    });
  });

  describe('rendering after submission', () => {
    test('new bookmark appears in DOM after submission', () => {
      const groupId = App.data.groups[0].id;

      BookmarkModal.open();
      BookmarkModal.titleInput.value = 'DOM Test Site';
      BookmarkModal.urlInput.value = 'https://domtest.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const container = document.getElementById('groups-container');
      const bookmarkTitles = container.querySelectorAll('.bookmark-title');
      const titles = Array.from(bookmarkTitles).map(el => el.textContent);
      expect(titles).toContain('DOM Test Site');
    });
  });

  describe('openForEdit', () => {
    test('adds active class to modal', () => {
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      BookmarkModal.openForEdit(bookmarkId);
      expect(BookmarkModal.modal.classList.contains('active')).toBe(true);
    });

    test('sets modal title to Edit Bookmark', () => {
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      BookmarkModal.openForEdit(bookmarkId);
      expect(BookmarkModal.modalTitle.textContent).toBe('Edit Bookmark');
    });

    test('pre-fills form with bookmark data', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      BookmarkModal.openForEdit(bookmark.id);
      expect(BookmarkModal.titleInput.value).toBe(bookmark.title);
      expect(BookmarkModal.urlInput.value).toBe(bookmark.url);
    });

    test('sets hidden id field to bookmark id', () => {
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      BookmarkModal.openForEdit(bookmarkId);
      expect(BookmarkModal.idInput.value).toBe(bookmarkId);
    });

    test('selects the correct group in dropdown', () => {
      const groupId = App.data.groups[0].id;
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      BookmarkModal.openForEdit(bookmarkId);
      expect(BookmarkModal.groupSelect.value).toBe(groupId);
    });

    test('handles bookmark from different group', () => {
      const groupId = App.data.groups[1].id;
      const bookmark = App.data.groups[1].bookmarks[0];
      BookmarkModal.openForEdit(bookmark.id);
      expect(BookmarkModal.groupSelect.value).toBe(groupId);
      expect(BookmarkModal.titleInput.value).toBe(bookmark.title);
    });

    test('does not open modal for non-existent bookmark', () => {
      // Mock alert to avoid actual alert popup
      const originalAlert = window.alert;
      let alertMessage = null;
      window.alert = (msg) => { alertMessage = msg; };

      BookmarkModal.openForEdit('non-existent-id');

      expect(alertMessage).toBe('Bookmark not found.');
      window.alert = originalAlert;
    });
  });

  describe('handleSubmit for editing', () => {
    test('updates existing bookmark title and url', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const originalId = bookmark.id;
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Updated Title';
      BookmarkModal.urlInput.value = 'https://updated.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const updatedBookmark = App.data.groups[0].bookmarks.find(b => b.id === originalId);
      expect(updatedBookmark.title).toBe('Updated Title');
      expect(updatedBookmark.url).toBe('https://updated.com');
    });

    test('preserves bookmark id when editing', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const originalId = bookmark.id;
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Changed Title';
      BookmarkModal.urlInput.value = 'https://changed.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const updatedBookmark = App.data.groups[0].bookmarks.find(b => b.id === originalId);
      expect(updatedBookmark).toBeDefined();
      expect(updatedBookmark.id).toBe(originalId);
    });

    test('preserves bookmark order when editing in same group', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const originalOrder = bookmark.order;
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Order Preserved';
      BookmarkModal.urlInput.value = 'https://order.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const updatedBookmark = App.data.groups[0].bookmarks.find(b => b.id === bookmark.id);
      expect(updatedBookmark.order).toBe(originalOrder);
    });

    test('moves bookmark to different group', () => {
      const sourceGroup = App.data.groups[0];
      const targetGroup = App.data.groups[1];
      const bookmark = sourceGroup.bookmarks[0];
      const originalCount = sourceGroup.bookmarks.length;
      const targetOriginalCount = targetGroup.bookmarks.length;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Moved Bookmark';
      BookmarkModal.urlInput.value = 'https://moved.com';
      BookmarkModal.groupSelect.value = targetGroup.id;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      expect(sourceGroup.bookmarks.length).toBe(originalCount - 1);
      expect(targetGroup.bookmarks.length).toBe(targetOriginalCount + 1);
      expect(targetGroup.bookmarks.find(b => b.id === bookmark.id)).toBeDefined();
    });

    test('assigns new order when moving to different group', () => {
      const sourceGroup = App.data.groups[0];
      const targetGroup = App.data.groups[1];
      const bookmark = sourceGroup.bookmarks[0];
      const maxOrderInTarget = targetGroup.bookmarks.length > 0
        ? Math.max(...targetGroup.bookmarks.map(b => b.order))
        : -1;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'New Order';
      BookmarkModal.urlInput.value = 'https://neworder.com';
      BookmarkModal.groupSelect.value = targetGroup.id;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const movedBookmark = targetGroup.bookmarks.find(b => b.id === bookmark.id);
      expect(movedBookmark.order).toBe(maxOrderInTarget + 1);
    });

    test('saves updated data to localStorage', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Saved Edit';
      BookmarkModal.urlInput.value = 'https://savededit.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const savedBookmark = storedData.groups[0].bookmarks.find(b => b.id === bookmark.id);
      expect(savedBookmark.title).toBe('Saved Edit');
      expect(savedBookmark.url).toBe('https://savededit.com');
    });

    test('closes modal after successful edit', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Close After Edit';
      BookmarkModal.urlInput.value = 'https://closeedit.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      expect(BookmarkModal.modal.classList.contains('active')).toBe(false);
    });

    test('validates URL when editing', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const originalUrl = bookmark.url;
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'Invalid URL Edit';
      BookmarkModal.urlInput.value = 'not-a-valid-url';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      // URL should not have changed
      const unchangedBookmark = App.data.groups[0].bookmarks.find(b => b.id === bookmark.id);
      expect(unchangedBookmark.url).toBe(originalUrl);
    });

    test('updates DOM after editing', () => {
      const bookmark = App.data.groups[0].bookmarks[0];
      const groupId = App.data.groups[0].id;

      BookmarkModal.openForEdit(bookmark.id);
      BookmarkModal.titleInput.value = 'DOM Updated Title';
      BookmarkModal.urlInput.value = 'https://domupdated.com';
      BookmarkModal.groupSelect.value = groupId;

      const event = new Event('submit');
      event.preventDefault = () => {};
      BookmarkModal.handleSubmit(event);

      const container = document.getElementById('groups-container');
      const bookmarkTitles = container.querySelectorAll('.bookmark-title');
      const titles = Array.from(bookmarkTitles).map(el => el.textContent);
      expect(titles).toContain('DOM Updated Title');
    });
  });

  describe('edit button event delegation', () => {
    test('edit button click opens modal for editing', () => {
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      const editBtn = document.querySelector(`[data-action="edit"][data-id="${bookmarkId}"]`);

      expect(editBtn).not.toBeNull();
      editBtn.click();

      expect(BookmarkModal.modal.classList.contains('active')).toBe(true);
      expect(BookmarkModal.idInput.value).toBe(bookmarkId);
      expect(BookmarkModal.modalTitle.textContent).toBe('Edit Bookmark');
    });

    test('edit button click prevents navigation', () => {
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      const editBtn = document.querySelector(`[data-action="edit"][data-id="${bookmarkId}"]`);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      let defaultPrevented = false;
      clickEvent.preventDefault = () => { defaultPrevented = true; };

      editBtn.dispatchEvent(clickEvent);

      expect(defaultPrevented).toBe(true);
    });
  });
});

describe('GroupModal', () => {
  let GroupModal;
  let App;
  let STORAGE_KEY;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    GroupModal = window.GroupModal;
    App = window.App;
    STORAGE_KEY = window.STORAGE_KEY;
    localStorage.clear();

    // Initialize the app to set up data and modal
    App.init();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('init', () => {
    test('initializes modal reference', () => {
      expect(GroupModal.modal).toBe(document.getElementById('group-modal'));
    });

    test('initializes form reference', () => {
      expect(GroupModal.form).toBe(document.getElementById('group-form'));
    });

    test('initializes nameInput reference', () => {
      expect(GroupModal.nameInput).toBe(document.getElementById('group-name'));
    });

    test('initializes idInput reference', () => {
      expect(GroupModal.idInput).toBe(document.getElementById('group-id'));
    });

    test('initializes modalTitle reference', () => {
      expect(GroupModal.modalTitle).toBe(document.getElementById('group-modal-title'));
    });
  });

  describe('open', () => {
    test('adds active class to modal', () => {
      GroupModal.open();
      expect(GroupModal.modal.classList.contains('active')).toBe(true);
    });

    test('sets modal title to Add Group', () => {
      GroupModal.open();
      expect(GroupModal.modalTitle.textContent).toBe('Add Group');
    });

    test('clears name input field', () => {
      GroupModal.nameInput.value = 'test';
      GroupModal.open();
      expect(GroupModal.nameInput.value).toBe('');
    });

    test('clears hidden id field', () => {
      GroupModal.idInput.value = 'some-id';
      GroupModal.open();
      expect(GroupModal.idInput.value).toBe('');
    });
  });

  describe('close', () => {
    test('removes active class from modal', () => {
      GroupModal.open();
      GroupModal.close();
      expect(GroupModal.modal.classList.contains('active')).toBe(false);
    });

    test('resets form', () => {
      GroupModal.nameInput.value = 'test';
      GroupModal.close();
      expect(GroupModal.nameInput.value).toBe('');
    });
  });

  describe('handleSubmit', () => {
    beforeEach(() => {
      GroupModal.open();
    });

    test('creates new group with correct name', () => {
      const initialCount = App.data.groups.length;

      GroupModal.nameInput.value = 'New Test Group';

      const event = new Event('submit');
      let preventDefaultCalled = false;
      event.preventDefault = () => { preventDefaultCalled = true; };
      GroupModal.handleSubmit(event);

      expect(preventDefaultCalled).toBe(true);
      expect(App.data.groups.length).toBe(initialCount + 1);

      const newGroup = App.data.groups[initialCount];
      expect(newGroup.name).toBe('New Test Group');
    });

    test('assigns correct order to new group', () => {
      const existingOrders = App.data.groups.map(g => g.order);
      const maxOrder = Math.max(...existingOrders);

      GroupModal.nameInput.value = 'Ordered Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const newGroup = App.data.groups[App.data.groups.length - 1];
      expect(newGroup.order).toBe(maxOrder + 1);
    });

    test('generates unique ID for new group', () => {
      const existingIds = App.data.groups.map(g => g.id);

      GroupModal.nameInput.value = 'Unique Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const newGroup = App.data.groups[App.data.groups.length - 1];
      expect(existingIds).not.toContain(newGroup.id);
      expect(newGroup.id).toMatch(/^id-/);
    });

    test('new group has empty bookmarks array', () => {
      GroupModal.nameInput.value = 'Empty Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const newGroup = App.data.groups[App.data.groups.length - 1];
      expect(newGroup.bookmarks).toEqual([]);
    });

    test('saves data to localStorage', () => {
      GroupModal.nameInput.value = 'Saved Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const savedGroup = storedData.groups.find(g => g.name === 'Saved Group');
      expect(savedGroup).toBeDefined();
    });

    test('closes modal after successful submission', () => {
      GroupModal.nameInput.value = 'Close Test Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      expect(GroupModal.modal.classList.contains('active')).toBe(false);
    });

    test('does not submit with empty name', () => {
      const initialCount = App.data.groups.length;

      GroupModal.nameInput.value = '';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      expect(App.data.groups.length).toBe(initialCount);
    });

    test('does not submit with whitespace-only name', () => {
      const initialCount = App.data.groups.length;

      GroupModal.nameInput.value = '   ';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      expect(App.data.groups.length).toBe(initialCount);
    });

    test('trims whitespace from name', () => {
      GroupModal.nameInput.value = '  Trimmed Group  ';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const newGroup = App.data.groups[App.data.groups.length - 1];
      expect(newGroup.name).toBe('Trimmed Group');
    });

    test('creates group with order 0 when no groups exist', () => {
      // Clear all groups
      App.data.groups = [];

      GroupModal.nameInput.value = 'First Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const newGroup = App.data.groups[0];
      expect(newGroup.order).toBe(0);
    });
  });

  describe('event bindings', () => {
    test('cancel button closes modal', () => {
      GroupModal.open();
      const cancelBtn = document.getElementById('cancel-group-btn');
      cancelBtn.click();
      expect(GroupModal.modal.classList.contains('active')).toBe(false);
    });

    test('clicking overlay closes modal', () => {
      GroupModal.open();
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: GroupModal.modal });
      GroupModal.modal.dispatchEvent(clickEvent);
      expect(GroupModal.modal.classList.contains('active')).toBe(false);
    });

    test('clicking inside modal does not close it', () => {
      GroupModal.open();
      const modalContent = GroupModal.modal.querySelector('.modal');
      const clickEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(clickEvent, 'target', { value: modalContent });
      GroupModal.modal.dispatchEvent(clickEvent);
      expect(GroupModal.modal.classList.contains('active')).toBe(true);
    });

    test('add group button opens modal', () => {
      const addBtn = document.getElementById('add-group-btn');
      addBtn.click();
      expect(GroupModal.modal.classList.contains('active')).toBe(true);
    });
  });

  describe('rendering after submission', () => {
    test('new group appears in DOM after submission', () => {
      GroupModal.open();
      GroupModal.nameInput.value = 'DOM Test Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const container = document.getElementById('groups-container');
      const groupTitles = container.querySelectorAll('.group-title');
      const titles = Array.from(groupTitles).map(el => el.textContent);
      expect(titles).toContain('DOM Test Group');
    });

    test('new group shows empty state message', () => {
      GroupModal.open();
      GroupModal.nameInput.value = 'Empty New Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const container = document.getElementById('groups-container');
      const groups = container.querySelectorAll('.group-card');
      const newGroupCard = Array.from(groups).find(card =>
        card.querySelector('.group-title').textContent === 'Empty New Group'
      );

      expect(newGroupCard).toBeDefined();
      const emptyState = newGroupCard.querySelector('.empty-state');
      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toBe('No bookmarks yet');
    });

    test('group count increases after adding group', () => {
      const initialCount = document.querySelectorAll('.group-card').length;

      GroupModal.open();
      GroupModal.nameInput.value = 'Count Test Group';

      const event = new Event('submit');
      event.preventDefault = () => {};
      GroupModal.handleSubmit(event);

      const newCount = document.querySelectorAll('.group-card').length;
      expect(newCount).toBe(initialCount + 1);
    });
  });
});

describe('Delete Bookmark', () => {
  let App;
  let STORAGE_KEY;
  let originalConfirm;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    App = window.App;
    STORAGE_KEY = window.STORAGE_KEY;
    localStorage.clear();

    // Initialize the app
    App.init();

    // Mock confirm to return true by default
    originalConfirm = window.confirm;
  });

  afterEach(() => {
    localStorage.clear();
    window.confirm = originalConfirm;
  });

  describe('deleteBookmark', () => {
    test('removes bookmark from group when confirmed', () => {
      window.confirm = () => true;
      const group = App.data.groups[0];
      const bookmarkId = group.bookmarks[0].id;
      const initialCount = group.bookmarks.length;

      App.deleteBookmark(bookmarkId);

      expect(group.bookmarks.length).toBe(initialCount - 1);
      expect(group.bookmarks.find(b => b.id === bookmarkId)).toBeUndefined();
    });

    test('does not remove bookmark when cancelled', () => {
      window.confirm = () => false;
      const group = App.data.groups[0];
      const bookmarkId = group.bookmarks[0].id;
      const initialCount = group.bookmarks.length;

      App.deleteBookmark(bookmarkId);

      expect(group.bookmarks.length).toBe(initialCount);
      expect(group.bookmarks.find(b => b.id === bookmarkId)).toBeDefined();
    });

    test('saves to localStorage after deletion', () => {
      window.confirm = () => true;
      const group = App.data.groups[0];
      const bookmarkId = group.bookmarks[0].id;

      App.deleteBookmark(bookmarkId);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const storedGroup = storedData.groups.find(g => g.id === group.id);
      expect(storedGroup.bookmarks.find(b => b.id === bookmarkId)).toBeUndefined();
    });

    test('updates DOM after deletion', () => {
      window.confirm = () => true;
      const bookmarkId = App.data.groups[0].bookmarks[0].id;

      App.deleteBookmark(bookmarkId);

      const container = document.getElementById('groups-container');
      const bookmarkElement = container.querySelector(`[data-id="${bookmarkId}"]`);
      expect(bookmarkElement).toBeNull();
    });

    test('shows confirmation dialog with bookmark title', () => {
      let confirmMessage = null;
      window.confirm = (msg) => {
        confirmMessage = msg;
        return false;
      };

      const bookmark = App.data.groups[0].bookmarks[0];
      App.deleteBookmark(bookmark.id);

      expect(confirmMessage).toContain(bookmark.title);
      expect(confirmMessage).toContain('Delete bookmark');
    });

    test('does nothing for non-existent bookmark', () => {
      window.confirm = () => true;
      const initialData = JSON.stringify(App.data);

      App.deleteBookmark('non-existent-id');

      expect(JSON.stringify(App.data)).toBe(initialData);
    });

    test('removes correct bookmark from group with multiple bookmarks', () => {
      window.confirm = () => true;
      const group = App.data.groups[0];
      const bookmarkToDelete = group.bookmarks[1];
      const remainingBookmarkIds = group.bookmarks
        .filter(b => b.id !== bookmarkToDelete.id)
        .map(b => b.id);

      App.deleteBookmark(bookmarkToDelete.id);

      expect(group.bookmarks.map(b => b.id)).toEqual(remainingBookmarkIds);
    });
  });

  describe('delete button event delegation', () => {
    test('delete button click triggers deleteBookmark', () => {
      window.confirm = () => true;
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      const deleteBtn = document.querySelector(`[data-action="delete"][data-id="${bookmarkId}"]`);
      const initialCount = App.data.groups[0].bookmarks.length;

      expect(deleteBtn).not.toBeNull();
      deleteBtn.click();

      expect(App.data.groups[0].bookmarks.length).toBe(initialCount - 1);
    });

    test('delete button click prevents navigation', () => {
      window.confirm = () => false;
      const bookmarkId = App.data.groups[0].bookmarks[0].id;
      const deleteBtn = document.querySelector(`[data-action="delete"][data-id="${bookmarkId}"]`);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      let defaultPrevented = false;
      clickEvent.preventDefault = () => { defaultPrevented = true; };

      deleteBtn.dispatchEvent(clickEvent);

      expect(defaultPrevented).toBe(true);
    });
  });
});

describe('Delete Group', () => {
  let App;
  let STORAGE_KEY;
  let originalConfirm;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    App = window.App;
    STORAGE_KEY = window.STORAGE_KEY;
    localStorage.clear();

    // Initialize the app
    App.init();

    // Mock confirm to return true by default
    originalConfirm = window.confirm;
  });

  afterEach(() => {
    localStorage.clear();
    window.confirm = originalConfirm;
  });

  describe('deleteGroup', () => {
    test('removes group when confirmed', () => {
      window.confirm = () => true;
      const groupId = App.data.groups[0].id;
      const initialCount = App.data.groups.length;

      App.deleteGroup(groupId);

      expect(App.data.groups.length).toBe(initialCount - 1);
      expect(App.data.groups.find(g => g.id === groupId)).toBeUndefined();
    });

    test('does not remove group when cancelled', () => {
      window.confirm = () => false;
      const groupId = App.data.groups[0].id;
      const initialCount = App.data.groups.length;

      App.deleteGroup(groupId);

      expect(App.data.groups.length).toBe(initialCount);
      expect(App.data.groups.find(g => g.id === groupId)).toBeDefined();
    });

    test('saves to localStorage after deletion', () => {
      window.confirm = () => true;
      const groupId = App.data.groups[0].id;

      App.deleteGroup(groupId);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      expect(storedData.groups.find(g => g.id === groupId)).toBeUndefined();
    });

    test('updates DOM after deletion', () => {
      window.confirm = () => true;
      const groupId = App.data.groups[0].id;

      App.deleteGroup(groupId);

      const container = document.getElementById('groups-container');
      const groupElement = container.querySelector(`[data-id="${groupId}"]`);
      expect(groupElement).toBeNull();
    });

    test('shows confirmation dialog with group name for empty group', () => {
      // Create an empty group first
      App.data.groups.push({
        id: 'empty-group',
        name: 'Empty Test Group',
        order: 10,
        bookmarks: []
      });

      let confirmMessage = null;
      window.confirm = (msg) => {
        confirmMessage = msg;
        return false;
      };

      App.deleteGroup('empty-group');

      expect(confirmMessage).toBe('Delete group "Empty Test Group"?');
    });

    test('shows confirmation dialog with bookmark count for group with bookmarks', () => {
      let confirmMessage = null;
      window.confirm = (msg) => {
        confirmMessage = msg;
        return false;
      };

      const group = App.data.groups[0];
      const bookmarkCount = group.bookmarks.length;
      App.deleteGroup(group.id);

      expect(confirmMessage).toContain(group.name);
      expect(confirmMessage).toContain(bookmarkCount.toString());
      expect(confirmMessage).toContain('bookmark');
    });

    test('uses singular "bookmark" for group with one bookmark', () => {
      // Create a group with exactly one bookmark
      App.data.groups.push({
        id: 'single-bm-group',
        name: 'Single Bookmark Group',
        order: 10,
        bookmarks: [{ id: 'bm1', title: 'Test', url: 'https://test.com', order: 0 }]
      });

      let confirmMessage = null;
      window.confirm = (msg) => {
        confirmMessage = msg;
        return false;
      };

      App.deleteGroup('single-bm-group');

      expect(confirmMessage).toContain('1 bookmark');
      expect(confirmMessage).not.toContain('1 bookmarks');
    });

    test('uses plural "bookmarks" for group with multiple bookmarks', () => {
      let confirmMessage = null;
      window.confirm = (msg) => {
        confirmMessage = msg;
        return false;
      };

      const group = App.data.groups[0]; // Development group has 3 bookmarks
      App.deleteGroup(group.id);

      expect(confirmMessage).toContain('bookmarks');
    });

    test('does nothing for non-existent group', () => {
      window.confirm = () => true;
      const initialData = JSON.stringify(App.data);

      App.deleteGroup('non-existent-id');

      expect(JSON.stringify(App.data)).toBe(initialData);
    });

    test('deletes all bookmarks within the group', () => {
      window.confirm = () => true;
      const group = App.data.groups[0];
      const bookmarkIds = group.bookmarks.map(b => b.id);

      App.deleteGroup(group.id);

      // Verify bookmarks don't exist in any group
      bookmarkIds.forEach(bookmarkId => {
        const found = App.data.groups.some(g =>
          g.bookmarks.some(b => b.id === bookmarkId)
        );
        expect(found).toBe(false);
      });
    });
  });

  describe('delete group button event delegation', () => {
    test('delete group button click triggers deleteGroup', () => {
      window.confirm = () => true;
      const groupId = App.data.groups[0].id;
      const deleteBtn = document.querySelector(`[data-action="delete-group"][data-id="${groupId}"]`);
      const initialCount = App.data.groups.length;

      expect(deleteBtn).not.toBeNull();
      deleteBtn.click();

      expect(App.data.groups.length).toBe(initialCount - 1);
    });

    test('delete group button click prevents default behavior', () => {
      window.confirm = () => false;
      const groupId = App.data.groups[0].id;
      const deleteBtn = document.querySelector(`[data-action="delete-group"][data-id="${groupId}"]`);

      const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
      let defaultPrevented = false;
      clickEvent.preventDefault = () => { defaultPrevented = true; };

      deleteBtn.dispatchEvent(clickEvent);

      expect(defaultPrevented).toBe(true);
    });

    test('shows empty state when last group is deleted', () => {
      window.confirm = () => true;

      // Delete all groups one by one
      while (App.data.groups.length > 0) {
        App.deleteGroup(App.data.groups[0].id);
      }

      const container = document.getElementById('groups-container');
      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toContain('No bookmark groups yet');
    });
  });
});

describe('Drag and Drop Bookmark Sorting', () => {
  let App;
  let DragDrop;
  let Renderer;
  let Storage;
  let STORAGE_KEY;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    App = window.App;
    DragDrop = window.DragDrop;
    Renderer = window.Renderer;
    Storage = window.Storage;
    STORAGE_KEY = window.STORAGE_KEY;
    localStorage.clear();

    // Initialize the app
    App.init();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Bookmark element drag attributes', () => {
    test('bookmark elements have draggable attribute', () => {
      const bookmarks = document.querySelectorAll('.bookmark-item');
      expect(bookmarks.length).toBeGreaterThan(0);
      bookmarks.forEach(bookmark => {
        expect(bookmark.draggable).toBe(true);
      });
    });

    test('bookmark elements have data-group-id attribute', () => {
      const bookmarks = document.querySelectorAll('.bookmark-item');
      expect(bookmarks.length).toBeGreaterThan(0);
      bookmarks.forEach(bookmark => {
        expect(bookmark.dataset.groupId).toBeDefined();
        expect(bookmark.dataset.groupId.length).toBeGreaterThan(0);
      });
    });

    test('bookmark elements have data-id attribute', () => {
      const bookmarks = document.querySelectorAll('.bookmark-item');
      expect(bookmarks.length).toBeGreaterThan(0);
      bookmarks.forEach(bookmark => {
        expect(bookmark.dataset.id).toBeDefined();
        expect(bookmark.dataset.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CSS drag styles', () => {
    test('has dragging class styles in CSS', () => {
      const style = document.querySelector('style');
      expect(style.textContent).toContain('.bookmark-item.dragging');
    });

    test('has drag-over class styles in CSS', () => {
      const style = document.querySelector('style');
      expect(style.textContent).toContain('.bookmark-item.drag-over');
    });

    test('has cursor grab style for draggable items', () => {
      const style = document.querySelector('style');
      expect(style.textContent).toContain('cursor: grab');
    });
  });

  describe('DragDrop controller initialization', () => {
    test('DragDrop object exists', () => {
      expect(DragDrop).toBeDefined();
    });

    test('DragDrop has init method', () => {
      expect(typeof DragDrop.init).toBe('function');
    });

    test('DragDrop has handleDragStart method', () => {
      expect(typeof DragDrop.handleDragStart).toBe('function');
    });

    test('DragDrop has handleDragEnd method', () => {
      expect(typeof DragDrop.handleDragEnd).toBe('function');
    });

    test('DragDrop has handleDragOver method', () => {
      expect(typeof DragDrop.handleDragOver).toBe('function');
    });

    test('DragDrop has handleDrop method', () => {
      expect(typeof DragDrop.handleDrop).toBe('function');
    });

    test('DragDrop has reorderBookmark method', () => {
      expect(typeof DragDrop.reorderBookmark).toBe('function');
    });

    test('DragDrop has normalizeOrders method', () => {
      expect(typeof DragDrop.normalizeOrders).toBe('function');
    });
  });

  describe('handleDragStart', () => {
    test('sets dragging class on bookmark item', () => {
      const bookmark = document.querySelector('.bookmark-item');
      const event = new Event('dragstart', { bubbles: true });
      event.dataTransfer = {
        effectAllowed: '',
        setData: () => {}
      };

      bookmark.dispatchEvent(event);

      expect(bookmark.classList.contains('dragging')).toBe(true);
    });

    test('stores dragged bookmark ID', () => {
      const bookmark = document.querySelector('.bookmark-item');
      const bookmarkId = bookmark.dataset.id;
      const event = new Event('dragstart', { bubbles: true });
      event.dataTransfer = {
        effectAllowed: '',
        setData: () => {}
      };

      bookmark.dispatchEvent(event);

      expect(DragDrop.draggedBookmarkId).toBe(bookmarkId);
    });

    test('stores source group ID', () => {
      const bookmark = document.querySelector('.bookmark-item');
      const groupId = bookmark.dataset.groupId;
      const event = new Event('dragstart', { bubbles: true });
      event.dataTransfer = {
        effectAllowed: '',
        setData: () => {}
      };

      bookmark.dispatchEvent(event);

      expect(DragDrop.sourceGroupId).toBe(groupId);
    });

    test('sets dataTransfer effectAllowed to move', () => {
      const bookmark = document.querySelector('.bookmark-item');
      const event = new Event('dragstart', { bubbles: true });
      event.dataTransfer = {
        effectAllowed: '',
        setData: () => {}
      };

      bookmark.dispatchEvent(event);

      expect(event.dataTransfer.effectAllowed).toBe('move');
    });

    test('calls dataTransfer.setData with bookmark ID', () => {
      const bookmark = document.querySelector('.bookmark-item');
      const bookmarkId = bookmark.dataset.id;
      const event = new Event('dragstart', { bubbles: true });
      let setDataArgs = null;
      event.dataTransfer = {
        effectAllowed: '',
        setData: (type, data) => { setDataArgs = { type, data }; }
      };

      bookmark.dispatchEvent(event);

      expect(setDataArgs).toEqual({ type: 'text/plain', data: bookmarkId });
    });
  });

  describe('handleDragEnd', () => {
    test('removes dragging class from bookmark item', () => {
      const bookmark = document.querySelector('.bookmark-item');
      bookmark.classList.add('dragging');

      const event = new Event('dragend', { bubbles: true });
      bookmark.dispatchEvent(event);

      expect(bookmark.classList.contains('dragging')).toBe(false);
    });

    test('clears draggedBookmarkId', () => {
      const bookmark = document.querySelector('.bookmark-item');

      // Start drag first
      const startEvent = new Event('dragstart', { bubbles: true });
      startEvent.dataTransfer = { effectAllowed: '', setData: () => {} };
      bookmark.dispatchEvent(startEvent);

      // End drag
      const endEvent = new Event('dragend', { bubbles: true });
      bookmark.dispatchEvent(endEvent);

      expect(DragDrop.draggedBookmarkId).toBeNull();
    });

    test('clears sourceGroupId', () => {
      const bookmark = document.querySelector('.bookmark-item');

      // Start drag first
      const startEvent = new Event('dragstart', { bubbles: true });
      startEvent.dataTransfer = { effectAllowed: '', setData: () => {} };
      bookmark.dispatchEvent(startEvent);

      // End drag
      const endEvent = new Event('dragend', { bubbles: true });
      bookmark.dispatchEvent(endEvent);

      expect(DragDrop.sourceGroupId).toBeNull();
    });

    test('removes drag-over classes from all elements', () => {
      const bookmarks = document.querySelectorAll('.bookmark-item');
      bookmarks.forEach(b => b.classList.add('drag-over'));

      const event = new Event('dragend', { bubbles: true });
      bookmarks[0].dispatchEvent(event);

      document.querySelectorAll('.bookmark-item').forEach(b => {
        expect(b.classList.contains('drag-over')).toBe(false);
      });
    });
  });

  describe('reorderBookmark', () => {
    test('moves bookmark from position 2 to position 0', () => {
      const group = App.data.groups[0]; // Development group with 3 bookmarks
      const bookmark = group.bookmarks.find(b => b.order === 2);

      DragDrop.reorderBookmark(group, bookmark, 0);

      expect(bookmark.order).toBe(0);
      // Verify orders are sequential
      const orders = group.bookmarks.map(b => b.order).sort((a, b) => a - b);
      expect(orders).toEqual([0, 1, 2]);
    });

    test('moves bookmark from position 0 to position 2', () => {
      const group = App.data.groups[0];
      const bookmark = group.bookmarks.find(b => b.order === 0);

      DragDrop.reorderBookmark(group, bookmark, 2);

      expect(bookmark.order).toBe(2);
      // Verify orders are sequential
      const orders = group.bookmarks.map(b => b.order).sort((a, b) => a - b);
      expect(orders).toEqual([0, 1, 2]);
    });

    test('does nothing when moving to same position', () => {
      const group = App.data.groups[0];
      const bookmark = group.bookmarks.find(b => b.order === 1);
      const originalOrders = group.bookmarks.map(b => ({ id: b.id, order: b.order }));

      DragDrop.reorderBookmark(group, bookmark, 1);

      group.bookmarks.forEach(b => {
        const original = originalOrders.find(o => o.id === b.id);
        expect(b.order).toBe(original.order);
      });
    });

    test('moves bookmark from middle to end', () => {
      const group = App.data.groups[0];
      const bookmark = group.bookmarks.find(b => b.order === 1);

      DragDrop.reorderBookmark(group, bookmark, 3);

      // After normalization, should be at position 2 (0-indexed)
      const sorted = [...group.bookmarks].sort((a, b) => a.order - b.order);
      expect(sorted[2].id).toBe(bookmark.id);
    });
  });

  describe('normalizeOrders', () => {
    test('normalizes orders to sequential values starting from 0', () => {
      const group = {
        id: 'test-group',
        name: 'Test',
        order: 0,
        bookmarks: [
          { id: 'a', title: 'A', url: 'https://a.com', order: 5 },
          { id: 'b', title: 'B', url: 'https://b.com', order: 2 },
          { id: 'c', title: 'C', url: 'https://c.com', order: 10 }
        ]
      };

      DragDrop.normalizeOrders(group);

      const orders = group.bookmarks.map(b => b.order).sort((a, b) => a - b);
      expect(orders).toEqual([0, 1, 2]);
    });

    test('preserves relative order when normalizing', () => {
      const group = {
        id: 'test-group',
        name: 'Test',
        order: 0,
        bookmarks: [
          { id: 'a', title: 'A', url: 'https://a.com', order: 10 },
          { id: 'b', title: 'B', url: 'https://b.com', order: 5 },
          { id: 'c', title: 'C', url: 'https://c.com', order: 15 }
        ]
      };

      DragDrop.normalizeOrders(group);

      const sorted = [...group.bookmarks].sort((a, b) => a.order - b.order);
      expect(sorted[0].id).toBe('b'); // was 5, now 0
      expect(sorted[1].id).toBe('a'); // was 10, now 1
      expect(sorted[2].id).toBe('c'); // was 15, now 2
    });

    test('handles empty bookmarks array', () => {
      const group = {
        id: 'test-group',
        name: 'Test',
        order: 0,
        bookmarks: []
      };

      expect(() => DragDrop.normalizeOrders(group)).not.toThrow();
    });

    test('handles single bookmark', () => {
      const group = {
        id: 'test-group',
        name: 'Test',
        order: 0,
        bookmarks: [
          { id: 'a', title: 'A', url: 'https://a.com', order: 5 }
        ]
      };

      DragDrop.normalizeOrders(group);

      expect(group.bookmarks[0].order).toBe(0);
    });
  });

  describe('Integration: drag and drop reorders bookmarks', () => {
    test('reordering persists to localStorage', () => {
      const group = App.data.groups[0];
      const bookmark = group.bookmarks.find(b => b.order === 2);

      DragDrop.reorderBookmark(group, bookmark, 0);
      Storage.saveData(App.data);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const storedGroup = storedData.groups.find(g => g.id === group.id);
      const storedBookmark = storedGroup.bookmarks.find(b => b.id === bookmark.id);
      expect(storedBookmark.order).toBe(0);
    });

    test('reordering updates DOM after re-render', () => {
      const group = App.data.groups[0];
      const bookmarkToMove = group.bookmarks.find(b => b.order === 2);
      const originalFirstBookmark = group.bookmarks.find(b => b.order === 0);

      DragDrop.reorderBookmark(group, bookmarkToMove, 0);
      Renderer.render(App.data);

      const container = document.getElementById('groups-container');
      const groupCard = container.querySelector(`[data-id="${group.id}"]`);
      const renderedBookmarks = groupCard.querySelectorAll('.bookmark-item');

      // First bookmark in DOM should now be the moved one
      expect(renderedBookmarks[0].dataset.id).toBe(bookmarkToMove.id);
      // Original first should now be second
      expect(renderedBookmarks[1].dataset.id).toBe(originalFirstBookmark.id);
    });

    test('all bookmarks remain after reordering', () => {
      const group = App.data.groups[0];
      const originalCount = group.bookmarks.length;
      const originalIds = group.bookmarks.map(b => b.id);
      const bookmark = group.bookmarks.find(b => b.order === 1);

      DragDrop.reorderBookmark(group, bookmark, 0);

      expect(group.bookmarks.length).toBe(originalCount);
      const newIds = group.bookmarks.map(b => b.id);
      expect(newIds.sort()).toEqual(originalIds.sort());
    });
  });

  describe('createBookmarkElement with groupId', () => {
    test('passes groupId to createBookmarkElement', () => {
      const testBookmark = {
        id: 'test-bm',
        title: 'Test',
        url: 'https://test.com',
        order: 0
      };
      const testGroupId = 'test-group-id';

      const element = Renderer.createBookmarkElement(testBookmark, testGroupId);

      expect(element.dataset.groupId).toBe(testGroupId);
    });
  });
});

describe('Drag and Drop Group Reordering', () => {
  let App;
  let GroupDragDrop;
  let Renderer;
  let Storage;
  let STORAGE_KEY;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');

    const script = document.querySelector('script');
    eval(script.textContent);

    App = window.App;
    GroupDragDrop = window.GroupDragDrop;
    Renderer = window.Renderer;
    Storage = window.Storage;
    STORAGE_KEY = window.STORAGE_KEY;
    localStorage.clear();

    // Initialize the app
    App.init();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Group element drag attributes', () => {
    test('group cards have draggable attribute', () => {
      const groups = document.querySelectorAll('.group-card');
      expect(groups.length).toBeGreaterThan(0);
      groups.forEach(group => {
        expect(group.draggable).toBe(true);
      });
    });

    test('group cards have data-id attribute', () => {
      const groups = document.querySelectorAll('.group-card');
      expect(groups.length).toBeGreaterThan(0);
      groups.forEach(group => {
        expect(group.dataset.id).toBeDefined();
        expect(group.dataset.id.length).toBeGreaterThan(0);
      });
    });
  });

  describe('CSS group drag styles', () => {
    test('has group dragging class styles in CSS', () => {
      const style = document.querySelector('style');
      expect(style.textContent).toContain('.group-card.dragging');
    });

    test('has group drag-over class styles in CSS', () => {
      const style = document.querySelector('style');
      expect(style.textContent).toContain('.group-card.drag-over');
    });

    test('has cursor grab style for draggable group items', () => {
      const style = document.querySelector('style');
      expect(style.textContent).toContain('.group-card[draggable="true"]');
      expect(style.textContent).toContain('cursor: grab');
    });
  });

  describe('GroupDragDrop controller initialization', () => {
    test('GroupDragDrop object exists', () => {
      expect(GroupDragDrop).toBeDefined();
    });

    test('GroupDragDrop has init method', () => {
      expect(typeof GroupDragDrop.init).toBe('function');
    });

    test('GroupDragDrop has handleDragStart method', () => {
      expect(typeof GroupDragDrop.handleDragStart).toBe('function');
    });

    test('GroupDragDrop has handleDragEnd method', () => {
      expect(typeof GroupDragDrop.handleDragEnd).toBe('function');
    });

    test('GroupDragDrop has handleDragOver method', () => {
      expect(typeof GroupDragDrop.handleDragOver).toBe('function');
    });

    test('GroupDragDrop has handleDrop method', () => {
      expect(typeof GroupDragDrop.handleDrop).toBe('function');
    });

    test('GroupDragDrop has reorderGroup method', () => {
      expect(typeof GroupDragDrop.reorderGroup).toBe('function');
    });

    test('GroupDragDrop has normalizeOrders method', () => {
      expect(typeof GroupDragDrop.normalizeOrders).toBe('function');
    });
  });

  describe('handleDragStart for groups', () => {
    test('sets dragging class on group card', () => {
      const groupCard = document.querySelector('.group-card');
      const event = new Event('dragstart', { bubbles: true });
      event.dataTransfer = {
        effectAllowed: '',
        setData: () => {}
      };

      // Dispatch from the group card itself (not from a bookmark inside)
      GroupDragDrop.handleDragStart({
        target: groupCard,
        dataTransfer: event.dataTransfer
      });

      expect(groupCard.classList.contains('dragging')).toBe(true);
    });

    test('stores dragged group ID', () => {
      const groupCard = document.querySelector('.group-card');
      const groupId = groupCard.dataset.id;
      const event = {
        target: groupCard,
        dataTransfer: {
          effectAllowed: '',
          setData: () => {}
        }
      };

      GroupDragDrop.handleDragStart(event);

      expect(GroupDragDrop.draggedGroupId).toBe(groupId);
    });

    test('sets dataTransfer effectAllowed to move', () => {
      const groupCard = document.querySelector('.group-card');
      const event = {
        target: groupCard,
        dataTransfer: {
          effectAllowed: '',
          setData: () => {}
        }
      };

      GroupDragDrop.handleDragStart(event);

      expect(event.dataTransfer.effectAllowed).toBe('move');
    });

    test('does not start drag when dragging a bookmark', () => {
      const bookmark = document.querySelector('.bookmark-item');
      const event = {
        target: bookmark,
        dataTransfer: {
          effectAllowed: '',
          setData: () => {}
        }
      };

      GroupDragDrop.handleDragStart(event);

      expect(GroupDragDrop.draggedGroupId).toBeNull();
    });
  });

  describe('handleDragEnd for groups', () => {
    test('removes dragging class from group card', () => {
      const groupCard = document.querySelector('.group-card');
      groupCard.classList.add('dragging');

      GroupDragDrop.handleDragEnd({ target: groupCard });

      expect(groupCard.classList.contains('dragging')).toBe(false);
    });

    test('clears draggedGroupId', () => {
      const groupCard = document.querySelector('.group-card');

      // Start drag first
      GroupDragDrop.handleDragStart({
        target: groupCard,
        dataTransfer: { effectAllowed: '', setData: () => {} }
      });

      // End drag
      GroupDragDrop.handleDragEnd({ target: groupCard });

      expect(GroupDragDrop.draggedGroupId).toBeNull();
    });

    test('removes drag-over classes from all group cards', () => {
      const groups = document.querySelectorAll('.group-card');
      groups.forEach(g => g.classList.add('drag-over'));

      GroupDragDrop.handleDragEnd({ target: groups[0] });

      document.querySelectorAll('.group-card').forEach(g => {
        expect(g.classList.contains('drag-over')).toBe(false);
      });
    });
  });

  describe('reorderGroup', () => {
    test('moves group from position 2 to position 0', () => {
      const group = App.data.groups.find(g => g.order === 2);

      GroupDragDrop.reorderGroup(group, 0);

      expect(group.order).toBe(0);
      // Verify orders are sequential
      const orders = App.data.groups.map(g => g.order).sort((a, b) => a - b);
      expect(orders).toEqual([0, 1, 2]);
    });

    test('moves group from position 0 to position 2', () => {
      const group = App.data.groups.find(g => g.order === 0);

      GroupDragDrop.reorderGroup(group, 2);

      expect(group.order).toBe(2);
      // Verify orders are sequential
      const orders = App.data.groups.map(g => g.order).sort((a, b) => a - b);
      expect(orders).toEqual([0, 1, 2]);
    });

    test('does nothing when moving to same position', () => {
      const group = App.data.groups.find(g => g.order === 1);
      const originalOrders = App.data.groups.map(g => ({ id: g.id, order: g.order }));

      GroupDragDrop.reorderGroup(group, 1);

      App.data.groups.forEach(g => {
        const original = originalOrders.find(o => o.id === g.id);
        expect(g.order).toBe(original.order);
      });
    });

    test('moves group from middle to end', () => {
      const group = App.data.groups.find(g => g.order === 1);

      GroupDragDrop.reorderGroup(group, 2);

      // After normalization, should be at position 2 (0-indexed)
      const sorted = [...App.data.groups].sort((a, b) => a.order - b.order);
      expect(sorted[2].id).toBe(group.id);
    });
  });

  describe('normalizeOrders for groups', () => {
    test('normalizes group orders to sequential values starting from 0', () => {
      // Manually set non-sequential orders
      App.data.groups[0].order = 5;
      App.data.groups[1].order = 2;
      App.data.groups[2].order = 10;

      GroupDragDrop.normalizeOrders();

      const orders = App.data.groups.map(g => g.order).sort((a, b) => a - b);
      expect(orders).toEqual([0, 1, 2]);
    });

    test('preserves relative order when normalizing', () => {
      // Set specific orders
      const groupA = App.data.groups.find(g => g.name === 'Development');
      const groupB = App.data.groups.find(g => g.name === 'Social');
      const groupC = App.data.groups.find(g => g.name === 'News');

      groupA.order = 10;
      groupB.order = 5;
      groupC.order = 15;

      GroupDragDrop.normalizeOrders();

      const sorted = [...App.data.groups].sort((a, b) => a.order - b.order);
      expect(sorted[0].name).toBe('Social'); // was 5, now 0
      expect(sorted[1].name).toBe('Development'); // was 10, now 1
      expect(sorted[2].name).toBe('News'); // was 15, now 2
    });

    test('handles single group', () => {
      // Keep only one group
      App.data.groups = [App.data.groups[0]];
      App.data.groups[0].order = 5;

      GroupDragDrop.normalizeOrders();

      expect(App.data.groups[0].order).toBe(0);
    });
  });

  describe('Integration: drag and drop reorders groups', () => {
    test('reordering groups persists to localStorage', () => {
      const group = App.data.groups.find(g => g.order === 2);

      GroupDragDrop.reorderGroup(group, 0);
      Storage.saveData(App.data);

      const storedData = JSON.parse(localStorage.getItem(STORAGE_KEY));
      const storedGroup = storedData.groups.find(g => g.id === group.id);
      expect(storedGroup.order).toBe(0);
    });

    test('reordering groups updates DOM after re-render', () => {
      const groupToMove = App.data.groups.find(g => g.order === 2); // News
      const originalFirstGroup = App.data.groups.find(g => g.order === 0); // Development

      GroupDragDrop.reorderGroup(groupToMove, 0);
      Renderer.render(App.data);

      const container = document.getElementById('groups-container');
      const renderedGroups = container.querySelectorAll('.group-card');

      // First group in DOM should now be the moved one (News)
      expect(renderedGroups[0].dataset.id).toBe(groupToMove.id);
      // Original first should now be second
      expect(renderedGroups[1].dataset.id).toBe(originalFirstGroup.id);
    });

    test('all groups remain after reordering', () => {
      const originalCount = App.data.groups.length;
      const originalIds = App.data.groups.map(g => g.id);
      const group = App.data.groups.find(g => g.order === 1);

      GroupDragDrop.reorderGroup(group, 0);

      expect(App.data.groups.length).toBe(originalCount);
      const newIds = App.data.groups.map(g => g.id);
      expect(newIds.sort()).toEqual(originalIds.sort());
    });

    test('group bookmarks remain intact after reordering', () => {
      const group = App.data.groups.find(g => g.order === 0);
      const originalBookmarkCount = group.bookmarks.length;
      const originalBookmarkIds = group.bookmarks.map(b => b.id);

      GroupDragDrop.reorderGroup(group, 2);

      expect(group.bookmarks.length).toBe(originalBookmarkCount);
      const newBookmarkIds = group.bookmarks.map(b => b.id);
      expect(newBookmarkIds.sort()).toEqual(originalBookmarkIds.sort());
    });
  });

  describe('createGroupElement with draggable', () => {
    test('creates group element with draggable true', () => {
      const testGroup = {
        id: 'test-group',
        name: 'Test',
        order: 0,
        bookmarks: []
      };

      const element = Renderer.createGroupElement(testGroup);

      expect(element.draggable).toBe(true);
    });
  });
});

describe('Search', () => {
  let Search;
  let App;
  let Storage;
  let Renderer;

  beforeEach(() => {
    document.documentElement.innerHTML = html.replace(/<!DOCTYPE html>/i, '');
    const script = document.querySelector('script');
    eval(script.textContent);

    Search = window.Search;
    App = window.App;
    Storage = window.Storage;
    Renderer = window.Renderer;
    STORAGE_KEY = window.STORAGE_KEY;

    localStorage.clear();
    App.data = Storage.loadData();
    Renderer.render(App.data);
    Search.init();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('init', () => {
    test('initializes searchInput reference', () => {
      expect(Search.searchInput).not.toBeNull();
      expect(Search.searchInput.id).toBe('search-input');
    });

    test('initializes currentQuery as empty string', () => {
      expect(Search.currentQuery).toBe('');
    });
  });

  describe('filterBookmarks', () => {
    const bookmarks = [
      { id: '1', title: 'GitHub', url: 'https://github.com', order: 0 },
      { id: '2', title: 'Stack Overflow', url: 'https://stackoverflow.com', order: 1 },
      { id: '3', title: 'MDN Docs', url: 'https://developer.mozilla.org', order: 2 }
    ];

    test('returns all bookmarks when query is empty', () => {
      const result = Search.filterBookmarks(bookmarks, '');
      expect(result.length).toBe(3);
    });

    test('filters by title (case insensitive)', () => {
      const result = Search.filterBookmarks(bookmarks, 'github');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('GitHub');
    });

    test('filters by URL', () => {
      const result = Search.filterBookmarks(bookmarks, 'stackoverflow');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Stack Overflow');
    });

    test('filters partial match in title', () => {
      const result = Search.filterBookmarks(bookmarks, 'git');
      expect(result.length).toBe(1);
    });

    test('filters partial match in URL', () => {
      const result = Search.filterBookmarks(bookmarks, 'mozilla');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('MDN Docs');
    });

    test('returns empty array when no matches', () => {
      const result = Search.filterBookmarks(bookmarks, 'xyz123');
      expect(result.length).toBe(0);
    });

    test('matches are case insensitive for titles', () => {
      // Query is expected to be lowercase (handleSearch lowercases it)
      const result = Search.filterBookmarks(bookmarks, 'github');
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('GitHub'); // Title is mixed case, query is lowercase
    });

    test('returns multiple matches', () => {
      const result = Search.filterBookmarks(bookmarks, 'com');
      expect(result.length).toBe(2); // github.com and stackoverflow.com
    });
  });

  describe('handleSearch', () => {
    test('sets currentQuery to lowercase trimmed value', () => {
      Search.handleSearch('  GitHub  ');
      expect(Search.currentQuery).toBe('github');
    });

    test('handles empty string', () => {
      Search.handleSearch('');
      expect(Search.currentQuery).toBe('');
    });

    test('handles whitespace-only string', () => {
      Search.handleSearch('   ');
      expect(Search.currentQuery).toBe('');
    });
  });

  describe('clear', () => {
    test('resets currentQuery to empty string', () => {
      Search.currentQuery = 'test';
      Search.clear();
      expect(Search.currentQuery).toBe('');
    });

    test('clears search input value', () => {
      Search.searchInput.value = 'test';
      Search.clear();
      expect(Search.searchInput.value).toBe('');
    });

    test('re-renders all bookmarks', () => {
      // First filter
      Search.handleSearch('github');
      const container = document.getElementById('groups-container');

      // Clear should restore all groups
      Search.clear();
      const allGroups = container.querySelectorAll('.group-card');

      expect(allGroups.length).toBe(3); // All sample groups
    });
  });

  describe('renderFiltered', () => {
    test('shows all groups when query is empty', () => {
      Search.currentQuery = '';
      Search.renderFiltered();

      const container = document.getElementById('groups-container');
      const groups = container.querySelectorAll('.group-card');
      expect(groups.length).toBe(3);
    });

    test('filters bookmarks across all groups', () => {
      Search.handleSearch('github');

      const container = document.getElementById('groups-container');
      const bookmarks = container.querySelectorAll('.bookmark-item');

      expect(bookmarks.length).toBe(1);
      expect(bookmarks[0].querySelector('.bookmark-title').textContent).toBe('GitHub');
    });

    test('hides groups with no matching bookmarks', () => {
      Search.handleSearch('github'); // Only in Development group

      const container = document.getElementById('groups-container');
      const groups = container.querySelectorAll('.group-card');

      expect(groups.length).toBe(1);
      expect(groups[0].querySelector('.group-title').textContent).toBe('Development');
    });

    test('shows "no results" message when nothing matches', () => {
      Search.handleSearch('xyznonexistent123');

      const container = document.getElementById('groups-container');
      const emptyState = container.querySelector('.empty-state');

      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toContain('No bookmarks found');
      expect(emptyState.textContent).toContain('xyznonexistent123');
    });

    test('filters show multiple matching bookmarks', () => {
      Search.handleSearch('com'); // matches multiple URLs

      const container = document.getElementById('groups-container');
      const bookmarks = container.querySelectorAll('.bookmark-item');

      expect(bookmarks.length).toBeGreaterThan(1);
    });

    test('preserves group order when filtering', () => {
      // Add bookmark to News that matches 'test'
      App.data.groups.find(g => g.name === 'News').bookmarks.push(
        { id: 'test-1', title: 'Test Site', url: 'https://test.com', order: 1 }
      );
      App.data.groups.find(g => g.name === 'Development').bookmarks.push(
        { id: 'test-2', title: 'Test Dev', url: 'https://testdev.com', order: 3 }
      );

      Search.handleSearch('test');

      const container = document.getElementById('groups-container');
      const groups = container.querySelectorAll('.group-card');

      // Development comes before News in order
      expect(groups[0].querySelector('.group-title').textContent).toBe('Development');
      expect(groups[1].querySelector('.group-title').textContent).toBe('News');
    });
  });

  describe('getMatchCount', () => {
    test('returns 0 when query is empty', () => {
      Search.currentQuery = '';
      expect(Search.getMatchCount()).toBe(0);
    });

    test('returns correct count for matching bookmarks', () => {
      Search.currentQuery = 'github';
      expect(Search.getMatchCount()).toBe(1);
    });

    test('returns 0 when no matches', () => {
      Search.currentQuery = 'xyznonexistent';
      expect(Search.getMatchCount()).toBe(0);
    });

    test('returns count across all groups', () => {
      // 'com' appears in multiple URLs
      Search.currentQuery = 'com';
      const count = Search.getMatchCount();
      expect(count).toBeGreaterThan(1);
    });
  });

  describe('event bindings', () => {
    test('typing in search input triggers filtering', () => {
      const input = document.getElementById('search-input');
      input.value = 'github';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(Search.currentQuery).toBe('github');
    });

    test('Escape key clears search', () => {
      Search.searchInput.value = 'test';
      Search.currentQuery = 'test';

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      Search.searchInput.dispatchEvent(event);

      expect(Search.currentQuery).toBe('');
      expect(Search.searchInput.value).toBe('');
    });
  });

  describe('Integration: search and render', () => {
    test('filtering then clearing restores all bookmarks', () => {
      const container = document.getElementById('groups-container');

      // Count initial bookmarks
      const initialBookmarks = container.querySelectorAll('.bookmark-item').length;

      // Filter
      Search.handleSearch('github');
      const filteredBookmarks = container.querySelectorAll('.bookmark-item').length;
      expect(filteredBookmarks).toBeLessThan(initialBookmarks);

      // Clear
      Search.clear();
      const restoredBookmarks = container.querySelectorAll('.bookmark-item').length;
      expect(restoredBookmarks).toBe(initialBookmarks);
    });

    test('filtered results have correct bookmark IDs', () => {
      Search.handleSearch('github');

      const container = document.getElementById('groups-container');
      const bookmark = container.querySelector('.bookmark-item');

      // Find the actual GitHub bookmark ID
      const githubBookmark = App.data.groups
        .flatMap(g => g.bookmarks)
        .find(b => b.title === 'GitHub');

      expect(bookmark.dataset.id).toBe(githubBookmark.id);
    });

    test('empty data shows empty state during search', () => {
      App.data = { groups: [] };
      Search.currentQuery = 'test';
      Search.renderFiltered();

      const container = document.getElementById('groups-container');
      const emptyState = container.querySelector('.empty-state');
      expect(emptyState).not.toBeNull();
      expect(emptyState.textContent).toContain('No bookmark groups');
    });
  });
});
