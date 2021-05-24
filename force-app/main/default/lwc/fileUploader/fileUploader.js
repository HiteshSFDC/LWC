import {
    LightningElement,
    api
} from 'lwc';

import {
    showAsyncErrorMessage,
    showSuccessMessage
} from 'c/util';

import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class FileUploader extends LightningElement {

    @api recordId;

    //This method fires after files got uploaded
    handleUploadFinished(event) {

        try {
            const uploadedFiles = event.detail.files;
            //show success toast message        
            const evt = new ShowToastEvent({
                title: 'File Upload Status...',
                message: uploadedFiles.length + 'file(s) uploaded successfully.',
                variant: 'success',
            });
            this.dispatchEvent(evt);
            showSuccessMessage(this, `${uploadedFiles.length} file(s) uploaded successfully.`);

            let childCmp = this.template.querySelector('c-attachments-viewer');
            if (childCmp) {
                childCmp.refresh(this.recordId);
            }
        } catch (e) {
            showAsyncErrorMessage(this, e);
        }
    }
}