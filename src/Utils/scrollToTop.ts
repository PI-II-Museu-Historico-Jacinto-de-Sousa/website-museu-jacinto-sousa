const scrollToTop = () => {   
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const scrollMethods = {scrollToTop}

export {scrollMethods}