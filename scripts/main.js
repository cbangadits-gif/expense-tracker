const SECTIONS= ['about', 'dashboard', 'records','add', 'settings'];
const DEFAULT_SECTION= "dashboard";
 
const links = document.querySelectorAll('nav a');

function showSection(id, moveFocus = false) {
    if (!SECTIONS.includes(id)) id = DEFAULT_SECTION;

    SECTIONS.forEach((name) => {
        document.getElementById(name).hidden = name !==id;
    });
    links.forEach((link) => {
        if (link.getAttribute('href') === `#${id}`) {
            link.setAttribute('aria-current','page');
        } else {
            link.removeAttribute('aria-current')
        }
    });

    window.scrollTo(0, 0);
    if (moveFocus) document.querySelector (`#${id} h2`).focus({ preventScroll: true });
}

window.addEventListener('hashchange', () => {
    showSection(location.hash.slice(1), true);
});

showSection(location.hash.slice(1));

window.addEventListener('load',() => window.scrollTo(0, 0));
