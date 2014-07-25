
window.optly = window.optly || {};
window.optly.mrkt = window.optly.mrkt || {};
var baseUrl = document.URL;
var History = window.History || {};

var $elms = {
  signup: $('[data-opty-modal="signup"]'),
  signin: $('[data-opty-modal="signin"]')
};

function setHistoryId(stateData) {
  if(stateData._id) {
    stateData._id += 1;
  }
  else if (sessionStorage._id) {
    stateData._id = Number(sessionStorage._id) + 1;
  }
  else {
    stateData._id = 1;
  }
}

function openModalHandler() {
  var modalType = $(this).data('modal-click');
  var stateData = History.getState().data;
  stateData.modalType = modalType;
  setHistoryId(stateData);
  History.pushState(stateData, 'modal open', baseUrl);
  window.optly.mrkt.openModal( modalType );
}

function closeModalHandler(e) {
  var $modalCont = $(this);
  var $clickedElm = $(e.target);
  if ( $modalCont.find(e.target).length === 0 || $clickedElm.data('modal-btn') === 'close' ) {
    // move history back because this event is outside of the history navigation state
    History.back();
  }
}

function storeModalState(modalType, modalOpen) {
  // set the modal type and last type for an open event
  if (modalOpen) {
    sessionStorage.modalType = modalType;
    sessionStorage.lastType = '';
  } 
  // set the modal type and last type for an close event
  else {
    sessionStorage.modalType = '';
    sessionStorage.lastType = modalType;
  }

  // increment the session modal state ID if it has currently been set
  if (sessionStorage._id) {
    sessionStorage._id = Number(sessionStorage._id) + 1;
  } 
  // create the session modal state ID if it doesn't exist
  else {
    sessionStorage._id = 1;
  }
}

window.optly.mrkt.openModal = function(modalType) {
  var $elm = $elms[ modalType ];

  // Update the modal state in the session storage
  storeModalState(modalType, true);

  // Fade out the modal and attach the close modal handler
  $elm.fadeToggle(function() {
    $elm.bind('click', closeModalHandler);
  });
};

window.optly.mrkt.closeModal = function(modalType) {
  var $elm = $elms[ modalType ];
  // Update the modal state in the session storage
  storeModalState(modalType, false);
  // Fade out the modal and remove the close modal handler
  $elm.fadeToggle(function() {
    $elm.unbind('click', closeModalHandler);
  });
};


function initiateModal() {
  //Trigger Dialog if # is present in URL
  if (History.getHash() === 'signup' || History.getHash() === 'signin') {
    // var stateData = {};
    // var historyState = History.getState().data;
    // stateData.modalType = History.getHash();
    // setHistoryId(stateData);
    // baseUrl = baseUrl.split('#')[0];
    // if (Object.keys(historyState).length === 0) {
    //   History.pushState(stateData, 'modal open', baseUrl);
    // } else {
    //   History.replaceState(stateData, 'modal open', baseUrl);
    // }
    // window.optly.mrkt.openModal(stateData.modalType);
  } 
  else if (sessionStorage.modalType === 'signup' || sessionStorage.modalType === 'signin') {
    modalType = sessionStorage.modalType;
    window.optly.mrkt.openModal(modalType);
  }
}

initiateModal();

window.addEventListener('popstate', function(e) {
  if (sessionStorage.modalType === '' || sessionStorage.modalType === undefined) {
    window.optly.mrkt.openModal(sessionStorage.lastType);
  }
  else {
    window.optly.mrkt.closeModal(sessionStorage.modalType);
  }
});


$(function() {
  $('[data-modal-click]').on('click', openModalHandler);
});

// Test for vh CSS property 
var testEl = $('#vh-test');
testEl.css({height: '100vh'});
var vhSupported = testEl.height() === window.innerHeight;

function setModalHeight() {
  if (window.innerWidth <= 720) {
    if (!vhSupported) {
      $elms.each(function(key, value) {
        value.css({height: window.innerHeight});
      });
    }
  }
}

$(window).bind('load resize', setModalHeight);
