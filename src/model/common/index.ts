import { axios } from 'src/dao/index';

export function uploadFile<T>(form: FormData | File): Promise<T> {
  if (form.constructor === FormData) {
    return axios.post('/upload/image', form);
  } else {
    const data = new FormData();
    data.append('file', form as File);
    return axios.post('/upload/image', data);
  }
}
