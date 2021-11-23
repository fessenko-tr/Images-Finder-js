
class MarkupMaker {

 
    constructor(area, template, fetchInstance ){
        this.area = area;
        this.template = template;
        this.fetchInstance = fetchInstance;
    }

    

    createMarkup( items, position){
        this.area.insertAdjacentHTML(position, this.template(items));
    }

      clearMarkup(){
        this.area.innerHTML = '';
        this.fetchInstance.page = 1;
        this.fetchInstance.totalHits = 0;
    }
}

export default MarkupMaker;