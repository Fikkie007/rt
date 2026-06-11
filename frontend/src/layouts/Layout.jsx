// layouts/Layout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function Layout() {
    return (
        <div className="h-screen flex flex-col">
            <Navbar />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar />

                <main className="flex-1 min-h-0 flex flex-col overflow-y-auto bg-gray-100 dark:bg-gray-900">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}