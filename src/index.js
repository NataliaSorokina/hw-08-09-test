import './sass/main.scss';
import refs from './js/refs.js';
import items from './js/gallery-items.js';

const galleryItem = createGalleryItemsMarkup(items);
refs.gallery.insertAdjacentHTML('beforeend', galleryItem);

refs.gallery.addEventListener('click', modalWindowOpenHandler);


function createGalleryItemsMarkup(items) {
    return items
        .map(({ preview, original, description }) => {
            return `
            <li class="gallery__item">
                <a
                    class="gallery__link"
                    href='${original}'
                >
                    <img
                    class="gallery__image"
                    src='${preview}'
                    data-source = '${original}'
                    alt='${description}'
                    />
                </a>
            </li>
            `;
        })
        .join('');
}


function modalWindowOpenHandler(event) {
    event.preventDefault();
    refs.btn.addEventListener('click', modalWindowCloseHandler);
    refs.overlay.addEventListener('click', overlayClickHandler);
    window.addEventListener('keydown', escKeyPressHandler);
    window.addEventListener('keydown', imagesScrollHandler);

    if (event.target.nodeName !== 'IMG') {
        return;
    }

    refs.lightbox.classList.add('is-open');
    refs.image.src = event.target.dataset.source;
    refs.image.alt = event.target.alt;
}

function modalWindowCloseHandler() {
    refs.btn.addEventListener('click', modalWindowCloseHandler);
    refs.overlay.addEventListener('click', overlayClickHandler);
    window.removeEventListener('keydown', escKeyPressHandler);
    window.removeEventListener('keydown', imagesScrollHandler);
    refs.lightbox.classList.remove('is-open');
    refs.image.src = '';
    refs.image.alt = '';
}

function overlayClickHandler(event) {
    if (event.currentTarget === event.target) {
        modalWindowCloseHandler();
    }
}

function escKeyPressHandler(event) {
    if (event.code === 'Escape') {
        modalWindowCloseHandler();
    }
}

function imagesScrollHandler(event) {
    const imagesArray = document.querySelectorAll('.gallery__image');
    const imagesSrc = [];
    imagesArray.forEach(image => imagesSrc.push(image.dataset.source));
    const imagesAlt = [];
    imagesArray.forEach(image => imagesAlt.push(image.alt));
    let currentImageIndex = imagesSrc.indexOf(refs.image.src);
    let currentAltIndex = imagesAlt.indexOf(refs.image.alt);

    if (event.code === 'ArrowLeft') {
        if (currentImageIndex === 0 && currentAltIndex === 0) {
            currentImageIndex = imagesSrc.length - 1;
            currentAltIndex = imagesAlt.length - 1;
        } else {
            currentImageIndex -= 1;
            currentAltIndex -= 1;
        }
    }
    if (event.code === 'ArrowRight') {
        if (currentImageIndex === imagesSrc.length - 1 && currentAltIndex === imagesAlt.length - 1) {
            currentImageIndex = 0;
            currentAltIndex = 0;
        } else {
            currentImageIndex += 1;
            currentAltIndex += 1;
        }
    }
    refs.image.src = imagesSrc[currentImageIndex];
    refs.image.alt = imagesAlt[currentAltIndex];

}
