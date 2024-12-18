function showSection(sectionId) {
    document.querySelectorAll('.forum-section').forEach(section => {
      section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
  }
  