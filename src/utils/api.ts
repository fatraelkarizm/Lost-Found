// utils/api.ts

// Ambil Base URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8889';

// Fungsi untuk mendapatkan JWT token (misalnya dari localStorage)
const getAuthToken = (): string | null => {
     return localStorage.getItem('jwtToken');
};

// Fungsi dasar untuk melakukan request
const request = async <T>(
     endpoint: string,
     method: string,
     data?: any,
     isFormData: boolean = false // Tambahan untuk handle FormData
): Promise<T> => {
     const url = `${API_BASE_URL}${endpoint}`;
     const token = getAuthToken();

     const headers: HeadersInit = {
          'Accept': 'application/json', 
     };

     if (token) {
          headers['Authorization'] = `Bearer ${token}`;
     }

     let body: BodyInit | undefined = undefined;

     if (data) {
          if (isFormData) {
               body = data; // FormData tidak perlu Content-Type manual
          } else {
               headers['Content-Type'] = 'application/json'; // Jika bukan FormData, asumsikan JSON
               body = JSON.stringify(data);
          }
     }

     try {
          const response = await fetch(url, {
               method,
               headers,
               body,
          });

          // Tangani respons HTTP
          if (!response.ok) {
               const errorBody = await response.json().catch(() => ({ message: response.statusText }));
               // Lempar error dengan detail yang lebih baik
               throw {
                    status: response.status,
                    message: errorBody.errors || errorBody.message || 'Something went wrong',
                    details: errorBody,
               };
          }

          // Jika respons 204 No Content, langsung kembalikan true atau object kosong
          if (response.status === 204) {
               return true as T; // Atau {} as T; tergantung kebutuhan
          }

          return await response.json() as T;
     } catch (error) {
          console.error(`API request to ${url} failed:`, error);
          throw error; // Melempar error agar bisa ditangkap di komponen yang memanggil
     }
};

// Objek API dengan method-method spesifik
const api = {
     // User & Auth
     login: (idToken: string) => request<any>('/api/login', 'POST', { id_token: idToken }),
     getUserByIdOrEmail: (idOrEmail: string) => request<any>(`/api/user/${idOrEmail}`, 'GET'),
     updateUserProfile: (idOrEmail: string, userData: any) => request<any>(`/api/user/${idOrEmail}`, 'PATCH', userData),

     // Category
     getCategories: () => request<any[]>('/api/category', 'GET'),
     createCategory: (categoryData: { name: string, slug: string }) => request<any>('/api/category', 'POST', categoryData),
     getCategoryByIdOrSlug: (idOrSlug: string) => request<any>(`/api/category/${idOrSlug}`, 'GET'),

     // Item
     getItems: (limit?: number, cursor?: string) => {
          let endpoint = '/api/item';
          const params = new URLSearchParams();
          if (limit) params.append('limit', limit.toString());
          if (cursor) params.append('cursor', cursor);
          if (params.toString()) endpoint += `?${params.toString()}`;
          return request<any>(endpoint, 'GET');
     },
     createItem: (itemData: any, imageFiles: File[]) => {
          const formData = new FormData();
          for (const key in itemData) {
               formData.append(key, itemData[key]);
          }
          imageFiles.forEach((file, index) => {
               formData.append(`images[${index}]`, file);
          });
          return request<any>('/api/item', 'POST', formData, true); // true untuk isFormData
     },
     getItemById: (idItem: string) => request<any>(`/api/item/${idItem}`, 'GET'),
     updateItem: (idItem: string, updateData: any) => request<any>(`/api/item/${idItem}`, 'PATCH', updateData),
     uploadItemImages: (idItem: string, imageFiles: File[]) => {
          const formData = new FormData();
          imageFiles.forEach((file, index) => {
               formData.append(`images[${index}]`, file);
          });
          return request<any>(`/api/item/${idItem}/images`, 'POST', formData, true);
     },
     deleteItemImages: (idItem: string, imageIds: string[]) => request<boolean>(`/api/item/${idItem}/images`, 'DELETE', { imageIds }),
     markItemAsFound: (idItem: string) => request<boolean>(`/api/item/${idItem}/found`, 'PATCH'),
     markItemAsNonActive: (idItem: string) => request<boolean>(`/api/item/${idItem}/nonactive`, 'PATCH'),

     // Comment
     createComment: (commentData: { itemId: string, userId: string, content: string, parentId?: string }) => request<any>('/api/comment', 'POST', commentData),
     getCommentsByItem: (idItem: string, limit?: number, cursor?: string) => {
          let endpoint = `/api/comment/getByItem/${idItem}`;
          const params = new URLSearchParams();
          if (limit) params.append('limit', limit.toString());
          if (cursor) params.append('cursor', cursor);
          if (params.toString()) endpoint += `?${params.toString()}`;
          return request<any>(endpoint, 'GET');
     },
     updateComment: (idComment: string, content: string) => request<any>(`/api/comment/${idComment}`, 'PATCH', { content }),
     deleteComment: (idComment: string) => request<boolean>(`/api/comment/${idComment}`, 'DELETE'),

     // Province & City (tambahan, belum ada di contoh sebelumnya tapi di API ada)
     getProvinces: () => request<any[]>('/api/province', 'GET'),
     getProvinceByIdOrSlug: (idOrSlug: string) => request<any>(`/api/province/${idOrSlug}`, 'GET'),
     getCities: () => request<any[]>('/api/city', 'GET'),
     getCityByIdOrSlug: (idOrSlug: string) => request<any>(`/api/city/${idOrSlug}`, 'GET'),

};

export default api;