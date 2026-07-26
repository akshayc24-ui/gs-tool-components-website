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
  var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw56eVbr-VWfZTp8gyyzi2HTx7Fjd-TYR_gefDli1pHIge4702f5hWrzxreoYzDtzWcig/exec';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = document.getElementById('name').value.trim();
    var company = document.getElementById('company').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var interest = document.getElementById('interest').value;
    var message = document.getElementById('message').value.trim();

    var waText = encodeURIComponent(
      "Hi, I'm " + name + (company ? ' from ' + company : '') + '. I\'m interested in ' + interest + '. ' + (message || '')
    );
    waFollowUp.href = 'https://wa.me/' + SALES_PHONE + '?text=' + waText;

    var submitted = false;
    function submitLead(location) {
      if (submitted) return;
      submitted = true;

      var payload = {
        name: name,
        company: company,
        phone: phone,
        interest: interest,
        message: message,
        city: (location && location.city) || '',
        region: (location && location.region) || '',
        country: (location && location.country) || ''
      };

      fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(function () {});

      form.style.display = 'none';
      thankYou.classList.add('show');
    }

    // Best-effort visitor location lookup (IP-based, no permission prompt).
    // Never blocks submission -- falls back to blank location after 2s or on error.
    var geoTimeout = setTimeout(function () { submitLead(null); }, 2000);
    fetch('https://ipwho.is/')
      .then(function (r) { return r.json(); })
      .then(function (geo) {
        clearTimeout(geoTimeout);
        submitLead(geo);
      })
      .catch(function () {
        clearTimeout(geoTimeout);
        submitLead(null);
      });
  });
});
