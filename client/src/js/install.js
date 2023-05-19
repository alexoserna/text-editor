const butInstall = document.getElementById('buttonInstall');

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault(); // Prevent the default installation prompt

  // Enable the installation button
  butInstall.style.display = 'block';

  // Store the deferred event for later use
  const deferredPrompt = event;
  
  // Add a click event handler to the installation button
  butInstall.addEventListener('click', async () => {
    // Prompt the user to install the PWA
    deferredPrompt.prompt();

    // Wait for the user's choice
    const choiceResult = await deferredPrompt.userChoice;

    // Check if the user accepted the installation
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA installed');
    } else {
      console.log('PWA installation declined');
    }

    // Reset the installation button display
    butInstall.style.display = 'none';

    // Clear the deferred event
    deferredPrompt = null;
  });
});

// Add an event handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  console.log('PWA installed successfully');
});
