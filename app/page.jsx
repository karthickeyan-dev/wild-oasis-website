import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>The Wild Oasis. Welcome to the Paradise</h1>
      <Link href="/cabins">Explore luxury cabins</Link>
    </div>
  );
}
