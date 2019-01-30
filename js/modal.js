/**
 * Modal Controller
 * @class ModalController
 * @desc Manages elements within the modal element
 */
class ModalController {

    constructor(datasource) {
        // Datasource
        this.datasource = datasource;
        // Bindings
        this.didSelectCloseButton = this.didSelectCloseButton.bind(this);
        this.didSelectBackground = this.didSelectBackground.bind(this);
        this.didSelectPaginationButton = this.didSelectPaginationButton.bind(this);
        // Elements
        this.background = jQuery('<div class="modal-container" visibility="hidden"></div>');
        this.container = jQuery('<div class="modal"></div>');
        this.cancelButton = createCancelButton();
        this.detailContainer = createInformationContainer();
        // Display
        this.container.append(this.cancelButton, this.detailContainer);
        this.background.append(this.container, createPagination());
        // Events
        this.cancelButton.on('click', this.didSelectCloseButton);
        this.background.on('click', this.didSelectBackground);
        jQuery('.modal-btn-container', this.background).on('click', this.didSelectPaginationButton);
        // Display and hide
        jQuery('#gallery').parent().before(this.background);
        this.background.hide();
    }

    /**
     * Display Profile
     * @desc Updates profile elements and displays the modal
     * @param {Profile|Object} profile - Configured profile object
     */
    displayProfile(profile) {
        //document.getElementsByClassName('modal-img')[0].src = profile.getImg('large');
        jQuery('h3', this.container).text(profile.name);
        jQuery('img', this.container).attr('src', profile.getImg('large'));
        jQuery('p', this.container).each((idx, elem) => {
            elem = jQuery(elem);
            switch (elem.attr('data-js')) {
                case 'email': jQuery(elem).text(profile.email); break;
                case 'city': jQuery(elem).text(profile.getLocation('city')); break;
                case 'number': jQuery(elem).text(profile.phone); break;
                case 'address': jQuery(elem).text(profile.getLocation('street, state postcode')); break;
                case 'birthday': jQuery(elem).text(`Birthday: ${profile.birthday.getMonth()+1}/${profile.birthday.getDay()+1}/${profile.birthday.getFullYear()}`); break;
            }
        });
        this.show();
    }

    /**
     * Pagination Selected
     * @param {HTMLEvent|object} param Selected pagination element
     */
    didSelectPaginationButton({ target }) {
        if (target.tagName !== 'BUTTON' || target.className === 'modal-close-btn') return;
        if (target.id === 'modal-next') {
            this.datasource.selectedNext();
        } else {
            this.datasource.selectedPrevious();
        }
    }

    /**
     * Close Selected
     * @param {HTMLEvent|object} event Selected button element
     */
    didSelectCloseButton(event) {
        event.preventDefault();
        this.close();
    }

    /**
     * Background Selected
     * @param {HTMLEvent|object} event Selected page element
     */
    didSelectBackground(event) {
        if (event.target.className !== this.background[0].className) return;
        this.close();
    }

    /**
     * Show Modal
     * @desc Visually dispalys the modal element
     */
    show() {
        this.background.on('click', this.didSelectBackground);
        this.background.fadeIn(500);
    }
    
    /**
     * Close Modal
     * @desc Visually hides the modal element
     */
    close() {
        this.background.fadeOut(300);
    }
}

/**
 * Create Cancel Button
 * @desc Creates the modal cancel button
 */
function createCancelButton() {
    const button = jQuery('<button id="modal-close-btn" class="modal-close-btn" type="button"></button>');
    const strongTag = jQuery('<strong></strong>').text('X');
    return button.html(strongTag);
}

/**
 * Create Inofrmation Container
 * @desc Creates the users detail information element
 * @param {string} imageSrc Profile Photo resource url
 * @param {string} name User's fullname
 * @param {string} email User's email
 * @param {string} city User's city of origin
 * @param {string} number User's formatted phone number
 * @param {string} address User's formatted address
 * @param {string} birthdate User's formatted birthdate
 */
function createInformationContainer(imageSrc, name, email, city, number, address, birthdate) {
    const infoContainer = jQuery('<div class="modal-info-container"></div>');
    const ppImageElem = jQuery(`<img class="modal-img" src="${imageSrc||''}" alt="profile picture"/>`);
    const nameElem = jQuery('<h3 id="name" class="modal-name cap" data-js="name"></h3>').text(name||'first last');
    const emailElem = jQuery('<p class="modal-text" data-js="email"></p>').text(email||'email@email.com');
    const cityElem = jQuery('<p class="modal-text cap" data-js="city"></p>').text(city||'City');
    const horizRuleElem = document.createElement('hr');
    const numberElem = jQuery('<p class="modal-text" data-js="number"></p>').text(number||'(555) 555-5555');
    const addressElem = jQuery('<p class="modal-text cap" data-js="address"></p>').text(address||'Address');
    const dobElem = jQuery('<p class="modal-text"></p> data-js="birthdate"').text(birthdate||'Birthday: 10/21/2015');
    return infoContainer.append(ppImageElem, nameElem, emailElem, cityElem, horizRuleElem, numberElem, addressElem, dobElem);
}

/**
 * Create Pagination Element
 * @desc Create the pagination element
 */
function createPagination() {
    const pagination = jQuery('<div class="modal-btn-container"></div>');
    const prevButton = jQuery('<button id="modal-prev" class="modal-prev btn"></button>').text('Prev');
    const nextButton = jQuery('<button id="modal-next" class="modal-next btn"></button>').text('Next');
    return pagination.append(prevButton, nextButton);
}