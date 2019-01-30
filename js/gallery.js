/**
 * Gallery
 * @class Gallery
 */
class Gallery {

    constructor() {
        this.profiles = [];
        this.selectedIndex = 0;
        this.modal = new ModalController(this);
        this.refresh();
    }

    /**
     * Refresh
     * @desc Makes an API request and updates the profiles before rerendering
     */
    refresh() {
        fetch('https://randomuser.me/api/?results=12').then((data) => data.json()).then(response => {
            this.profiles = response.results.map(data => new Profile(data));
            this.renderProfiles();
        }).catch(console.error);
    }

    /**
     * Render Profiles
     * @desc Clears the current profiles and renders the new layout
     */
    renderProfiles() {
        jQuery('#gallery').html('');
        this.profiles.forEach(appendProfile);
    }

    /**
     * Select Next Profile
     * @desc Selects the next available profile
     * @note Needs refactoring
     */
    selectedNext() {
        let trials = this.profiles.length;
        let currIndex = this.selectedIndex;
        let nextIndex = this.selectedIndex;
        while (nextIndex == this.selectedIndex && trials > 0) {
            currIndex++;
            if (currIndex >= this.profiles.length) currIndex = 0;
            if (this.profiles[currIndex].visible) nextIndex = currIndex;
            trials--;
        }
        this.selectedIndex = nextIndex;
        this.modal.displayProfile(this.profiles[this.selectedIndex]);
    }

    /**
     * Select Previous Profile
     * @desc Selects the previous available profile
     * @note Needs refactoring
     */
    selectedPrevious() {
        let trials = this.profiles.length;
        let currIndex = this.selectedIndex;
        let prevIndex = this.selectedIndex;
        while (prevIndex == this.selectedIndex && trials > 0) {
            currIndex--;
            if (currIndex < 0) currIndex = this.profiles.length - 1;
            if (this.profiles[currIndex].visible) prevIndex = currIndex;
            trials--;
        }
        this.selectedIndex = prevIndex;
        this.modal.displayProfile(this.profiles[this.selectedIndex]);
    }

    /**
     * Select Profile
     * @desc Updates the selected index and displays the selected profile modal
     * @param {Profile|object} selectedProfile Configured profile object
     */
    selectedProfile(selectedProfile) {
        const index = this.profiles.reduce((match, profile, idx) => (profile.name === selectedProfile.name) ? idx : match, -1);
        this.selectedIndex = index;
        this.modal.displayProfile(selectedProfile);
    }

    /**
     * Search Profiles
     * @desc Filters the stored profiles for matches with the given query
     * @param {string} query Search query string
     */
    searchProfiles(query) {
        // Update match visibility
        this.profiles = this.profiles.map(entity => {
            const pattern = new RegExp(`${query}[a-b\s]*`,'gi')
            entity.visible = pattern.test(entity.name);
            return entity;
        });
        // Update interfce
        this.renderProfiles();
    }
}

const gallery = new Gallery();

function appendProfile(profile) {
    if (!profile.visible) return;
    const card = jQuery(`<div class="card" data-id="${profile.name}"></div>`);
    const profilePhoto = createGalleryProfilePhotoElement(profile.getImg('medium'));
    const info = createProfileInfoElement(profile);
    card.append(profilePhoto, info);
    card.on('click', event => gallery.selectedProfile(profile));
    jQuery('#gallery').append(card);
}

function createGalleryProfilePhotoElement(imageSource) {
    const cardImgContainer = jQuery(`<div class="card-img-container"></div>`);
    const image = jQuery(`<img class="card-img" src="${imageSource}" alt="profile picture"/>`);
    return cardImgContainer.append(image);
}

function createProfileInfoElement(profile) {
    const info = jQuery('<div class="card-info-container"></div>');
    const heading = jQuery(`<h3 id="name" class="card-name"></h3>`).text(profile.name);
    const email = jQuery('<p class="card-text"></p>').html(profile.email);
    const address = jQuery('<p class="card-text-cap"></p>').html(profile.getLocation('city, state'));
    return info.append(heading, email, address);
}