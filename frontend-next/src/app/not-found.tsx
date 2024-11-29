export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-white/90">Page not found</p>
        <a href="/" className="text-white underline mt-4 inline-block">
          Go back home
        </a>
      </div>
    </div>
  );
}
