// No encryption, just base64 decoding

// Get instance name by matching URL
function getInstance(instances) {
  const url = window.location.href;
  for (const [name, info] of Object.entries(instances)) {
    if (info.link && url.includes(info.link)) {
      return name;
    }
  }
  return null;
}

// Get email from form
function getEmail() {
  const emailField = document.querySelector("#username, input[type='email']");
  return emailField ? emailField.value : null;
}


// Main logic (base64 decode)
(function () {
  chrome.storage.sync.get("loginData", function (data) {
    const loginData = data.loginData || {};
    const instanceName = getInstance(loginData);
    const email = getEmail();
    const userField = document.querySelector("#username, input[type='email']");
    const passField = document.querySelector("#password, input[type='password']");
    const form = document.querySelector("form");

    if (!instanceName || !loginData[instanceName] || !email || !userField || !passField) return;

    const instanceData = loginData[instanceName];
    let password = '';
    let foundException = false;
    if (instanceData.exceptions) {
      for (const [encEmail, encPass] of Object.entries(instanceData.exceptions)) {
        const decEmail = atob(encEmail);
        if (decEmail && decEmail === email) {
          password = atob(encPass) || '';
          foundException = true;
          break;
        }
      }
    }
    if (!foundException) {
      password = (typeof instanceData.defaultPassword === 'string' && instanceData.defaultPassword.length > 0)
        ? atob(instanceData.defaultPassword)
        : '';
    }

    userField.value = email;
    passField.value = password;
    if (form) {
      form.submit();
    }
  });
})();


