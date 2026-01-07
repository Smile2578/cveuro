export default function CVGenLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-[hsl(var(--geds-cyan)/0.05)]">
      {/* Navbar placeholder */}
      <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-gray-100" />
      
      {/* Content */}
      <main className="flex-1 container mx-auto px-4 mt-24 mb-8">
        <div className="mx-auto bg-white rounded-3xl shadow-xl shadow-[hsl(var(--geds-blue)/0.05)] p-4 sm:p-6 md:p-8 max-w-3xl">
          {/* Header skeleton */}
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-geds-blue/20 to-geds-cyan/20 animate-pulse" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 bg-gray-100 rounded animate-pulse" />
              <div className="h-3 w-56 bg-gray-50 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Form fields skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-50 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Button skeleton */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
            <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-gradient-to-r from-geds-blue/30 to-geds-cyan/30 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  );
}
