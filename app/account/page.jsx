import { auth } from "../_lib/auth";

export const metadata = {
  title: "Guest Area",
};

export default async function page() {
  const session = await auth();
  return (
    <div>
      <h2 className="mb-7 text-2xl font-semibold text-accent-400">
        Welcome, {session.user.name}
      </h2>
    </div>
  );
}
