import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SnackBar } from 'app/layout/common/snack-bar/snack-bar.class';
import { NgxSpinnerService } from 'ngx-spinner';
import { ImportService } from '../../import.service';
import { fuseAnimations } from '@fuse/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import * as xml2js from 'xml2js';
import { CustomerAccountService } from 'app/modules/customer-account/customer-account.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-save-tamplate',
  templateUrl: './save-tamplate.component.html',
  styleUrls: ['./save-tamplate.component.scss'],
  animations: fuseAnimations,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [MatDialogModule, MatButtonModule, MatToolbarModule, MatDividerModule, MatIconModule, MatFormFieldModule, ReactiveFormsModule, MatDialogModule, CommonModule, MatFormFieldModule, FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule, MatSelectModule]
})

export class SaveTamplateComponent {
  snackBar: SnackBar;
  templeteForm: FormGroup;
  templeteData: any;
  columns: any;
  updateData: boolean = false
  wareHouseName: string
  displayedColumns: any = ["name", "selectOption"]
  randomString: any = '';
  ftpAccountList: any = []
  findUpdateftp: any

  constructor(
    public matDialogRef: MatDialogRef<SaveTamplateComponent>, public snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private router: Router,
    private _spinner: NgxSpinnerService,
    private importService: ImportService,
    private customerService: CustomerAccountService,
    private _formBuilder: FormBuilder,
  ) {
    this.snackBar = new SnackBar(snack);
    this.templeteData = _data.templeteData;
    this.columns = _data.columns;

  }

  ngOnInit(): void {
    if (this.columns && this.columns.length > 0) {
      this.columns = this.columns.filter((column: any) => column.selectedOption !== '' && column.name !== '')
    }
    this.createTempleteForm();
    if (this._data.templeteData) {
      this.templeteForm.patchValue({ templeteName: this._data.templeteData.templateName })
    }

    this.importService.updateTempList.subscribe((data: any) => {
      if (data) {
        if (data.TemplateName) {
          this.templeteForm.patchValue({ templeteName: data.TemplateName })
        }
      }
    })

    if (this._data.templeteData) {
      this.findUpdateftp = this.importService.ftpAccountListData.find(data => data.FolderConfigId === this._data.tempData.mapping[0].folderConfigId)
      if (this.findUpdateftp) {
        this.templeteForm.patchValue({ ftpAccount: this.findUpdateftp })
        this.templeteForm.get('ftpAccount')?.disable()
      }
      this.updateData = true
      if (this._data.templeteData.length == 0) {
        this.updateData = false
      }
    } else {
      this.templeteForm.patchValue({ templeteName: '' })

    }
  }

  /**
   * Create user form
   *
   * @returns {FormGroup}
   */
  createTempleteForm(): any {
    this.templeteForm = this._formBuilder.group({
      templeteName: ['', Validators.required],
      ftpAccount: ['', Validators.required],
    });

    this.getFtpAccount()
  }

  getFtpAccount() {
    if (this.importService.ftpAccountListData) {
      this.ftpAccountList = this.importService.ftpAccountListData
    }
  }
  async saveTemplateWithMapping() {
    if (this._data && this._data.fileType == "odeoFile") {
      this.saveMappingToDatabase(this._data.fileData)
    } else {
      this.templeteForm.markAllAsTouched();
      let checkValidOrNot = this.columns.filter((column: any) => column.selectedOption !== '')
      if (!(checkValidOrNot && checkValidOrNot.length > 0)) {
        this.snackBar.error('Mapping is required \n',);
        return
      }
      this._spinner.show()
      let body = {
        TemplateName: this.templeteForm.value.templeteName,
        mapping: checkValidOrNot,
      }
      const xmlData = this.convertJsonToXml(body);
      const removeDuplicateXmlData = (xmlData) => {
        return new Promise((resolve, reject) => {
          xml2js.parseString(xmlData, (err, result) => {
            if (err) {
              reject(err);
              console.error('Error parsing XML:', err);
              return;
            }

            // Access the parsed XML structure
            const mapping = result.mapping;

            // Keep track of encountered columns
            const encounteredColumns: Set<string> = new Set();
            const encounteredColumnsforColunm = new Map();
            // Access and modify columns
            const columns = mapping.columns[0].column;
            const filters = mapping.filters[0].filter;

            for (let i = columns.length - 1; i >= 0; i--) {
              const column = columns[i];
              const columnId = column.$.id;
              const columnName = column.$.name;
              const filter = column.$.filter;
              const required = column.$.required
              const upperCase = column.$.upperCase

              // Check if this column has been encountered before
              const columnKey = `${columnId}${columnName}`;
              // console.log(columnKey, 'coloumkey')
              if (encounteredColumnsforColunm.has(columnKey)) {
                if ((filter !== "" && filter != undefined) || required != undefined || upperCase != undefined) {
                  const index = columns.findIndex(item =>
                    (item.$.id + item.$.name === columnKey) && (item.$['filter'] === undefined && (item.$['required'] === undefined && item.$['upperCase'] === undefined)));

                  if (index !== -1) {
                    columns.splice(index, 1);
                  }
                  // If the current column has a filter, mark the previous one without a filter for removal
                  // columns.splice(encounteredColumnsforColunm.get(columnKey), 1);
                } else {
                  // If the current column doesn't have a filter, mark it for removal
                  columns.splice(i, 1);
                }
              } else {
                // If not encountered, add to the map with the index
                encounteredColumnsforColunm.set(columnKey, i);
              }
            }

            if (filters) {
              for (let i = filters.length - 1; i >= 0; i--) {
                const filter = filters[i];
                const filterId = filter.$.id;

                // Check if this column has been encountered before
                const columnKey = `${filterId}`;
                if (encounteredColumns.has(columnKey)) {
                  // If encountered, remove the duplicate column
                  filters.splice(i, 1);
                } else {
                  // If not encountered, add to the set of encountered columns
                  encounteredColumns.add(columnKey);
                }
              }
            }

            // Convert the modified structure back to XML
            const builder = new xml2js.Builder();
            const modifiedXml = builder.buildObject(result);
            resolve(modifiedXml);
          })
        })
      }
      const result: any = await removeDuplicateXmlData(xmlData);
      // download xml file 
      // this.saveToFile(result, '');
      this.saveMappingToDatabase(result)
    }
  }

  async saveMappingToDatabase(result: any) {
    this._spinner.show()
    let ftpFolderConfigId: any = ''
    if (this.templeteForm.value.ftpAccount) {
      ftpFolderConfigId = this.templeteForm.value.ftpAccount
    }

    const blob = new Blob([result], { type: 'application/xml' });
    // let user: any = JSON.parse(localStorage.getItem('user'))
    if (this.customerService.editCrateUser && this.customerService.editCrateUser.user) {

      let accountData: any = this.customerService.editCrateUser.user
      const formData = new FormData()
      formData.append('accountNumber', accountData.AccountNumber);
      if (ftpFolderConfigId && ftpFolderConfigId.FolderConfigId && ftpFolderConfigId.WarehouseId) {
        formData.append('warehouseId', ftpFolderConfigId.WarehouseId);
        this.importService.mappingWarehouseData = ftpFolderConfigId.WarehouseId
        formData.append('folderConfigId', ftpFolderConfigId.FolderConfigId);

      } else if (this.findUpdateftp && this.findUpdateftp.FolderConfigId && this.findUpdateftp.WarehouseId) {
        formData.append('warehouseId', this.findUpdateftp?.WarehouseId);
        this.importService.mappingWarehouseData = this.findUpdateftp?.WarehouseId
        formData.append('folderConfigId', this.findUpdateftp?.FolderConfigId);

      }
      formData.append('file', blob);
      this.customerService.createMapping(formData).then(res => {
        if (res) {
          if (ftpFolderConfigId && ftpFolderConfigId.FolderConfigId && ftpFolderConfigId.WarehouseId) {
            res.WarehouseId = ftpFolderConfigId.WarehouseId;
          } else if (this.findUpdateftp && this.findUpdateftp.FolderConfigId && this.findUpdateftp.WarehouseId) {
            res.WarehouseId = this.findUpdateftp.WarehouseId;
          }
          this.snackBar.success(res.message);
          this._spinner.hide()
          this.matDialogRef.close()
          let body = [res]
          this.importService.updateTempList.next(body)
          // this.router.navigate(['/accounts'])
        }
      }).catch((err: any) => {
        this._spinner.hide()
        this.snackBar.error(err.error.errorMessage);
      });
    } else {
      this._spinner.hide()
      this.snackBar.error('User data not found. Please try to refresh with F5');
    }


    // old code

    // let user: any = JSON.parse(localStorage.getItem('user'))
    // if (this.customerService.editCrateUser && this.customerService.editCrateUser.user && user) {

    //   let accountData: any = this.customerService.editCrateUser.user
    //   const formData = new FormData()
    //   formData.append('accountNumber', accountData.AccountNumber);
    //   formData.append('warehouseId', user.WareHouseId);
    //   if (ftpFolderConfigId && ftpFolderConfigId.FolderConfigId) {
    //     formData.append('folderConfigId', ftpFolderConfigId.FolderConfigId);
    //   }
    //   formData.append('file', blob);

    //   if (this.customerService.mappingData && this.customerService.mappingData.length > 0 && this.customerService.mappingData[0].id) {
    //     await this.customerService.deleteMapping(this.customerService.mappingData[0].id).then((response: any) => {
    //       if (response) {
    //       }
    //     }).catch((e) => {
    //       this.snackBar.error('error while updating mapping');
    //     });
    //   }
    //   this.customerService.createMapping(formData).then(res => {
    //     if (res) {
    //       this.snackBar.success(res.message);
    //       this._spinner.hide()
    //       this.matDialogRef.close(res)
    //       // this.router.navigate(['/accounts'])
    //     }
    //   }).catch((err: any) => {
    //     this._spinner.hide()
    //     this.snackBar.error(err.error.errorMessage);
    //   });
    // } else {
    //   this._spinner.hide()
    //   this.snackBar.error('User data not found. Please try to refresh with F5');
    // }
  }

  xmlColumn(item: any) {
    const result: any[] = [];

    if (item.eithercolumn) {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let randomString = '';

      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
      }

      let count = 0
      item.multipleMapping.map((data: any) => {
        const body: any = {
          $: {
            id: `c_${item.multipleMapping[0].column.length >= 5 ? item.multipleMapping[0].column.substring(0, 5) + randomString : item.multipleMapping[0].column + randomString}`,
            name: data.column,
          },
        };
        item.eithercolumnID = body["$"].id;
        if (item && item.filter && item.filter.length > 0) {
          if (count == 0) {
            body.$.filter = item.multipleMapping[0].column;
            count++
          }
        }

        if (item.required) {
          body.$.required = item.required;
        }

        if (item.upperCase) {
          body.$.upperCase = item.upperCase;
        }
        result.push(body);
      })
      count = 0

    } else if (item.firstorlast || item.lastornothing) {
      const wordsMatch = item.name.match(/\{(.*?)\}/g);
      let count = 0
      const processedWords: string[] | null = wordsMatch
        ? wordsMatch.map(word => word.replace(/[{}]/g, '').replace(/firstorlast|lastornothing/gi, ''))
        : null;

      if (processedWords) {
        processedWords.map((word: any) => {
          const body: any = {
            $: {
              id: `c_${word}`,
              name: word,
            },
          };

          if (item && item.filter && item.filter.length > 0) {
            if (count == 0) {
              body.$.filter = processedWords[0];
              count++
            }
          }

          if (item.required) {
            body.$.required = item.required;
          }

          if (item.upperCase) {
            body.$.upperCase = item.upperCase;
          }
          result.push(body);
        })
        count = 0
      } else {
        const body: any = {
          $: {
            id: `c_${item.name}`,
            name: item.name,
          },
        };

        if (item && item.filter && item.filter.length > 0) {
          if (count == 0) {
            body.$.filter = processedWords[0];
            count++
          }
        }

        if (item.required) {
          body.$.required = item.required;
        }

        if (item.upperCase) {
          body.$.upperCase = item.upperCase;
        }
        result.push(body);
      }
    } else {

      if (item.multipleMapping && item.multipleMapping.length > 0) {
        const wordsMatch = item.name.match(/\{(.*?)\}/g);
        let count = 0
        const processedWords: string[] | null = wordsMatch
          ? wordsMatch.map(word => word.replace(/[{}]/g, ''))
          : null;

        if (processedWords) {
          processedWords.map((word: any) => {
            const body: any = {
              $: {
                id: `c_${word}`,
                name: word,
              },
            };

            if (item && item.filter && item.filter.length > 0) {
              if (count == 0) {
                body.$.filter = processedWords[0];
                count++
              }
            }

            if (item.required) {
              body.$.required = item.required;
            }

            if (item.upperCase) {
              body.$.upperCase = item.upperCase;
            }
            result.push(body);
          })
          count = 0
        } else {
          const body: any = {
            $: {
              id: `c_${item.name}`,
              name: item.name,
            },
          };

          if (item && item.filter && item.filter.length > 0) {
            body.$.filter = item.name;
          }

          if (item.required) {
            body.$.required = item.required;
          }

          if (item.upperCase) {
            body.$.upperCase = item.upperCase;
          }
          result.push(body);
        }
      } else {
        // When eithercolumn is false, create individual elements for each column
        const body: any = {
          $: {
            id: `c_${item.name}`,
            name: item.name,
          },
        };

        if (item && item.filter && item.filter.length > 0) {
          body.$.filter = item.name;
        }

        if (item.required) {
          body.$.required = item.required;
        }

        if (item.upperCase) {
          body.$.upperCase = item.upperCase;
        }
        result.push(body);
      }
    }
    return result;
  }

  private convertJsonToXml(data: any): any {
    const mapping = {
      mapping: {
        $: { title: data.TemplateName },
        defaults: { $: { trim: 'true' } },
        columns: {
          column: data.mapping.flatMap((item) => this.xmlColumn(item)),
        },
        fields: {
          field: data.mapping.map(item => {
            const mappingValue = this.buildFieldMapping(item, item.name);
            return {
              $: { id: item.selectedOption, mapping: mappingValue },
            };
          }),
        },
        filters: {
          filter: data.mapping
            .filter(item => item.filter && item.filter.length > 0)
            .map(item => ({
              $: { id: this.filterIdCheck(item) },
              items: {
                item: item.filter.map(filterItem => ({
                  $: this.filterItem(filterItem),
                })),
              },
            })),
        },
      },
    };
    const builder = new xml2js.Builder();
    return builder.buildObject(mapping);
  }

  filterIdCheck(item: any) {
    if (item.firstorlast || item.lastornothing) {
      const wordsMatch = item.name.match(/\{(.*?)\}/g);
      const processedWords: string[] | null = wordsMatch
        ? wordsMatch.map(word => word.replace(/[{}]/g, '').replace(/firstorlast|lastornothing/gi, ''))
        : null;
      return processedWords[0];
    } else if (item.eithercolumn) {
      return item.multipleMapping[0].column;
    } else {
      if (item.multipleMapping && item.multipleMapping.length > 0) {
        return item.multipleMapping[0].column
      } else {
        return item.name
      }
    }
  }

  private buildFieldMapping(multipleMapping: any, defaultName: string): string {
    let mappingValue = '';
    if (multipleMapping.multipleMapping.length > 0) {
      multipleMapping.multipleMapping.forEach((mapping, index) => {
        if (multipleMapping.multiplemapping) {
          if (index > 0) {
            mappingValue += mapping.separator;
          }
          mappingValue += `{c_${mapping.column}}`
        } else if (multipleMapping.firstorlast) {
          mappingValue += `{c_${mapping.separator}}`;
          mappingValue += ',';
          mappingValue += `{c_${mapping.column}}`;

        } else if (multipleMapping.lastornothing) {
          mappingValue += `{c_${mapping.separator}}`;
          mappingValue += ',';
          mappingValue += `{c_${mapping.column}}`;
        } else if (multipleMapping.eithercolumn) {
          if (index == 0) {
            if (multipleMapping.eithercolumnID) {
              mappingValue += `{${multipleMapping.eithercolumnID}}`;
            } else {
              mappingValue += `{c_${multipleMapping.multipleMapping[0].column.length >= 5 ? multipleMapping.multipleMapping[0].column.substring(0, 5) : multipleMapping.multipleMapping[0].column}}`;
            }
          }
        } else {
          if (index > 0) {
            mappingValue += mapping.separator;
          }
          mappingValue += `{c_${mapping.column}}`
        }
      });
    } else {
      mappingValue = `{c_${defaultName}}`;
    }
    if (multipleMapping.lastornothing) {
      return `%%#LastOrNothing(${mappingValue})#%%`;
    } else if (multipleMapping.firstorlast) {
      return `%%#FirstOrLast(${mappingValue})#%%`;
    } else {
      return `%%${mappingValue}%%`;
    }
  }


  filterItem(item: any) {
    let result: any = {}
    result.search = item.search
    result.replace = item.replace
    result.searchType = item.searchType
    result.ignoreCase = item.ignoreCase
    result.replaceWholeField = item.replaceWholeField
    return result
  }

  // download xml file for testing purposes

  private saveToFile(data: any, filename: string) {
    const blob = new Blob([data], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'data.xml';

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
