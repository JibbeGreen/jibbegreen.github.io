class PanelScroll {
    constructor(containerSelector, scrollSpeed = 1) {
        this.container = document.querySelector(containerSelector);
        this.cards = Array.from(this.container.children);
        this.scrollSpeed = scrollSpeed;
        this.isPaused = false;
        this.isDragging = false;
        this.lastMouseX = 0;
        this.hasDragged = false;
        this.dragTimeout = null;

        this.cardWidth = this.cards[0].offsetWidth + (1 * window.innerWidth / 100);

        this.init();
    }

    init() {
        this.positionCards();
        this.container.addEventListener("mousedown", this.startDrag.bind(this));
        document.addEventListener("mousemove", this.handleDrag.bind(this));
        document.addEventListener("mouseup", this.stopDrag.bind(this));

        this.container.addEventListener("mouseenter", () => (this.isPaused = true));
        this.container.addEventListener("mouseleave", () => (this.isPaused = false));
        window.addEventListener('resize', this.handleResize.bind(this));

        requestAnimationFrame(this.update.bind(this));
    }

    handleResize() {
        // Recalculate card width
        console.log("Window resized — updating card positions");
        const cardRect = this.cards[0].getBoundingClientRect();
        const spacing = window.innerWidth * 0.01;
        this.cardWidth = cardRect.width + spacing;

        // Reset left styles and reassign card positions cleanly
        this.cards.forEach(card => card.style.left = '');

        // Optional: reset the order of cards to initial DOM order
        // This is to keep the array and DOM in sync for recycling logic
        this.cards = Array.from(this.container.children);

        // Reposition cards based on new cardWidth
        this.positionCards();
    }


    positionCards() {
        this.cards.forEach((card, index) => {
            card.style.left = `${index * this.cardWidth}px`;
        });
        //console.log("Cards positioned:", this.cards.map(c => c.style.left));
    }

    update() {
        if (!this.isDragging && !this.isPaused) {
            this.cards.forEach(card => {
                let currentX = parseFloat(card.style.left) || 0;
                card.style.left = `${currentX - this.scrollSpeed}px`;
            });

            this.checkAndRecycleCards();
        }
        requestAnimationFrame(this.update.bind(this));
    }

    startDrag(event) {
        this.hasDragged = false;
        this.isDragging = true;
        this.lastMouseX = event.clientX;
        document.body.style.userSelect = "none";

        this.dragTimeout = setTimeout(() => {
            if (this.isDragging) {
                this.cards.forEach(card => {
                    card.style.pointerEvents = "none"; // Disable clicks only if dragging
                });
            }
        }, 350);
    }

    handleDrag(event) {
        if (!this.isDragging) return;

        let deltaX = event.clientX - this.lastMouseX;

        if (Math.abs(deltaX) > 5) {
            this.hasDragged = true;
            clearTimeout(this.dragTimeout);
            this.cards.forEach(card => (card.style.pointerEvents = "none"));
        }

        // Remove the block that prevents dragging right (lines 97-99 were here)
        // We allow tracking in both directions now.

        this.cards.forEach(card => {
            let currentX = parseFloat(card.style.left);
            card.style.left = `${currentX + deltaX}px`;
        });

        this.lastMouseX = event.clientX;

        this.checkAndRecycleCards(deltaX);
    }

    stopDrag(event) {
        this.isDragging = false;
        document.body.style.userSelect = "auto";

        // Restore pointer events immediately if clicking on a card after dragging
        this.cards.forEach(card => (card.style.pointerEvents = "auto"));

        // Simulate an immediate click if user releases on a card
        if (!this.hasDragged) {
            let clickedElement = document.elementFromPoint(event.clientX, event.clientY);
            if (clickedElement && clickedElement.classList.contains("project-card")) {
                clickedElement.click(); // Manually trigger the click event
            }
        }
    }

    checkAndRecycleCards(deltaX = 0) {
        // Safety allows us to break infinite loops if layout logic fails
        const maxRecycles = this.cards.length;

        // 1. Recycle Left -> Right (Standard Infinite Scroll)
        // If the first card goes off-screen to the left, move it to the end.
        let safety = 0;
        while (parseFloat(this.cards[0].style.left) + this.cardWidth < 0 && safety < maxRecycles) {
            this.recycleCardLeftToRight(this.cards[0]);
            safety++;
        }

        // 2. Recycle Right -> Left (When Dragging Right)
        // Check if we need to fill space on the left.
        // We trigger if the first card is anywhere within the first card-width of space or inside the screen,
        // suggesting a drag right is exposing the left void.
        safety = 0;
        // We check 'deltaX > 0' to prioritize this logic during right-drag interactions.
        // We check '>-this.cardWidth' to be aggressive about filling the left gap.
        if (deltaX > 0) {
            while (
                parseFloat(this.cards[0].style.left) > -this.cardWidth &&
                parseFloat(this.cards[this.cards.length - 1].style.left) >= window.innerWidth &&
                safety < maxRecycles
            ) {
                this.recycleCardRightToLeft(this.cards[this.cards.length - 1]);
                safety++;
            }
        }
    }

    recycleCardLeftToRight(card) {
        let lastCard = this.cards[this.cards.length - 1];
        card.style.left = `${parseFloat(lastCard.style.left) + this.cardWidth}px`;
        this.cards.push(this.cards.shift());
    }

    recycleCardRightToLeft(card) {
        let firstCard = this.cards[0];
        card.style.left = `${parseFloat(firstCard.style.left) - this.cardWidth}px`;
        this.cards.unshift(this.cards.pop());
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(min-width: 769px)").matches) {
        new PanelScroll(".projects-container", 0.35);
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const projectsContainer = document.querySelector(".projects-container");
    if (projectsContainer) {
        projectsContainer.addEventListener("dragstart", (event) => {
            event.preventDefault();
        });
    }
});

//snapToNearestCard() {
//    let firstCard = this.cards[0];
//    let firstCardLeft = parseFloat(firstCard.style.left);

//    let closestIndex = Math.round(Math.abs(firstCardLeft) / this.cardWidth);
//    let targetPosition = -closestIndex * this.cardWidth;

//    this.cards.forEach(card => {
//        card.style.left = `${targetPosition + (this.cards.indexOf(card) * this.cardWidth)}px`;
//    });
//}