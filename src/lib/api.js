const API_BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'https://api.blog.shishirkhatri.com.np';
const API_URL = import.meta.env.DEV ? '/api/v1/posts' : `${API_BASE_URL}/api/v1/posts`;

const POSTS_CACHE_KEY = 'vox_diurna_posts_cache';
const POSTS_CACHE_TIME_KEY = 'vox_diurna_posts_cache_time';
const POSTS_CACHE_TTL_MS = 60_000;
const DETAIL_CACHE_KEY_PREFIX = 'vox_diurna_post_';
let postsRequest = null;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function readPostsCache() {
  try {
    const cached = safeParse(localStorage.getItem(POSTS_CACHE_KEY));
    return Array.isArray(cached) ? cached : [];
  } catch {
    return [];
  }
}

function readPostsCacheTime() {
  try {
    return Number(localStorage.getItem(POSTS_CACHE_TIME_KEY)) || 0;
  } catch {
    return 0;
  }
}

function touchPostsCache() {
  try {
    localStorage.setItem(POSTS_CACHE_TIME_KEY, String(Date.now()));
  } catch {
    // Cached posts remain usable even if storage is unavailable.
  }
}

export function getAllPosts() {
  const cached = readPostsCache();
  const cachedAt = readPostsCacheTime();
  if (cached.length && Date.now() - cachedAt < POSTS_CACHE_TTL_MS) {
    return Promise.resolve(cached);
  }

  if (!postsRequest) {
    postsRequest = fetchAllPosts().finally(() => {
      postsRequest = null;
    });
  }
  return postsRequest;
}

async function fetchAllPosts() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const cached = readPostsCache();
      if (cached.length) {
        touchPostsCache();
        return cached;
      }
      throw new Error(`Could not load stories (${res.status})`);
    }

    const data = await res.json();
    let posts = [];

    if (Array.isArray(data)) {
      posts = data;
    } else if (data && typeof data === 'object') {
      if (data.slug) {
        posts = [data];
      } else if (Array.isArray(data.posts)) {
        posts = data.posts;
      }
    }

    if (posts.length > 0) {
      try {
        localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(posts));
        localStorage.setItem(POSTS_CACHE_TIME_KEY, String(Date.now()));
      } catch {
        // The network response is still useful when storage is unavailable.
      }
    }

    return posts;
  } catch (error) {
    const cached = readPostsCache();
    if (cached.length) {
      touchPostsCache();
      return cached;
    }
    throw error;
  }
}

export async function getPostDetail(slug, id) {
  const specificCacheKey = `${DETAIL_CACHE_KEY_PREFIX}${slug}_${id}`;
  try {
    const res = await fetch(`${API_URL}/${slug}/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const cached = localStorage.getItem(specificCacheKey);
      return safeParse(cached);
    }

    const data = await res.json();
    if (data) {
      localStorage.setItem(specificCacheKey, JSON.stringify(data));
    }
    return data;
  } catch (error) {
    const cached = localStorage.getItem(specificCacheKey);
    return safeParse(cached);
  }
}
