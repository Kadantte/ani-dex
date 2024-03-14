import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getTopAiringAnimes, getMostPopularAnimes, getMostFavoriteAnimes } from "@/app/lib/fetch";
import { animeData } from "./TrendingAnimeList";
import { DotFilledIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface categoryListType {
    categoryTitle: string;
}

const CategoryList = async ({ categoryTitle }: categoryListType) => {
    let data: Array<animeData> | null;

    switch (categoryTitle) {
        case "Top Airing":
            data = await getTopAiringAnimes();
            break;

        case "Most Popular":
            data = await getMostPopularAnimes();
            break;

        case "Most Favorite":
            data = await getMostFavoriteAnimes();
            break;

        default:
            data = null;
            break;
    }
    return (
        <div>
            <h3 className="font-bold text-2xl">{categoryTitle}</h3>
            <div>
                {data &&
                    data.slice(0, 5).map((anime: animeData) => (
                        <div
                            key={anime.mal_id}
                            className="flex items-center gap-4 py-4 border-b border-white border-opacity-25"
                        >
                            <Image
                                src={anime.images.webp.image_url}
                                alt={anime.title_english || anime.title}
                                width={70}
                                height={96}
                                className="w-16 h-24 rounded-md object-cover"
                            />

                            <div className="text-sm w-[calc(100%-80px)]">
                                <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {anime.title_english || anime.title}
                                </p>
                                <div className="flex items-center gap-1">
                                    <div>{anime.episodes || "???"}</div>
                                    <DotFilledIcon className="opacity-30" />
                                    <div className="opacity-50">{anime.type}</div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="my-4">
                <Link href="#" className="flex items-center gap-2 text-sm hover:text-primary">
                    View more <ChevronRightIcon />
                </Link>
            </div>
        </div>
    );
};

export default CategoryList;

// data: {
//       status: '429',
//       type: 'RateLimitException',
//       message: 'You are being rate-limited. Please follow Rate Limiting guidelines: https://docs.api.jikan.moe/#section/Information/Rate-Limiting',
//       error: null
//     }
