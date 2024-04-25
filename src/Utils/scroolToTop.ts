const scroolToTop = () => {   
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const scroolMethods = {scroolToTop}

export {scroolMethods}