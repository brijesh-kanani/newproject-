

export class User {

    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phoneNumber: number;
    dob: string;
    sex: string;
    address1: string;
    address2: string;
    suburb: string;
    state_Territory: number;
    country: number;
    postCode: string;
    image: string;
    roleId: 0

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user: any) {
        {
            this.id = user.id || '';
            this.email = user.email || '';
            this.phoneNumber = user.phoneNumber || '';
            this.firstName = user.firstName || '';
            this.roleId = user.roleId;
            this.lastName = user.lastName;
            this.middleName = user.middleName;
            this.dob = user.dob || '';
            this.sex = user.sex || '';
            this.address1 = user.address1 || '';
            this.address2 = user.address2 || '';
            this.suburb = user.suburb || ''
            this.state_Territory = user.state_Territory || '';
            this.country = user.country;
            this.image = user.image || '';
            this.postCode = user.postCode || ''
        }
    }
}


export class UserFilters implements IUserFilter {
    user_name: string;
    role_id: string;
    start_date: string;

    constructor(userFilter: IUserFilter) {
        this.user_name = (userFilter.user_name ?? '').trim();
        this.role_id = (userFilter.role_id ?? '').trim();
        this.start_date = (userFilter.start_date ?? '').trim();
        // this.productTypes = productFilter.productTypes ?? [];
    }
}

export interface IUserFilter {
    user_name: string;
    role_id: string;
    start_date: string;
}

export enum UserTypeFilterEnum {
    INACTIVE = 'Include Inactive',
    KITS = 'Include kits',
    OUT_OF_STOCK = 'Include Out of stock'
}

export class Country {
    countryID: number;
    countryName: string;
}

export class State {
    stateTerritoriesID: number;
    state_Territory: string;
}
