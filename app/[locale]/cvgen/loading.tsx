export default function CVGenLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      {/* Animated CV Builder loader */}
      <div className="text-center space-y-6">
        {/* Animated form skeleton */}
        <div className="relative w-72 sm:w-80 mx-auto">
          {/* Card container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border border-gray-100">
            {/* Header skeleton */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-geds-blue/20 to-geds-cyan/20 animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-gradient-to-r from-geds-blue/20 to-geds-cyan/20 rounded animate-pulse" />
                <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>
            
            {/* Form fields skeleton */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-50 rounded-lg border border-gray-100 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-50 rounded-lg border border-gray-100 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <div className="h-3 w-28 bg-gray-100 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-50 rounded-lg border border-gray-100 animate-pulse" />
              </div>
            </div>

            {/* Progress bar skeleton */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between mb-2">
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-8 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-geds-blue to-geds-cyan rounded-full animate-[loading_1.5s_ease-in-out_infinite]"
                  style={{ width: '30%' }}
                />
              </div>
            </div>
          </div>

          {/* Floating decorative elements */}
          <div className="absolute -top-3 -right-3 w-8 h-8 bg-geds-cyan/10 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-geds-blue/10 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-geds-blue font-medium animate-pulse">
            Préparation du formulaire...
          </p>
          <p className="text-sm text-gray-400">
            Chargement de vos données
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex justify-center gap-1.5">
          <div className="w-2 h-2 bg-geds-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-geds-cyan rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
          <div className="w-2 h-2 bg-geds-green rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>
    </div>
  );
}

