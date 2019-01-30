/**
 * Profile
 * @class Profile
 * @desc Manages user profile data
 */
class Profile {

    constructor(profile) {
        this.name = profile.name.first+' '+profile.name.last;
        this.img = profile.picture;
        this.email = profile.email;
        this.phone = profile.cell;
        this.birthday = new Date(profile.dob.date); // "1955-03-29T23:26:59Z"
        this.location = profile.location;
        this.visible = true;
    }

    getImg(size='thumbnail') {
        return this.img[size||'thumbnail'];
    }

    getLocation(format='C') {
        const pattern = /(street|suburb|city|state|country|postcode)/gi;
        let match, result = format;
        while((match = pattern.exec(format)) !== null) {
            switch (match[0].toLowerCase()) {
                case 'street': result = result.replace(match[0], this.location.street); break;
                case 'suburb': result = result.replace(match[0], this.location.city); break;
                case 'city': result = result.replace(match[0], this.location.city); break;
                case 'state': result = result.replace(match[0], this.location.state); break;
                case 'country': result = result.replace(match[0], this.location.country); break;
                case 'postcode': result = result.replace(match[0], this.location.postcode); break;
            }
        }
        return result;
    }
}