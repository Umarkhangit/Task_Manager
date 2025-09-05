import Link from "next/link";

export default function Home() {
  return (
    <div className="">
      <Link href="/signin" className="flex justify-end-safe m-2 text-blue-500">signin</Link>
      <h1 className="text-xl font-bold">Task Manager</h1>
    </div>
  );
}
