document.querySelectorAll(".room-image-slider").forEach((slider) => {
    const slides = slider.querySelectorAll("img");
    let index = 0;

    const showSlide = (i) => {
        slides.forEach((img, idx) => {
            img.classList.toggle("active", idx === i);
        });
    };

    slider.querySelector(".prev").addEventListener("click", () => {
        index = (index - 1 + slides.length) % slides.length;
        showSlide(index);
    });

    slider.querySelector(".next").addEventListener("click", () => {
        index = (index + 1) % slides.length;
        showSlide(index);
    });

    slides.forEach((img) => {
        img.addEventListener("click", () => {
            const modal = document.getElementById("imageModal");
            modal.querySelector("img").src = img.src;
            modal.classList.add("active");
        });
    });

    // Initial show
    showSlide(index);
});

document
    .getElementById("imageModal")
    .addEventListener("click", () => {
        document.getElementById("imageModal").classList.remove("active");
    });
