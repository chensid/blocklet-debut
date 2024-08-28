import { redirect } from 'react-router-dom';

const checkAuth = async () => {
  const token = await sessionStorage.getItem('token');
  if (token) {
    return true;
  }
  return false;
};

const authLoader = async () => {
  const isAuth = await checkAuth();
  if (!isAuth) {
    return redirect('/login');
  }
  return null;
};

export default authLoader;
