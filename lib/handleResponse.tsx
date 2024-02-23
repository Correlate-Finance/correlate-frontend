import { toast } from '@/components/ui/use-toast';
import Cookies from 'js-cookie';

export default async function handleResponseStatus(response: Response) {
  if (response.status === 401) {
    toast({
      title: response.statusText,
      description:
        'Your credentials are invalid. Please login again to access this feature',
      action: (
        <button
          onClick={() => {
            Cookies.remove('session');
            window.localStorage.removeItem('loggedIn');
            window.localStorage.removeItem('session');
            window.dispatchEvent(new Event('storage'));
            window.location.href = '/login';
          }}
          className="text-blue-500 underline"
        >
          Login
        </button>
      ),
    });
    return null;
  }
  if (!response.ok) {
    toast({
      title: response.statusText,
      description: 'An error occurred',
    });
    return null;
  }
  return await response.json();
}
