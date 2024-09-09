// Check if user has already entered their name
if (!localStorage.getItem('userName')) {
    window.location.href = 'enter-name.html'; // Redirect to enter name if not set
  }
  
  // Main Page Logic
  if (window.location.pathname.includes('index.html') || window.location.pathname == "/") {
    const submitBtn = document.getElementById('submitBtn');
    const nameInput = document.getElementById('nameInput');
    const namesList = document.getElementById('namesList');
  
    // Function to load names
    function loadNames() {
      fetch('/get-names')
        .then(response => response.json())
        .then(data => {
          namesList.innerHTML = '';
          data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.name} - ${item.likes} likes`;
  
            const likeBtn = document.createElement('button');
            likeBtn.textContent = 'Like';
            likeBtn.className = 'like-btn';
  
            const likedNames = JSON.parse(localStorage.getItem('likedNames')) || [];
            if (likedNames.includes(item.name)) {
              likeBtn.disabled = true;
              likeBtn.textContent = 'Liked';
            }
  
            likeBtn.addEventListener('click', () => {
              fetch('/like-name', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: item.name })
              }).then(() => {
                likedNames.push(item.name);
                localStorage.setItem('likedNames', JSON.stringify(likedNames));
                loadNames();
              });
            });
  
            li.appendChild(likeBtn);
            namesList.appendChild(li);
          });
        });
    }
  
    // Submit a new name
    submitBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
  
      if (name) {
        fetch('/submit-name', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, provider: localStorage.getItem('userName') })
        })
          .then(response => {
            if (!response.ok) {
              return response.text().then(text => { throw new Error(text); });
            }
            return response.text();
          })
          .then(() => {
            nameInput.value = '';
            loadNames();
          })
          .catch(error => {
            alert(error.message); // Show validation error if any
          });
      } else {
        alert('Please enter a name');
      }
    });
  
    // Initial load
    loadNames();
  }
  