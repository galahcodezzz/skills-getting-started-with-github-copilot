document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message and reset activity select
      activitiesList.innerHTML = "";
      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p class="availability"><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants">
            <strong>Participants:</strong>
            <div class="participants-list-container"></div>
          </div>
        `;

        // Populate participants list and add remove buttons
        const listContainer = activityCard.querySelector('.participants-list-container');
        if (details.participants && details.participants.length) {
          const ul = document.createElement('ul');
          ul.className = 'participants-list';

          details.participants.forEach((participantEmail) => {
            const li = document.createElement('li');
            li.className = 'participant-item';

            const nameSpan = document.createElement('span');
            nameSpan.className = 'participant-name';
            nameSpan.textContent = participantEmail;

            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-participant';
            removeBtn.title = 'Remove participant';
            removeBtn.innerHTML = '&times;';

            removeBtn.addEventListener('click', async () => {
              if (!confirm(`Unregister ${participantEmail} from ${name}?`)) return;

              try {
                const resp = await fetch(
                  `/activities/${encodeURIComponent(name)}/signup?email=${encodeURIComponent(participantEmail)}`,
                  { method: 'DELETE' }
                );

                const result = await resp.json().catch(() => ({}));

                if (resp.ok) {
                  // refresh activities to keep UI in sync
                  fetchActivities();

                  // show message
                  messageDiv.textContent = result.message || 'Participant unregistered';
                  messageDiv.className = 'message success';
                  messageDiv.classList.remove('hidden');
                  setTimeout(() => messageDiv.classList.add('hidden'), 4000);
                } else {
                  messageDiv.textContent = result.detail || 'Failed to unregister participant';
                  messageDiv.className = 'message error';
                  messageDiv.classList.remove('hidden');
                }
              } catch (err) {
                console.error('Error unregistering participant:', err);
                messageDiv.textContent = 'Network error while unregistering';
                messageDiv.className = 'message error';
                messageDiv.classList.remove('hidden');
              }
            });

            li.appendChild(nameSpan);
            li.appendChild(removeBtn);
            ul.appendChild(li);
          });

          listContainer.appendChild(ul);
        } else {
          const p = document.createElement('p');
          p.className = 'no-participants';
          p.textContent = 'No participants yet';
          listContainer.appendChild(p);
        }

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = 'message success';
        signupForm.reset();
        // refresh activities so the newly signed-up participant appears
        fetchActivities();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = 'message error';
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 4 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 4000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
