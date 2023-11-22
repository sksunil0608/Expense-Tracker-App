window.addEventListener("DOMContentLoaded", () => {
  // Show dark theme or light theme on user preference even user refreshes
  const savedTheme = sessionStorage.getItem("theme");
  if (savedTheme === "dark") {
    setTheme("dark");
  } else {
    setTheme("light");
  }

    // Get the current path of the URL
    var path = window.location.pathname;

    // Remove the 'active' class from all navigation links
    var navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(function (link) {
        link.classList.remove('active');
    });

    // Find the corresponding navigation item and add the 'active' class
    navLinks.forEach(function (link) {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        }
    });
});

// Function to set the theme to dark or light
function setTheme(theme) {
  if (theme === "dark") {
    document.body.setAttribute("data-bs-theme", "dark");
    sessionStorage.setItem("theme", "dark");
  } else {
    document.body.removeAttribute("data-bs-theme");
    sessionStorage.setItem("theme", "light");
  }
}
