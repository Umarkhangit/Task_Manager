"use client";

import { useEffect } from "react";

export default function Home() {
  const url = "http://localhost:3000/api/test-db"; // Replace with your API endpoint

  useEffect(() => {
    fetch(url, {
      method: "POST", // Specify the HTTP method as POST
      headers: {
        "Content-Type": "application/json", // Indicate that the request body is JSON
        // Add any other necessary headers, e.g., 'Authorization': 'Bearer YOUR_TOKEN'
      },
    });
  }, []);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      Next js
    </div>
  );
}
