import Link from 'next/link';
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="px-4 py-6 bg-white flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-800">Sebastian Boehler</div>
            <nav className="space-x-4">
                <Link className="text-gray-600 hover:text-gray-800" href="#">
                    Portfolio
                </Link>
            </nav>
        </header>
    );
};

export default Header;
