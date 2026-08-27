import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <h1 className="text-8xl sm:text-9xl font-normal text-apple-dark tracking-tight mb-6">
          404
        </h1>
        <p className="text-xl text-[#86868B] mb-10">
          Page not found.
        </p>
        <Link
          href="/"
          className="inline-block bg-apple-blue text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-apple-blue-hover transition-colors duration-200"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
