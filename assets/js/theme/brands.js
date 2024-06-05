import PageManager from './page-manager';
import haloAZBrands from './halothemes/haloAZBrands';

export default class Brands extends PageManager {
	constructor(context) {
        super(context);
    }
    
	onReady() {
		haloAZBrands(this.context);
    }
}
