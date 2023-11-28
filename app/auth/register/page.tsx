import Link from "next/link";

export default function Register() {
  return (
    <main>
      <div>
        <span>Already have an account?</span>
        <Link href="/auth/login">Login</Link>
      </div>
    </main>
  );
}
