# Local Bookmark Homepage

A minimal, fast local homepage for managing bookmarks with groups and sorting. All data stored in localStorage.

## Tech Stack
- Vanilla HTML/CSS/JavaScript (no frameworks)
- localStorage for persistence
- Single HTML file with embedded CSS/JS (or separate files in same folder)

## Data Model
```javascript
{
  groups: [
    {
      id: "uuid",
      name: "Group Name",
      order: 0,
      bookmarks: [
        { id: "uuid", title: "Site", url: "https://...", favicon: "...", order: 0 }
      ]
    }
  ]
}
```

## Tasks

- [x] Create base HTML structure with a clean grid layout for bookmark groups, include CSS for cards and responsive design
- [x] Implement localStorage service with functions: loadData, saveData, generateId - initialize with sample bookmarks if empty
- [x] Build bookmark rendering: display groups as cards with bookmark links inside, show favicons using Google's favicon service (https://www.google.com/s2/favicons?domain=URL)
- [x] Add "New Bookmark" modal with form fields: title, URL, group selector - validate URL format before saving
- [x] Add "New Group" functionality with inline name input, save to localStorage and re-render
- [x] Implement edit bookmark: click to open modal pre-filled with current data, update on save
- [x] Implement delete bookmark and delete group with confirmation prompt
- [x] Add drag-and-drop sorting for bookmarks within a group using native HTML5 drag API
- [ ] Add drag-and-drop reordering for groups themselves
- [ ] Add search/filter input that filters bookmarks across all groups as you type
- [ ] Add import/export buttons: export as JSON file download, import from JSON file upload
- [ ] Style the page as a dark theme homepage with minimal aesthetic, add keyboard shortcut (/) to focus search
