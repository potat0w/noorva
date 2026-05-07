import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-serif text-4xl">Privacy Policy</h1>
        <p className="text-muted-foreground">
          We collect only the information needed to process orders, deliver products, and provide support.
        </p>
        <p className="text-muted-foreground">
          Your account and order data are used only for Noorva services and are never sold to third parties.
        </p>
        <p className="text-muted-foreground">
          For any privacy request, contact our support team.
        </p>
        <Link href="/" className="underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </main>
  )
}
