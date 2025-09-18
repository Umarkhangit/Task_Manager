import Userprofile from "@/components/user-profile";


export default function Home() {
  
  return (
    <div>
      <span className="flex justify-end-safe m-1.5">
        <Userprofile />
      </span>
      <h1 className="text-xl font-bold">Task Manager</h1>
    </div>
  );
}
