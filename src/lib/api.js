// During development, we use Vite proxy (relative /api path) to avoid CORS.
const isDev = import.meta.env.DEV;
const API_BASE_URL = isDev ? "" : (import.meta.env.VITE_SERVER_BASE_URL || 'https://vox-studio.kc-dev-py.workers.dev');
const API_URL = `${API_BASE_URL}/vox/posts`;

const POSTS_CACHE_KEY = 'vox_diurna_posts_cache';
const DETAIL_CACHE_KEY_PREFIX = 'vox_diurna_post_';

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function getAllPosts() {
  try {
    const res = await fetch(API_URL, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      const cached = localStorage.getItem(POSTS_CACHE_KEY);
      return safeParse(cached) ?? [];
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
      localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(posts));
    }

    return posts;
  } catch (error) {
    const cached = localStorage.getItem(POSTS_CACHE_KEY);
    return safeParse(cached) ?? [];
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
