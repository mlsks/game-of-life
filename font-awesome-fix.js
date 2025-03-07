// Font Awesome fix script
document.addEventListener('DOMContentLoaded', function() {
  // Create a test element to check if Font Awesome is loaded correctly
  function checkFontAwesome() {
    // Create a test element
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-home fa-test-icon';
    testIcon.style.position = 'absolute';
    testIcon.style.visibility = 'hidden';
    document.body.appendChild(testIcon);
    
    // Get computed style
    const computedStyle = window.getComputedStyle(testIcon, ':before');
    const fontFamily = computedStyle.getPropertyValue('font-family');
    
    // Check if Font Awesome is loaded
    const isFontAwesomeLoaded = fontFamily.includes('Font Awesome') || 
                               fontFamily.includes('FontAwesome');
    
    // Add class to body based on result
    if (isFontAwesomeLoaded) {
      document.body.classList.add('font-awesome-loaded');
      console.log('Font Awesome loaded successfully');
    } else {
      document.body.classList.add('font-awesome-failed');
      console.log('Font Awesome failed to load, using emoji fallbacks');
      
      // Load Font Awesome from alternative CDN as a backup
      const alternativeCDN = document.createElement('link');
      alternativeCDN.rel = 'stylesheet';
      alternativeCDN.href = 'https://use.fontawesome.com/releases/v6.4.2/css/all.min.css';
      document.head.appendChild(alternativeCDN);
    }
    
    // Clean up
    document.body.removeChild(testIcon);
  }
  
  // Check after a short delay to allow fonts to load
  setTimeout(checkFontAwesome, 500);
});