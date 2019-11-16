'use strict';

(function () {
  /* Constants START */
  var ERROR_DIALOG_CLASS_NAME = '.error';
  var SUCCESS_DIALOG_CLASS_NAME = '.success';

  var errorDialogTemplate = document.querySelector('#error').content.querySelector(ERROR_DIALOG_CLASS_NAME);
  var successDialogTemplate = document.querySelector('#success').content.querySelector(SUCCESS_DIALOG_CLASS_NAME);
  var mainNode = document.querySelector('main');
  /* Constants END */

  /* Variables START */
  var dialogNode;
  /* Variables END */

  /* Code START */
  var showError = function (retryCallback) {
    var errorDialog = errorDialogTemplate.cloneNode(true);
    var onClick = function () {
      remove();
    };
    errorDialog.addEventListener('click', onClick);

    var errorButton = errorDialog.querySelector('.error__button');
    var onRetry = function () {
      retryCallback();
      remove();
    };
    errorButton.addEventListener('click', onRetry);

    mainNode.appendChild(errorDialog);
    dialogNode = mainNode.querySelector(ERROR_DIALOG_CLASS_NAME);
    document.addEventListener('keydown', onEscPressed);
  };

  var remove = function () {
    document.removeEventListener('keydown', onEscPressed);
    window.tools.removeNode(dialogNode);
  };

  var onEscPressed = window.tools.onEscPressed(remove);

  var showSuccess = function () {
    var successDialog = successDialogTemplate.cloneNode(true);
    var onClick = function () {
      remove();
    };
    successDialog.addEventListener('click', onClick);
    document.addEventListener('keydown', onEscPressed);
    mainNode.appendChild(successDialog);
    dialogNode = mainNode.querySelector(SUCCESS_DIALOG_CLASS_NAME);
  };

  window.dialogs = {
    showError: showError,
    showSuccess: showSuccess
  };
  /* Code END */
})();
