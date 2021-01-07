import * as React from "react";
import CSS from "csstype";

type PokeImgProps = {
  id: string;
  slug: string;
  imgClassName?: string;
  imgStyle?: CSS.Properties;
};

export const PokeImg: React.FC<PokeImgProps> = ({ id, imgStyle, slug }) => {
  return (
    <picture>
      <source srcSet={`/img/pokemon-sugimori/${id}.webp`} type="image/webp" />
      <source srcSet={`/img/pokemon-sugimori/${id}.png`} type="image/png" />
      <img
        src={`/img/pokemon-sugimori/${id}.png`}
        className="w-full h-full object-contain"
        style={imgStyle}
        alt={`Sugimori artwork of ${slug}`}
      />
    </picture>
  );
};
