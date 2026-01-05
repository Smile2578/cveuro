export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Animated GEDS-style loader */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
          <div 
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-geds-blue animate-spin"
          ></div>
          <div 
            className="absolute inset-2 rounded-full border-4 border-transparent border-t-geds-cyan animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
          ></div>
        </div>
        <p className="text-sm text-gray-400 animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}

