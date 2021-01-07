import * as React from "react";
import classNames from "classnames";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

type PokeTypeChipProps = {
  slug: string;
  isBlock?: boolean;
  isSmall?: boolean;
  isStarred?: boolean;
  isGrayscale?: boolean;
};

export const PokeTypeChip: React.FC<PokeTypeChipProps> = ({
  slug,
  isBlock = false,
  isSmall = false,
  isStarred = false,
  isGrayscale = false,
}) => {
  const typeSpecificClasses = (() => {
    switch (slug) {
      case "bug":
        return "text-green-700 border-green-600 hover:bg-green-100";
      case "fire":
        return "text-yellow-700 border-yellow-500 hover:bg-yellow-100";
      case "grass":
        return "text-green-700 border-green-700 hover:bg-green-100";
      case "poison":
        return "text-purple-700 border-purple-700 hover:bg-purple-100";
      case "water":
        return "text-blue-700 border-blue-700 hover:bg-blue-100";
      case "flying":
        return "text-blue-800 border-blue-800 hover:bg-blue-100";
      case "normal":
        return "text-gray-900 border-gray-900 hover:bg-gray-100";
      case "electric":
        return "text-gray-600 border-yellow-300 hover:bg-yellow-100";
      case "ground":
        return "text-yellow-800 border-yellow-700 hover:bg-yellow-100";
      case "fairy":
        return "text-pink-700 border-pink-600 hover:bg-pink-100";
      case "fighting":
        return "text-red-700 border-red-700 hover:bg-red-100";
      case "ice":
        return "text-blue-700 border-blue-500 hover:bg-blue-100";
      case "ghost":
        return "text-purple-700 border-purple-500 hover:bg-purple-100";
      case "psychic":
        return "text-purple-600 border-purple-600 hover:bg-purple-100";
      case "rock":
        return "text-gray-700 border-gray-700 hover:bg-gray-100";
      case "dragon":
        return "text-yellow-700 border-yellow-700 hover:bg-yellow-100";
      case "steel":
        return "text-gray-700 border-gray-600 hover:bg-gray-100";
      default:
        return "text-gray-900 border-gray-900 hover:bg-gray-100";
    }
  })();

  return (
    <Link href={`/types/${slug}`} passHref>
      <a
        className={classNames(
          "capitalize border-2 rounded inline-flex justify-center items-center transition-all duration-150",
          isSmall ? "w-20 h-6 text-xs" : "w-24 h-8",
          isBlock && "w-full",
          isGrayscale && "grayscale",
          typeSpecificClasses,
        )}
      >
        <span>{slug}</span>
        {isStarred && (
          <span className="ml-1">
            <FaStar />
          </span>
        )}
      </a>
    </Link>
  );
};
