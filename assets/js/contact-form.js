// Contact form: validation + AJAX submit
(function () {
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }

  document.addEventListener('DOMContentLoaded', function () {
    var form = $('#contact form');
    if (!form) return;

    // Ensure we have a message/status container
    var statusEl = document.createElement('div');
    statusEl.id = 'contact-form-status';
    statusEl.style.display = 'none';
    statusEl.className = 'rounded-2xl p-4 mb-4 text-sm border';
    form.parentNode.insertBefore(statusEl, form); // place above form card content

    // Add a honeypot field if not present
    if (!form.querySelector('input[name="website"]')) {
      var hp = document.createElement('input');
      hp.type = 'text';
      hp.name = 'website';
      hp.autocomplete = 'off';
      hp.tabIndex = -1;
      hp.setAttribute('aria-hidden', 'true');
      hp.style.display = 'none';
      form.appendChild(hp);
    }

    function setStatus(ok, message) {
      statusEl.textContent = message;
      statusEl.style.display = 'block';
      // Set classes (for environments where Tailwind CDN picks them up)
      statusEl.className = 'rounded-2xl p-4 mb-4 text-sm border ' + (ok
        ? 'bg-green-50 text-green-700 border-green-200'
        : 'bg-red-50 text-red-700 border-red-200');
      // Also set inline styles as a fallback
      statusEl.style.border = ok ? '1px solid #BBF7D0' : '1px solid #FECACA';
      statusEl.style.backgroundColor = ok ? '#F0FDF4' : '#FEF2F2';
      statusEl.style.color = ok ? '#047857' : '#B91C1C';
    }

    function getLang() {
      try { return (typeof currentLanguage !== 'undefined') ? currentLanguage : (document.documentElement.lang || 'en'); }
      catch (_) { return document.documentElement.lang || 'en'; }
    }

    function validate(fields) {
      var errors = [];
      if (!fields.name || fields.name.trim().length < 2) {
        errors.push(getLang() === 'ar' ? 'الرجاء إدخال اسم صالح.' : 'Please enter a valid name.');
      }
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email || '');
      if (!emailOk) {
        errors.push(getLang() === 'ar' ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email.');
      }
      if (!fields.message || fields.message.trim().length < 10) {
        errors.push(getLang() === 'ar' ? 'يجب أن تحتوي الرسالة على 10 أحرف على الأقل.' : 'Message must be at least 10 characters.');
      }
      if (fields.phone && fields.phone.replace(/\D+/g, '').length < 7) {
        errors.push(getLang() === 'ar' ? 'يرجى إدخال رقم هاتف صالح.' : 'Please enter a valid phone number.');
      }
      return errors;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('button[type="submit"]');
      var origBtnHtml = btn ? btn.innerHTML : '';
      if (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.7';
        btn.innerHTML = (getLang() === 'ar' ? 'جاري الإرسال...' : 'Sending...');
      }

      var fields = {
        name: $('#name', form) ? $('#name', form).value : '',
        email: $('#email', form) ? $('#email', form).value : '',
        phone: $('#phone', form) ? $('#phone', form).value : '',
        message: $('#message', form) ? $('#message', form).value : ''
      };

      var errors = validate(fields);
      if (errors.length) {
        setStatus(false, errors.join(' '));
        if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.innerHTML = origBtnHtml; }
        return;
      }

      var fd = new FormData(form);

      fetch('contact-form.php', {
        method: 'POST',
        body: fd,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(function (res) { return res.json().catch(function(){ return { success:false, message: 'Invalid server response' }; }); })
      .then(function (data) {
        if (data && data.success) {
          setStatus(true, getLang() === 'ar' ? 'شكراً لتواصلك! تم إرسال رسالتك بنجاح.' : 'Thanks! Your message has been sent.');
          form.reset();
        } else {
          var msg = (data && data.message) ? data.message : (getLang() === 'ar' ? 'تعذر الإرسال. يرجى المحاولة لاحقاً.' : 'Failed to send. Please try again later.');
          setStatus(false, msg);
        }
      })
      .catch(function () {
        setStatus(false, getLang() === 'ar' ? 'حدث خطأ غير متوقع. حاول مرة أخرى.' : 'Unexpected error. Please try again.');
      })
      .finally(function () {
        if (btn) { btn.disabled = false; btn.style.opacity = ''; btn.innerHTML = origBtnHtml; }
      });
    });
  });
})();
