import {
    GET_ANIME_BY_SEARCH,
    GET_TOP_ANIME,
    GET_SEASON_UPCOMING,
    GET_LATEST_EPISODES,
    GET_ANIME_GENRES,
    GET_SCHEDULED_RELEASES,
} from "./constants";
import { animeData } from "@/types/ApiResponse";

interface queryType {
    [key: string]: string | number | boolean;
}

export const constructUrl = (baseUrl: string, queryParams: queryType) => {
    const queryString = Object.keys(queryParams)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
        .join("&");
    return `${baseUrl}?${queryString}`;
};

const getUniqueAnimeData = (data: Array<animeData>) => {
    const uniqueIds = new Set();
    return data?.filter((anime) => {
        if (!uniqueIds.has(anime.mal_id)) {
            uniqueIds.add(anime.mal_id);
            return true;
        }
        return false;
    });
};

const getCacheTime = (number: number = 1, type: string = "hour"): number => {
    const oneHr: number = 3600;
    if (type === "day") {
        return oneHr * 24 * number;
    } else {
        return oneHr * number;
    }
};

export const getTrendingAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        type: "tv",
        status: "airing",
        order_by: "members",
        sort: "desc",
        limit: 10,
    };
    try {
        const url = constructUrl(GET_ANIME_BY_SEARCH, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getTopAiringAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        filter: "airing",
    };
    try {
        const url = constructUrl(GET_TOP_ANIME, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getMostPopularAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        filter: "bypopularity",
    };
    try {
        const url = constructUrl(GET_TOP_ANIME, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getMostFavoriteAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        filter: "favorite",
    };
    try {
        const url = constructUrl(GET_TOP_ANIME, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getLatestCompletedAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        status: "complete",
        order_by: "end_date",
        sort: "desc",
        sfw: true,
    };
    try {
        const url = constructUrl(GET_ANIME_BY_SEARCH, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getNewReleasedAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        status: "airing",
        order_by: "start_date",
        sort: "desc",
        sfw: true,
    };
    try {
        const url = constructUrl(GET_ANIME_BY_SEARCH, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getUpcomingSeasonAnimes = async (): Promise<any> => {
    const queryParams: queryType = {
        sfw: true,
    };
    try {
        const url = constructUrl(GET_SEASON_UPCOMING, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getLatestEpisodes = async (): Promise<any> => {
    try {
        const url = GET_LATEST_EPISODES;
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return apiData.data;
    } catch (error) {
        console.log(error);
    }
};

export const getAnimeGenres = async (): Promise<any> => {
    try {
        const url = GET_ANIME_GENRES;
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getScheduledReleases = async (day: string): Promise<any> => {
    const queryParams: queryType = {
        sfw: true,
        filter: day,
    };
    try {
        const url = constructUrl(GET_SCHEDULED_RELEASES, queryParams);
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
    }
};

export const getAnimeDataById = async (id: number): Promise<any> => {
    try {
        const url = `${GET_ANIME_BY_SEARCH}/${id}/full`;
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return apiData.data;
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getAnimesBySearch = async (searchKey: string, signal: AbortSignal): Promise<any> => {
    const queryParams: queryType = {
        q: searchKey,
    };
    try {
        const url = constructUrl(GET_ANIME_BY_SEARCH, queryParams);
        const response = await fetch(url, {
            signal,
            cache: "no-store",
        });
        const apiData = await response.json();
        return getUniqueAnimeData(apiData.data);
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getAnimeCharacters = async (id: number): Promise<any> => {
    try {
        const url = `${GET_ANIME_BY_SEARCH}/${id}/characters`;
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return apiData.data;
    } catch (error) {
        console.log(error);
        return {};
    }
};

export const getAnimePromotionalVideos = async (id: number): Promise<any> => {
    try {
        const url = `${GET_ANIME_BY_SEARCH}/${id}/videos`;
        const response = await fetch(url, {
            cache: "no-store",
        });
        const apiData = await response.json();
        return apiData.data.promo;
    } catch (error) {
        console.log(error);
        return {};
    }
};
