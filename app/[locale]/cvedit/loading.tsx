export default function CVEditLoading() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50">
      {/* CV Preview loader */}
      <div className="text-center space-y-6">
        {/* Split view skeleton - mimics the editor layout */}
        <div className="flex gap-4 w-full max-w-4xl mx-auto px-4">
          {/* Left panel - Form */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-5 space-y-4 border border-gray-100 hidden sm:block">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-geds-blue/20 to-geds-cyan/20 animate-pulse" />
              <div className="h-4 w-28 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="h-9 w-full bg-gray-50 rounded-lg border border-gray-100 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Right panel - CV Preview */}
          <div className="flex-1 bg-white rounded-xl shadow-lg p-5 border border-gray-100">
            {/* CV Header */}
            <div className="flex items-start gap-4 pb-4 border-b border-gray-100 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-geds-blue/10 to-geds-cyan/10 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 bg-gradient-to-r from-geds-blue/20 to-geds-cyan/20 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-3 w-40 bg-gray-100 rounded animate-pulse" />
              </div>
            </div>

            {/* CV Sections */}
            <div className="space-y-4">
              {['Formation', 'Expérience', 'Compétences'].map((section, idx) => (
                <div key={section} className="space-y-2">
                  <div 
                    className="h-4 bg-gradient-to-r from-geds-blue/20 to-geds-cyan/20 rounded animate-pulse"
                    style={{ width: `${60 + idx * 10}px` }}
                  />
                  <div className="space-y-1.5 pl-2 border-l-2 border-gray-100">
                    <div className="h-3 w-full bg-gray-50 rounded animate-pulse" />
                    <div className="h-3 w-3/4 bg-gray-50 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-geds-blue font-medium animate-pulse">
            Chargement de votre CV...
          </p>
          <p className="text-sm text-gray-400">
            Récupération des données
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

