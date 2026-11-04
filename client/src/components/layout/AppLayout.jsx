import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { TransactionModal } from '../transactions/TransactionModal';

export const AppLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTransactionAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Outlet provides refreshTrigger so child pages can refresh when new entry added via global modal */}
          <Outlet context={{ refreshTrigger, onOpenAddModal: () => setIsAddModalOpen(true) }} />
        </main>
      </div>

      {/* Global Add Entry Modal */}
      <TransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleTransactionAdded}
      />
    </div>
  );
};
