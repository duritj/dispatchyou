/* ============================================================
   forms.js — deliver every form to Formspree (one inbox).

   SETUP (one step):
   1. Create a free form at https://formspree.io  (any email you own).
   2. Copy the form's endpoint, e.g. https://formspree.io/f/abcdwxyz
   3. Paste the ID part below, replacing YOUR_FORM_ID.

   Until you do that, the forms keep showing their on-page
   "thanks" message but do not send anywhere. Once the ID is set,
   every completed form is emailed to you, tagged by a subject
   line and the page it came from.
   ============================================================ */

(function () {
  var ENDPOINT = 'https://formspree.io/f/mdekprng';   /* <-- paste your Formspree ID here */

  /* Not configured yet: leave the on-page confirmation as-is, send nothing. */
  if (ENDPOINT.indexOf('/f/') === -1) return;

  function subjectFor(form) {
    if (form.dataset.subject) return form.dataset.subject;
    var byId = {
      newsForm:    'DispatchYou — newsletter signup',
      contactForm: 'DispatchYou — contact message',
      applyForm:   'DispatchYou — job application'
    };
    return byId[form.id] || 'DispatchYou — quote request';
  }

  document.querySelectorAll('form').forEach(function (form) {
    if (form.dataset.noFormspree !== undefined) return;

    /* Spam honeypot: real people never see or fill this. */
    var trap = document.createElement('input');
    trap.type = 'text';
    trap.name = '_gotcha';
    trap.tabIndex = -1;
    trap.autocomplete = 'off';
    trap.setAttribute('aria-hidden', 'true');
    trap.style.cssText = 'position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0;pointer-events:none';
    form.appendChild(trap);

    /* Capture phase runs before the page's own submit handler, so we read
       the field values before that handler clears them or swaps in the
       thank-you panel. We only send when the form is actually valid. */
    form.addEventListener('submit', function (e) {
      if (form.__sending) return;
      if (!form.checkValidity()) return;   /* invalid: the page's validation handles it */
      e.preventDefault();                   /* we deliver via fetch, so stop any navigation */
      form.__sending = true;

      var data = new FormData(form);
      data.append('_subject', subjectFor(form));
      data.append('page', location.pathname.replace(/^\//, '') || 'home');

      fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      }).catch(function () {
        /* Network/endpoint error: the on-page thank-you still shows.
           Submissions can also be reviewed in the Formspree dashboard. */
      }).then(function () {
        form.__sending = false;
      });
    }, true);
  });
})();
