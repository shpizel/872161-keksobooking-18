'use strict';

(function () {
  /* Constants START */
  var errorDialogTemplate = document.querySelector('#error').content;
  var successDialogTemplate = document.querySelector('#success').content;
  var mainBlock = document.querySelector('main');
  var ERROR_DIALOG_CLASSNAME = '.error';
  var SUCCESS_DIALOG_CLASSNAME = '.success';
  /* Constants END */

  /* Variables START */
  var errorDialogNode;
  var successDialogNode;
  /* Variables END */

  /* Code START */
  var showErrorDialog = function (onRetry) {
    if (errorDialogNode) {
      return;
    }
    var errorDialog = errorDialogTemplate.cloneNode(true);
    var errorButton = errorDialog.querySelector('.error__button');
    errorButton.addEventListener('click', function () {
      closeErrorDialog();
      onRetry();
    });
    closeSuccessDialog();
    mainBlock.appendChild(errorDialog);
    errorDialogNode = mainBlock.querySelector(ERROR_DIALOG_CLASSNAME);
    errorDialogNode.addEventListener('click', closeErrorDialog);
    document.addEventListener('keydown', closeErrorDialogOnEscPressed);
  };

  var closeErrorDialog = function () {
    if (errorDialogNode) {
      errorDialogNode.parentElement.removeChild(errorDialogNode);
      errorDialogNode = undefined;
      document.removeEventListener('keydown', closeErrorDialogOnEscPressed);
    }
  };

  var closeErrorDialogOnEscPressed = function (evt) {
    window.tools.onEscPressed(evt, closeErrorDialog);
  };

  var showSuccessDialog = function () {
    if (successDialogNode) {
      return;
    }
    var successDialog = successDialogTemplate.cloneNode(true);
    successDialog.querySelector(SUCCESS_DIALOG_CLASSNAME).addEventListener('click', closeSuccessDialog);
    document.addEventListener('keydown', closeSuccessDialogOnEscapeKeyDown);
    closeErrorDialog();
    mainBlock.appendChild(successDialog);
    successDialogNode = mainBlock.querySelector(SUCCESS_DIALOG_CLASSNAME);
  };

  var closeSuccessDialog = function () {
    if (successDialogNode) {
      successDialogNode.parentNode.removeChild(successDialogNode);
      document.removeEventListener('keydown', closeSuccessDialogOnEscapeKeyDown);
      successDialogNode = undefined;
    }
  };

  var closeSuccessDialogOnEscapeKeyDown = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      closeSuccessDialog();
    }
  };

  window.dialogs = {
    showErrorDialog: showErrorDialog,
    closeErrorDialog: closeErrorDialog,
    showSuccessDialog: showSuccessDialog,
    closeSuccessDialog: closeSuccessDialog
  };
  /* Code END */
})();
