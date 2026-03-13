const SERVER_BASE_URL = process.env.SERVER_BASE_URL;
const API_URL = `${SERVER_BASE_URL}api/v1/posts`;

export async function getAllPosts() {
  try {
    const res = await fetch(API_URL, { 
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!res.ok) {
      console.error('Failed to fetch posts:', res.statusText);
      return [];
    }
    
    const data = await res.json();
    
    // Ensure we return an array
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      if (data.slug) {
        // It's a single post object, wrap it in an array
        return [data];
      } else if (Array.isArray(data.posts)) {
        // It's an object containing a posts array
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
      next: { revalidate: 60 }, // Cache for 60 seconds
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

