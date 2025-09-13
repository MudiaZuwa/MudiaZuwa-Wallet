const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-800 flex flex-col text-gray-300">
      {/* Header */}
      <header className="bg-gray-700 shadow-md py-4 px-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-green-400">MudiaZuwa Wallet</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex justify-center p-6">{children}</main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-400 text-sm border-t border-gray-700">
        © {new Date().getFullYear()} MudiaZuwa Wallet
      </footer>
    </div>
  );
};

export default Layout;
