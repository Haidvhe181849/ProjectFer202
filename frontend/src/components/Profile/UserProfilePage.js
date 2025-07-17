// components/Profile/UserProfilePage.js
import React, { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import ChangePassword from './ChangePassword';
import CartSummary from './CartSummary';
import OrderHistory from './OrderHistory';
import AccountInfo from './AccountInfo';


export default function UserProfilePage({ user, onLogout, cartCount, updateCartCount }) {
    const [activeTab, setActiveTab] = useState('profile');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <AccountInfo
                        user={user}
                        onLogout={onLogout}
                        cartCount={cartCount}
                    />
                );
            case 'password':
                return <ChangePassword userID={user.userID} />;
            case 'cart':
                return (
                    <CartSummary
                        userID={user.userID}
                        updateCartCount={updateCartCount}
                    />
                );
            case 'orders':
                return <OrderHistory userID={user.userID} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#fdfaf4] text-gray-800">
            
            <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-6">
                <SidebarMenu active={activeTab} onChange={setActiveTab} />
                <div className="col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}