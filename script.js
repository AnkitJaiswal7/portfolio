const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

let target = parseInt(counter.dataset.target);

let count = 0;

let speed = target / 50;

let updateCounter = () => {

count += speed;

if (count < target) {

counter.innerText = Math.ceil(count);

requestAnimationFrame(updateCounter);

} else {

counter.innerText = target + "+";

}

};

updateCounter();

});


// Smooth reveal animation

const observer = new IntersectionObserver(entries => {

entries.forEach(entry => {

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

document.querySelectorAll("section").forEach(section => {
observer.observe(section);
});
