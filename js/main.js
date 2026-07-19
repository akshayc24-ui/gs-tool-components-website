document.addEventListener('DOMContentLoaded', function () {
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    var closeNav = function () {
      siteNav.setAttribute('data-open', 'false');
      navToggle.setAttribute('aria-expanded', 'false');
    };
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      siteNav.setAttribute('data-open', String(!isOpen));
      navToggle.setAttribute('aria-expanded', String(!isOpen));
    });
    siteNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeNav);
    });
  }

  var form = document.getElementById('leadForm');
  if (!form) return;

  var thankYou = document.getElementById('thankYou');
  var waFollowUp = document.getElementById('waFollowUp');
  var SALES_PHONE = '918052614858';
  var SALES_EMAIL = 'gstoolandcomponent@gmail.com';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var company = document.getElementById('company').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var interest = document.getElementById('interest').value;
    var message = document.getElementById('message').value.trim();

    var summary =
      'New enquiry from GS Tool & Components website:\n' +
      'Name: ' + name + '\n' +
      'Company: ' + (company || '-') + '\n' +
      'Phone: ' + phone + '\n' +
      'Interest: ' + interest + '\n' +
      'Message: ' + (message || '-');

    var waText = encodeURIComponent(
      "Hi, I'm " + name + (company ? ' from ' + company : '') + '. I\'m interested in ' + interest + '. ' + (message || '')
    );
    waFollowUp.href = 'https://wa.me/' + SALES_PHONE + '?text=' + waText;

    var mailSubject = encodeURIComponent('Website Enquiry — ' + interest);
    var mailBody = encodeURIComponent(summary);
    var mailtoLink = 'mailto:' + SALES_EMAIL + '?subject=' + mailSubject + '&body=' + mailBody;

    var mailAnchor = document.createElement('a');
    mailAnchor.href = mailtoLink;
    mailAnchor.style.display = 'none';
    document.body.appendChild(mailAnchor);
    mailAnchor.click();
    document.body.removeChild(mailAnchor);

    form.style.display = 'none';
    thankYou.classList.add('show');
  });
});
