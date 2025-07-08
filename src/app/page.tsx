import UrlForm from "./components/UrlForm";
import LinkList from "./components/LinkList";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* URL Form Section */}
        <div className="w-full max-w-md mx-auto mt-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-900 dark:text-white">
            Save link
          </h2>
          <UrlForm />
        </div>
        
        {/* Links List Section */}
        <LinkList />
      </main>
    </div>
  );
}
