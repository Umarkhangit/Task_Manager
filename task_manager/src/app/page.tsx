"use client";

// import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // const url = "http://localhost:3000/api/test-db"; // Replace with your API endpoint

  // useEffect(() => {
  //   fetch(url, {
  //     method: "POST", // Specify the HTTP method as POST
  //     headers: {
  //       "Content-Type": "application/json", // Indicate that the request body is JSON
  //       // Add any other necessary headers, e.g., 'Authorization': 'Bearer YOUR_TOKEN'
  //     },
  //   });
  // }, []);
  const session = sessionStorage?.getItem("auth") ?? "";
  console.log(session ? JSON.parse(session) : null);
  return (
    <div className="">
      <Link href="/signin" className="flex justify-end-safe m-2 text-blue-500">
        signin
      </Link>
      <h1 className="text-xl font-bold">Task Manager</h1>
    </div>
  );
}
