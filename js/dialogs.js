'use strict';

(function () {
  /* Constants START */
  var ERROR_DIALOG_CLASS_NAME = '.error';
  var SUCCESS_DIALOG_CLASS_NAME = '.success';

  var errorDialogTemplate = document.querySelector('#error').content;
  var successDialogTemplate = document.querySelector('#success').content;
  var mainNode = document.querySelector('main');
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
    var onErrorButtonClick = function () {
      closeErrorDialog();
      onRetry();
    };
    errorButton.addEventListener('click', onErrorButtonClick);
    closeSuccessDialog();
    mainNode.appendChild(errorDialog);
    errorDialogNode = mainNode.querySelector(ERROR_DIALOG_CLASS_NAME);
    errorDialogNode.addEventListener('click', closeErrorDialog);
    document.addEventListener('keydown', closeErrorDialogOnEscPressed);
  };

  var closeErrorDialog = function () {
    if (errorDialogNode) {
      window.tools.removeNode(errorDialogNode);
      errorDialogNode = undefined;
      document.removeEventListener('keydown', closeErrorDialogOnEscPressed);
    }
  };

  var closeErrorDialogOnEscPressed = window.tools.onEscPressed(closeErrorDialog);

  var showSuccessDialog = function () {
    if (successDialogNode) {
      return;
    }
    var successDialog = successDialogTemplate.cloneNode(true);
    successDialog.querySelector(SUCCESS_DIALOG_CLASS_NAME).addEventListener('click', closeSuccessDialog);
    document.addEventListener('keydown', closeSuccessDialogOnEscapeKeyDown);
    closeErrorDialog();
    mainNode.appendChild(successDialog);
    successDialogNode = mainNode.querySelector(SUCCESS_DIALOG_CLASS_NAME);
  };

  var closeSuccessDialog = function () {
    if (successDialogNode) {
      window.tools.removeNode(successDialogNode);
      document.removeEventListener('keydown', closeSuccessDialogOnEscapeKeyDown);
      successDialogNode = undefined;
    }
  };

  var closeSuccessDialogOnEscapeKeyDown = window.tools.onEscPressed(closeSuccessDialog);

  window.dialogs = {
    showErrorDialog: showErrorDialog,
    closeErrorDialog: closeErrorDialog,
    showSuccessDialog: showSuccessDialog,
    closeSuccessDialog: closeSuccessDialog
  };
  /* Code END */
})();
