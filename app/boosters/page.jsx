'use client';

import { useState } from 'react';
import ShopPage from '../shop/page';
import InventoryPage from '../inventory/page';
import UpgradePage from '../UpgradePage/page';
import './boosters.scss';

export default function BoostersPage() {
    const [activeTab, setActiveTab] = useState('upgrade');

    const renderContent = () => {
        switch (activeTab) {
            case 'upgrade':
                return <UpgradePage />;
            case 'shop':
                return <ShopPage />;
            case 'inventory':
                return <InventoryPage />;
            default:
                return <UpgradePage />;
        }
    };

    return (
        <div className="boosters-page">
            <div className="tab-switcher">
                <button
                    className={activeTab === 'upgrade' ? 'active' : ''}
                    onClick={() => setActiveTab('upgrade')}
                >
                    Улучшения
                </button>
                <button
                    className={activeTab === 'shop' ? 'active' : ''}
                    onClick={() => setActiveTab('shop')}
                >
                    Магазин
                </button>
                <button
                    className={activeTab === 'inventory' ? 'active' : ''}
                    onClick={() => setActiveTab('inventory')}
                >
                    Инвентарь
                </button>
            </div>

            <div className="content">
                {renderContent()}
            </div>
        </div>
    );
} 