import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-end px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}