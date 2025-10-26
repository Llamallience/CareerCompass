export function PageContainer({ children, className = "" }) {
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 ${className}`}>
      {children}
    </div>
  );
}
