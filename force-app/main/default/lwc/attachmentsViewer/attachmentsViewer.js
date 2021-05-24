import {
    LightningElement,
    api,
    track
} from 'lwc';

import {
    showAsyncErrorMessage,
} from 'c/util';

import {
    NavigationMixin
} from 'lightning/navigation';

import getFiles from '@salesforce/apex/AttachmentsController.getFiles';

export default class AttachmentsViewer extends NavigationMixin(LightningElement) {

    // api vars
    @api recordId;

    // track vars
    @track showSpinner = false;
    @track fileRecords = [];
    @track isCmpLoaded = false;

    connectedCallback() {
        this.fetchFiles(this.recordId);
    }

    /**
     * @author Hitesh Garg
     * @email hitesh.garg@mtxb2b.com
     * @date 20-Apr-2021
     * @desc this method is used to refresh the file list
     */
    @api
    refresh(recId) {
        this.fetchFiles(recId);
    }

    /**
     * @author Hitesh Garg
     * @email hitesh.garg@mtxb2b.com
     * @date 20-Apr-2021
     * @desc this method is used to fetch files form backend
     */
    @api
    fetchFiles(recordId) {
        if (!recordId) {
            return;
        }
        getFiles({
                recId: recordId
            })
            .then(result => {
                if (result && result.length > 0) {
                    this.fileRecords = result;

                    this.fileRecords = result.map(element => {
                        return {
                            fileId: element.Id,
                            fileName: element.Title,
                            filePath: element.PathOnClient,
                            fileType: element.FileType,
                            fileExtn: element.FileExtension,
                            fileConDocId: element.ContentDocumentId,
                            fileSize: this.formatSize(element.ContentSize),
                            fileDate: element.CreatedDate,
                            thumbnailPath: '/sfc/servlet.shepherd/version/renditionDownload?rendition=thumb120by90&versionId=' +
                                element.Id + '&operationContext=CHATTER&contentId=' + element.ContentDocumentId,
                            downloadUrl: '/sfc/servlet.shepherd/document/download/' + element.ContentDocumentId,
                            // view url navigates the user to the the standard content document page
                            viewUrl: '/lightning/r/ContentDocument/' + element.ContentDocumentId + '/view'
                        };
                    });
                    this.isCmpLoaded = true;
                }
            })
            .catch(error => {
                showAsyncErrorMessage(this, error);
            })
            .finally(() => this.showSpinner = false);
    }

    /**
     * @author Hitesh Garg
     * @email hitesh.garg@mtxb2b.com
     * @date 20-Apr-2021
     * @desc this method is used to format the file size
     */
    formatSize(bytes) {
        if (!bytes) {
            return '--';
        }
        let sizes = ['Bytes', 'KB', 'MB', 'GB'];
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        return parseFloat(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
    }

    /**
     * @author Hitesh Garg
     * @email hitesh.garg@mtxb2b.com
     * @date 20-Apr-2021
     * @desc this method is used to preview files
     */
    handlePreview(event) {
        this[NavigationMixin.Navigate]({
            type: 'standard__namedPage',
            attributes: {
                pageName: 'filePreview',
                recordId: event.target.dataset.id,
                objectApiName: 'ContentVersion',
                actionName: 'view',
            },
            state: {
                selectedRecordId: event.target && event.target.dataset && event.target.dataset.id ? event.target.dataset.id : undefined
            }
        });
    }
}