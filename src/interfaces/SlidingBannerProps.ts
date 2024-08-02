export interface SlidingBannerProps {
    images: Imagem[];
    addImage?: () => void;
    editAlt?: (key: number) => void;
    removeImage?: (key: number) => void;
  }