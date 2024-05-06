import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TemplatesService {
    TEMPLATES: any = [
        {
            templateName: 'My Template1',
            reportName: 'third',
            description: 'This is a template1 for generating reports.',
            formatType: 'first',
            isActive: true,
        },
        {
            templateName: 'My Template2',
            reportName: 'second',
            description: 'This is a template2 for generating reports.',
            formatType: 'second',
            isActive: false,
        },
        {
            templateName: 'My Template3',
            reportName: 'third',
            description: 'This is a template3 for generating reports.',
            formatType: 'third',
            isActive: true,
        },
    ];

    templateData = new BehaviorSubject<any>(this.TEMPLATES);

    coreData: any = this.TEMPLATES;
    appliedFilters = new BehaviorSubject<any>({ templateName: '' });

    constructor() {}

    setData() {
        let filterValue = this.appliedFilters.value.templateName;

        if (filterValue !== '') {
            let filteredData = this.coreData;

            filteredData = filteredData.filter((template: any) =>
                template.templateName
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );

            this.templateData.next(filteredData);
        } else {
            this.templateData.next(this.coreData);
        }
    }

    setFilter(filters: any) {
        this.appliedFilters.next(filters);
        this.setData();
    }

    addTemplate(newTemplate: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let templateList = this.coreData;

            templateList.push(newTemplate);

            this.coreData = templateList;
            this.templateData.next(templateList);
            this.setData();
            resolve('success');

            // reject('An error occurred');
        });
    }

    editTemplate(data: any, editedTemplate: any) {
        return new Promise((resolve, reject) => {
            let templateList = this.coreData;
            let templateIndex = templateList.indexOf(data.template);

            if (templateIndex !== -1) {
                templateList[templateIndex] = editedTemplate;
                this.coreData = templateList;
                this.templateData.next(templateList);
                this.setData();
                resolve('success');
            } else {
                reject('An error occurred');
            }
        });
    }

    deleteTemplate(template: any) {
        return new Promise((resolve, reject) => {
            let templateList = this.coreData;

            let templateIndex = templateList.indexOf(template);
            console.log(templateIndex, 'aaa');

            if (templateIndex !== -1) {
                templateList.splice(templateIndex, 1);

                this.coreData = templateList;
                this.templateData.next(templateList);

                this.setData();
                resolve(true);
            } else {
                reject('Template not found');
            }
        });
    }
}
