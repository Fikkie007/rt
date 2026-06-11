import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Wallet,
    Calculator
} from 'lucide-react';

const menuItems = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Rumah',
        path: '/rumah',
        icon: Home,
    },
    {
        name: 'Pembayaran',
        path: '/pembayaran',
        icon: Wallet,
    },
    {
        name: 'Iuran',
        path: '/iuran',
        icon: Calculator,
    },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                                }`
                            }
                        >
                            <Icon size={20} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}