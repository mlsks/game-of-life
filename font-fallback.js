// Font Awesome fallback script
document.addEventListener('DOMContentLoaded', function() {
  // Check if Font Awesome loaded properly
  setTimeout(function() {
    // Test if a Font Awesome icon is rendered properly
    const testIcon = document.querySelector('.fas.fa-home');
    if (testIcon) {
      const computedStyle = window.getComputedStyle(testIcon, ':before');
      const contentValue = computedStyle.getPropertyValue('content');
      
      // If content is empty or not what we expect, Font Awesome might have failed
      if (contentValue === 'none' || contentValue === '') {
        console.log('Font Awesome may not have loaded correctly, using emoji fallbacks');
        document.body.classList.add('font-awesome-failed');
      } else {
        console.log('Font Awesome loaded successfully');
        document.body.classList.add('font-awesome-loaded');
      }
    }
  }, 1000); // Check after 1 second to give Font Awesome time to load
});