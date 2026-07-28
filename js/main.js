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
  if (form) {
    var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbz_MQyTwjbIGuRaf2Wa5kGPAKkM-LVT4p51kzqPnDwuXMvK_667EfzGP1TJPrWs4ue4vg/exec';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = document.getElementById('name').value.trim();
      var company = document.getElementById('company').value.trim();
      var phone = document.getElementById('phone').value.trim();
      var interest = document.getElementById('interest').value;
      var message = document.getElementById('message').value.trim();

      var waText = "Hi, I'm " + name + (company ? ' from ' + company : '') + '. I\'m interested in ' + interest + '. ' + (message || '');

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

        // sendBeacon survives the page navigating away right after; fetch may not.
        if (navigator.sendBeacon) {
          var blob = new Blob([JSON.stringify(payload)], { type: 'text/plain;charset=utf-8' });
          navigator.sendBeacon(SHEET_ENDPOINT, blob);
        } else {
          fetch(SHEET_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify(payload)
          }).catch(function () {});
        }

        window.location.href = '/thank-you.html?wa=' + encodeURIComponent(waText);
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
  }

  function initCarousel(trackId, prevId, nextId) {
    var track = document.getElementById(trackId);
    var prevBtn = document.getElementById(prevId);
    var nextBtn = document.getElementById(nextId);
    if (!track || !prevBtn || !nextBtn) return;

    function step() {
      var item = track.children[0];
      return item ? item.getBoundingClientRect().width + 1 : track.clientWidth;
    }
    function updateButtons() {
      var maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 2;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 2;
    }
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' });
    });
    track.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);
    updateButtons();
  }
  initCarousel('productsTrack', 'productsPrev', 'productsNext');
  initCarousel('galleryTrack', 'galleryPrev', 'galleryNext');

  var waFollowUp = document.getElementById('waFollowUp');
  if (waFollowUp) {
    var params = new URLSearchParams(window.location.search);
    var waParam = params.get('wa');
    var SALES_PHONE = '918052614858';
    var text = waParam || "Hi, I just submitted a requirement on your website.";
    waFollowUp.href = 'https://wa.me/' + SALES_PHONE + '?text=' + encodeURIComponent(text);
  }
});
