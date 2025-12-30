import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css"; // core styles
import "swiper/css/navigation"; // for the arrows
import "swiper/css/pagination"; // for the dots
import { useRemovePortfolioItemImageMutation } from "@/features/profile/portfolio/portfolioApi";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useState } from "react";

type Props = {
  portfolioItemId: string;
  images: string[];
};

const PortfolioItemImagesCarousel = ({ portfolioItemId, images }: Props) => {
  // track loaded state for each image
  const [loadedStates, setLoadedStates] = useState<boolean[]>(
    Array(images.length).fill(false)
  );
  const [deleteImage, { isLoading: isDeleting }] =
    useRemovePortfolioItemImageMutation();

  const handleDelete = (index: number) => {
    deleteImage({ portfolioItemId, imageUrl: images[index] });
  };

  const handleImageLoad = (index: number) => {
    setLoadedStates((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={50}
      slidesPerView={1}
      className="w-70 h-70 mb-2"
    >
      {images.map((src, idx) => (
        <SwiperSlide key={idx} className="flex justify-center items-center">
          {!loadedStates[idx] && (
            <LoadingSpinner
              fullScreen={false}
              size={36}
            />
          )}

          <img
            src={src}
            alt={`Portfolio ${idx}`}
            onLoad={() => handleImageLoad(idx)}
            onError={() => handleImageLoad(idx)} // stop spinner on error too
            className={`w-70 h-70 object-cover rounded-lg transition-opacity duration-300 ${
              loadedStates[idx] ? "opacity-100" : "opacity-0"
            } ${isDeleting ? "opacity-50" : ""}`}
          />
          {isDeleting && (
            <LoadingSpinner
              fullScreen={false}
              size={36}
            />
          )}
          <button
            onClick={() => handleDelete(idx)}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 cursor-pointer"
          >
            &times;
          </button>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default PortfolioItemImagesCarousel;
