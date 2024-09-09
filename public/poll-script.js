// Function to load names and their likes
function loadPollData() {
    fetch('/get-names')
      .then(response => response.json())
      .then(data => {
        const pollList = document.getElementById('pollList');
        pollList.innerHTML = '';  // Clear the list
  
        // Sort the names by likes in descending order
        data.sort((a, b) => b.likes - a.likes);
  
        // Loop through the sorted data and display each name with its likes
        data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.name} - ${item.likes} likes`;
          pollList.appendChild(li);
        });
      })
      .catch(err => console.error('Error fetching poll data:', err));
  }

  // Check if user has already entered their name
if (!localStorage.getItem('userName')) {
    window.location.href = 'enter-name.html'; // Redirect to enter name if not set
  }
  
  
  // Load poll data when the page is loaded
  window.addEventListener('load', loadPollData);
  