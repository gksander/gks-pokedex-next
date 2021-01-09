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
        return "text-lime-700 border-lime-600 hover:bg-lime-100  dark:text-lime-300 dark:border-lime-300 dark:hover:bg-lime-900";
      case "fire":
        return "text-yellow-700 border-yellow-500 hover:bg-yellow-100  dark:text-amber-400 dark:border-amber-400 dark:hover:bg-amber-900";
      case "grass":
        return "text-green-700 border-green-700 hover:bg-green-100  dark:text-green-300 dark:border-green-300 dark:hover:bg-green-900";
      case "poison":
        return "text-purple-700 border-purple-700 hover:bg-purple-100  dark:text-fuschia-500 dark:border-fuschia-500 dark:hover:bg-fuschia-900";
      case "water":
        return "text-blue-700 border-blue-700 hover:bg-blue-100  dark:text-blue-500 dark:border-blue-500 dark:hover:bg-blue-900";
      case "flying":
        return "text-blue-800 border-blue-800 hover:bg-blue-100  dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900";
      case "normal":
        return "text-gray-900 border-gray-900 hover:bg-gray-100  dark:text-white dark:border-white dark:hover:bg-gray-800";
      case "electric":
        return "text-gray-600 border-yellow-300 hover:bg-yellow-100  dark:text-amber-200 dark:border-amber-200 dark:hover:bg-amber-900";
      case "ground":
        return "text-yellow-800 border-yellow-700 hover:bg-yellow-100  dark:text-yellow-500 dark:border-yellow-500 dark:hover:bg-yellow-900";
      case "fairy":
        return "text-pink-700 border-pink-600 hover:bg-pink-100  dark:text-pink-300 dark:border-pink-300 dark:hover:bg-pink-900";
      case "fighting":
        return "text-red-700 border-red-700 hover:bg-red-100  dark:text-red-400 dark:border-red-400 dark:hover:bg-red-900";
      case "ice":
        return "text-blue-700 border-blue-500 hover:bg-blue-100  dark:text-lightBlue-300 dark:border-lightBlue-300 dark:hover:bg-lightBlue-900";
      case "ghost":
        return "text-purple-700 border-purple-500 hover:bg-purple-100  dark:text-purple-300 dark:border-purple-300 dark:hover:bg-primary-900";
      case "psychic":
        return "text-purple-600 border-purple-600 hover:bg-purple-100  dark:text-purple-400 dark:border-purple-400 dark:hover:bg-purple-900";
      case "rock":
        return "text-gray-700 border-gray-700 hover:bg-gray-100 dark:text-gray-300  dark:border-gray-300 dark:hover:bg-gray-800";
      case "dragon":
        return "text-yellow-700 border-yellow-700 hover:bg-yellow-100  dark:text-amber-500 dark:border-amber-500 dark:hover:bg-amber-900";
      case "steel":
        return "text-gray-700 border-gray-600 hover:bg-gray-100  dark:text-blueGray-300 dark:border-blueGray-300 dark:hover:bg-blueGray-800";
      default:
        return "text-gray-900 border-gray-900 hover:bg-gray-100  dark:text-gray-200 dark:border-gray-200 dark:hover:bg-gray-800";
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
