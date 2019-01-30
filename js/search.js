/**
 * Search
 * @desc Appends a search input and listens for key input
 */
const searchContainer = jQuery('.search-container');
const searchInput = jQuery('<input class="search-input"/>');
searchContainer.append(searchInput);
searchInput.on('keyup', event => gallery.searchProfiles(event.target.value));