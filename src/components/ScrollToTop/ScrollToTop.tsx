import React, { useState } from 'react';

const checkScroll = () => {
    const position = window.pageYOffset;
    if (position > 300) {
        return true;
    } else {
        return false;
    }
}

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);
    
    
    return null;
}