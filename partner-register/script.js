(function() {
  'use strict';

  var BASE_URL = 'http://localhost:3000';
  var CREATE_ENDPOINT = '/api/partners';

  function qs(sel, scope) { return (scope || document).querySelector(sel); }
  function qsa(sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); }

  function getSelectedCategories() {
    var boxes = qsa('input[name="itemsInterested"]');
    return boxes
      .filter(function(cb) { return cb.checked && cb.value !== 'select_all'; })
      .map(function(cb) { return cb.value; });
  }

  function showCategoryError(show) {
    var err = qs('#itemsInterestedError');
    if (!err) {
      var container = qs('.checkbox-container');
      if (container) {
        err = document.createElement('div');
        err.id = 'itemsInterestedError';
        err.style.color = 'red';
        err.style.fontSize = '12px';
        err.style.marginTop = '4px';
        container.parentNode.appendChild(err);
      }
    }
    if (err) {
      err.textContent = show ? 'Please select at least one category of work' : '';
      err.style.display = show ? 'block' : 'none';
    }
  }

  function disableSubmit(disabled) {
    var btn = qs('button[type="submit"]');
    if (btn) {
      btn.disabled = disabled;
      btn.style.opacity = disabled ? '0.7' : '1';
      btn.style.pointerEvents = disabled ? 'none' : 'auto';
    }
  }

  function collectFormData() {
    return {
      name: (qs('#partnerName') || {}).value ? qs('#partnerName').value.trim() : '',
      mobile: (qs('#mobile') || {}).value ? qs('#mobile').value.trim() : '',
      pan_number: (qs('#panNo') || {}).value ? qs('#panNo').value.trim() : '',
      address: (qs('#address') || {}).value ? qs('#address').value.trim() : '',
      city: (qs('#city') || {}).value ? qs('#city').value.trim() : '',
      bank_name: (qs('#bankName') || {}).value ? qs('#bankName').value.trim() : '',
      account_number: (qs('#accountNumber') || {}).value ? qs('#accountNumber').value.trim() : '',
      ifsc_code: (qs('#ifscCode') || {}).value ? qs('#ifscCode').value.trim() : '',
      category_of_work: getSelectedCategories()
    };
  }

  function validate(data) {
    if (!data.name) { alert('Name is required'); return false; }
    if (!data.mobile) { alert('Mobile is required'); return false; }
    if (!data.pan_number) { alert('PAN No. is required'); return false; }
    if (!data.city) { alert('City is required'); return false; }

    var cats = data.category_of_work || [];
    if (cats.length === 0) {
      showCategoryError(true);
      return false;
    } else {
      showCategoryError(false);
    }
    return true;
  }

  function toJSON(data) {
    return JSON.stringify(data);
  }

  async function postJSON(url, payload) {
    try {
      var res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: toJSON(payload)
      });
      var isJSON = res.headers.get('content-type') && res.headers.get('content-type').includes('application/json');
      var body = isJSON ? await res.json() : await res.text();
      return { ok: res.ok, status: res.status, body: body };
    } catch (e) {
      return { ok: false, status: 0, body: { message: e.message } };
    }
  }

  function attachCategoryListeners() {
    var selectAll = qs('#select_all');
    if (!selectAll) return;

    function getItemCheckboxes() {
      return qsa('input[name="itemsInterested"]').filter(function(cb){ return cb.id !== 'select_all'; });
    }

    function updateSelectAllState() {
      var items = getItemCheckboxes();
      var checkedCount = items.filter(function (c) { return c.checked; }).length;
      if (checkedCount === 0) {
          selectAll.checked = false;
          selectAll.indeterminate = false;
      } else if (checkedCount === items.length) {
          selectAll.checked = true;
          selectAll.indeterminate = false;
      } else {
          selectAll.checked = false;
          selectAll.indeterminate = true;
      }
    }

    selectAll.addEventListener('change', function () {
      var items = getItemCheckboxes();
      items.forEach(function (cb) { cb.checked = selectAll.checked; });
      selectAll.indeterminate = false;
      showCategoryError(false);
    });

    getItemCheckboxes().forEach(function (cb) {
      cb.addEventListener('change', function(){
        updateSelectAllState();
        showCategoryError(false);
      });
    });
  }

  function init() {
    attachCategoryListeners();

    var form = qs('#partnerForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      var data = collectFormData();
      if (!validate(data)) return;

      disableSubmit(true);
      var result = await postJSON(BASE_URL + CREATE_ENDPOINT, data);
      disableSubmit(false);

      if (result.ok) {
        alert('Partner registered successfully');
        try { form.reset(); } catch(_) {}
      } else {
        var msg = (result.body && (result.body.message || result.body.error)) || 'Failed to submit form';
        alert(msg);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
