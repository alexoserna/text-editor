const butInstall = document.getElementById("buttonInstall");

// Logic for installing the PWA
// TODO: Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // Prevent the default prompt
  event.preventDefault();
  // Store the event for later use
  const deferredPrompt = event;
  // Show the install button
  butInstall.style.display = 'block';

  // TODO: Implement a click event handler on the `butInstall` element
  butInstall.addEventListener('click', async () => {
    // Prompt the user to install the app
    deferredPrompt.prompt();
    // Wait for the user's response
    const choiceResult = await deferredPrompt.userChoice;
    // Reset the install button display
    butInstall.style.display = 'none';
    // Nullify the deferredPrompt variable
    deferredPrompt = null;
  });
});

window.addEventListener('appinstalled', (event) => {

  window.deferredPrompt = null;
}); 
