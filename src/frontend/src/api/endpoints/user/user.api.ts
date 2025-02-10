import instance from '@/api/axios.instance';

export const userApi = {
  getProfile: async () => {
    const { data } = await instance.get('users/profile');
    return data;
  },
};
