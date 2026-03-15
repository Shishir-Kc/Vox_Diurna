const API_BASE_URL = 'https://vox-diurna-backend.onrender.com';
const API_URL = `${API_BASE_URL}/api/v1/posts`;

export async function getAllPosts() {
  try {
    const res = await fetch(API_URL, { 
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch posts:', res.statusText);
      return [];
    }
    
    const data = await res.json();
    
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      if (data.slug) {
        return [data];
      } else if (Array.isArray(data.posts)) {
        return data.posts;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export async function getPostDetail(slug, id) {
  try {
    const res = await fetch(`${API_URL}/${slug}/${id}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch post detail:', res.statusText);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching post detail:', error);
    return null;
  }
}

