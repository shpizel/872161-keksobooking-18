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
  var lastDialogNode;
  /* Variables END */

  /* Code START */
  var onDialogClick = function () {
    remove();
  };

  var onMessageClick = function (evt) {
    evt.stopPropagation();
  };

  var remove = function () {
    document.removeEventListener('keydown', onEscPressed);
    window.tools.removeNode(lastDialogNode);
  };

  var onEscPressed = window.tools.onEscPressed(remove);

  var showError = function (errorMessage, retryCallback) {
    var dialogNode = errorDialogTemplate.cloneNode(true);

    var messageNode = dialogNode.querySelector('.error__message');
    messageNode.textContent = errorMessage;
    messageNode.addEventListener('click', onMessageClick);

    dialogNode.addEventListener('click', onDialogClick);

    var errorButton = dialogNode.querySelector('.error__button');
    var onRetry = function () {
      retryCallback();
      remove();
    };
    errorButton.addEventListener('click', onRetry);

    mainNode.appendChild(dialogNode);
    lastDialogNode = mainNode.querySelector(ERROR_DIALOG_CLASS_NAME);

    document.addEventListener('keydown', onEscPressed);
  };

  var showSuccess = function (successMessage) {
    var dialogNode = successDialogTemplate.cloneNode(true);

    var messageNode = dialogNode.querySelector('.success__message');
    if (successMessage) {
      messageNode.textContent = successMessage;
    }
    messageNode.addEventListener('click', onMessageClick);

    dialogNode.addEventListener('click', onDialogClick);

    mainNode.appendChild(dialogNode);
    lastDialogNode = mainNode.querySelector(SUCCESS_DIALOG_CLASS_NAME);

    document.addEventListener('keydown', onEscPressed);
  };

  window.dialogs = {
    showError: showError,
    showSuccess: showSuccess
  };
  /* Code END */
})();
