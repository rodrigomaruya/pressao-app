export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white/60 dark:bg-slate-900/60">
      <div className="text-center">
        <div
          role="status"
          aria-label="Carregando"
          className="mx-auto w-16 h-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"
        />
        <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    </div>
  );
}
