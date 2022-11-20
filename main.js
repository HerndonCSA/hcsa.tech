new FlipDown(1669194000, {
    theme: "dark",
  }).start();

particlesJS.load('particles-js', 'particles.json', function() {
  console.log('callback - particles.js config loaded');
});

const dismissible = new Dismissible(document.querySelector('#dismissible-container'));

fetch("https://api.hcsa.tech/announcement")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    dismissible.info(data.announcement)
  });

