
          // Eye icon for default password (must be after editPassword is defined)
          const toggleDefaultEye = document.getElementById('toggle-default-eye');
          const editPasswordInput = document.getElementById('edit-password');
          if (toggleDefaultEye && editPasswordInput) {
            // Set icon color to dark for visibility
            toggleDefaultEye.querySelector('i').style.color = '#222';
            toggleDefaultEye.onclick = () => {
              editPasswordInput.type = editPasswordInput.type === 'password' ? 'text' : 'password';
              toggleDefaultEye.innerHTML = editPasswordInput.type === 'password'
                ? '<i class="fa-solid fa-eye" style="color:#222"></i>'
                : '<i class="fa-solid fa-eye-slash" style="color:#222"></i>';
            };
          }

// Minimal instance add and list code
document.addEventListener('DOMContentLoaded', function() {
  const addInstanceBtn = document.getElementById('add-instance');
  const instanceNameInput = document.getElementById('instance-name');
  const instancesTableBody = document.getElementById('instances-table-body');

  function renderInstances() {
    chrome.storage.sync.get('loginData', (data) => {
      const loginData = data.loginData || {};
      instancesTableBody.innerHTML = '';
      Object.keys(loginData).forEach(instance => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        nameCell.textContent = instance;
        nameCell.style.padding = '12px';
        nameCell.style.border = '1px solid #cbd5e1';
        nameCell.style.fontSize = '1.05rem';
        row.appendChild(nameCell);

        const actionsCell = document.createElement('td');
        actionsCell.style.padding = '12px';
        actionsCell.style.border = '1px solid #cbd5e1';
        actionsCell.style.display = 'flex';
        actionsCell.style.gap = '10px';

        // Edit button (Font Awesome)
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Edit';
        editBtn.style.background = '#2563eb';
        editBtn.style.color = '#fff';
        editBtn.style.border = 'none';
        editBtn.style.borderRadius = '6px';
        editBtn.style.padding = '8px 18px';
        editBtn.style.fontWeight = '500';
        editBtn.style.fontSize = '1rem';
        editBtn.style.cursor = 'pointer';
        editBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        editBtn.style.transition = 'background 0.2s';
        editBtn.title = 'Edit';
        editBtn.onclick = function() {
          const editPage = document.getElementById('edit-page');
          const editLink = document.getElementById('edit-link');
          const editPassword = document.getElementById('edit-password');
          const saveEdit = document.getElementById('save-edit');
          const backBtn = document.getElementById('back-btn');
          const editTitle = document.getElementById('edit-page-title');

          // Hide instance list, show edit page
          document.getElementById('instances-table').style.display = 'none';
          document.querySelector('div').style.display = 'none'; // hide add instance input
          editPage.style.display = 'block';

          // Populate fields
          chrome.storage.sync.get('loginData', (data) => {
            const loginData = data.loginData || {};
            const instData = loginData[instance] || {};
            editTitle.textContent = `Edit Instance: ${instance}`;
            editLink.value = instData.link || '';
            editPassword.value = instData.defaultPassword ? atob(instData.defaultPassword) : '';

            // Exception logic
            const exceptionEmail = document.getElementById('exception-email');
            const exceptionPassword = document.getElementById('exception-password');
            const addExceptionBtn = document.getElementById('add-exception');
            const exceptionList = document.getElementById('exception-list');

            function renderExceptions() {
              exceptionList.innerHTML = '';
              if (instData.exceptions) {
                Object.entries(instData.exceptions).forEach(([encEmail, encPass]) => {
                  const email = atob(encEmail);
                  const password = atob(encPass);
                  const li = document.createElement('li');
                  li.style.listStyle = 'none';
                  li.style.marginBottom = '6px';
                  // Email label
                  const emailSpan = document.createElement('span');
                  emailSpan.textContent = email + ': ';
                  li.appendChild(emailSpan);

                  // Password field (dots)
                  const passInput = document.createElement('input');
                  passInput.type = 'password';
                  passInput.value = password;
                  passInput.readOnly = true;
                  passInput.style.width = '110px';
                  passInput.style.marginRight = '6px';
                  passInput.style.border = '1px solid #cbd5e1';
                  passInput.style.borderRadius = '6px';
                  passInput.style.padding = '4px 8px';
                  passInput.style.fontSize = '0.97rem';
                  li.appendChild(passInput);

                  // Eye icon button
                  const eyeBtn = document.createElement('button');
                  eyeBtn.innerHTML = '<i class="fa-solid fa-eye" style="color:#222"></i>';
                  eyeBtn.style.background = 'transparent';
                  eyeBtn.style.border = 'none';
                  eyeBtn.style.cursor = 'pointer';
                  eyeBtn.style.marginRight = '8px';
                  eyeBtn.onclick = () => {
                    passInput.type = passInput.type === 'password' ? 'text' : 'password';
                    eyeBtn.innerHTML = passInput.type === 'password'
                      ? '<i class="fa-solid fa-eye" style="color:#222"></i>'
                      : '<i class="fa-solid fa-eye-slash" style="color:#222"></i>';
                  };
                  li.appendChild(eyeBtn);

                  // Remove button
                  const removeBtn = document.createElement('button');
                  removeBtn.textContent = 'Remove';
                  removeBtn.style.background = '#ef4444';
                  removeBtn.style.color = '#fff';
                  removeBtn.style.border = 'none';
                  removeBtn.style.borderRadius = '6px';
                  removeBtn.style.padding = '4px 10px';
                  removeBtn.onclick = () => {
                    delete instData.exceptions[encEmail];
                    renderExceptions();
                  };
                  li.appendChild(removeBtn);
                  exceptionList.appendChild(li);
                });
              }
            }

            addExceptionBtn.onclick = () => {
              const email = exceptionEmail.value.trim();
              const pass = exceptionPassword.value;
              if (!email || !pass) return alert('Enter both email and password');
              instData.exceptions = instData.exceptions || {};
              instData.exceptions[btoa(email)] = btoa(pass);
              exceptionEmail.value = '';
              exceptionPassword.value = '';
              renderExceptions();
            };
            renderExceptions();

            // Save handler
            saveEdit.onclick = () => {
              instData.link = editLink.value.trim();
              instData.defaultPassword = btoa(editPassword.value);
              loginData[instance] = instData;
              chrome.storage.sync.set({ loginData }, () => {
                editPage.style.display = 'none';
                document.getElementById('instances-table').style.display = '';
                document.querySelector('div').style.display = '';
                renderInstances();
              });
            };
            // Back handler
            backBtn.onclick = () => {
              editPage.style.display = 'none';
              document.getElementById('instances-table').style.display = '';
              document.querySelector('div').style.display = '';
            };
          });
        };
        actionsCell.appendChild(editBtn);

        // Delete button (Font Awesome)
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
        deleteBtn.style.background = '#ef4444';
        deleteBtn.style.color = '#fff';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '6px';
        deleteBtn.style.padding = '8px 18px';
        deleteBtn.style.fontWeight = '500';
        deleteBtn.style.fontSize = '1rem';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
        deleteBtn.style.transition = 'background 0.2s';
        deleteBtn.title = 'Delete';
        deleteBtn.onclick = () => {
          chrome.storage.sync.get('loginData', (data) => {
            const loginData = data.loginData || {};
            delete loginData[instance];
            chrome.storage.sync.set({ loginData }, () => {
              renderInstances();
            });
          });
        };
        actionsCell.appendChild(deleteBtn);

        row.appendChild(actionsCell);
        instancesTableBody.appendChild(row);
      });
    });
  }

  if (addInstanceBtn && instanceNameInput) {
    addInstanceBtn.addEventListener('click', () => {
      const name = instanceNameInput.value.trim();
      if (!name) return alert('Enter instance name');
      chrome.storage.sync.get('loginData', (data) => {
        const loginData = data.loginData || {};
        if (loginData[name]) return alert('Instance already exists');
        loginData[name] = { link: '' };
        chrome.storage.sync.set({ loginData }, () => {
          instanceNameInput.value = '';
          renderInstances();
        });
      });
    });
  }
  renderInstances();
});
