function showSection(id) {
    // Hide all sections first
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');

    // Show only the clicked section
    document.getElementById(id).style.display = 'block';
  }
  function toggleDropdown() {
    const menu = document.getElementById("dropdownMenu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  }

  function showSection(id) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
    // Hide dropdown
    document.getElementById("dropdownMenu").style.display = "none";
    // Show selected section
    document.getElementById(id).style.display = 'block';
  }