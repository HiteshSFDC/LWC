import {
    LightningElement
} from 'lwc';
import {
    ShowToastEvent
} from 'lightning/platformShowToastEvent';

export default class Util extends LightningElement {

}

/**
 * @desc This method shows the error message toast.
 */
export function showErrorMessage(component, message) {
    showMessage(component, {
        title: "Error",
        message: message,
        messageType: 'error',
        mode: 'pester'
    });
}

/**
 * @desc This method shows the success message toast.
 */
export function showSuccessMessage(component, message) {
    showMessage(component, {
        title: "Success",
        message: message,
        messageType: 'success',
        mode: 'dismissable'
    });
}

/**
 * @desc This method shows the information message toast.
 */
export function showInfoMessage(component, message) {
    showMessage(component, {
        title: "Info",
        message: message,
        messageType: 'info',
        mode: 'dismissable'
    });
}

/**
 * @desc This method shows the wanrning message toast.
 */
export function showWarningMessage(component, message) {
    showMessage(component, {
        title: "Warning",
        message: message,
        messageType: 'warning',
        mode: 'pester'
    });
}

/**
 * @desc This method shows the wanrning message toast.
 */
export function showAsyncErrorMessage(component, error) {
    showMessage(component, {
        title: "Error",
        message: (error) ? ((error.message) ? error.message : ((error.body) ? ((error.body.message) ? error.body.message : JSON.stringify(error)) : JSON.stringify(error))) : "Something went wrong!",
        messageType: 'error',
        mode: 'pester'
    });
}

/**
 * @desc This method shows the message toast.
 */
export function showMessage(component, {
    title,
    message,
    messageType,
    mode
}) {

    component.dispatchEvent(new ShowToastEvent({
        mode,
        title,
        message,
        variant: messageType,
    }));
}