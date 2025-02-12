document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".navbar-links a");
  
    for (const link of links) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const targetId = this.getAttribute("href").substring(1);
        const targetElement = document.getElementById(targetId);
  
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: "smooth",
          });
        }
      });
    }
  });