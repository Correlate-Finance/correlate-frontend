import { toast } from '@/components/ui/use-toast';

export default async function handleResponseStatus(response: Response) {
  if (response.status === 401) {
    toast({
      title: response.statusText,
      description:
        'Your credentials are invalid. Please login again to access this feature',
      action: (
        <button
          onClick={() => {
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
  const parsed = await response.json();
  return await parsed;
}
