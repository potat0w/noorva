import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-6 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="font-serif text-4xl">Terms of Service</h1>
        <p className="text-muted-foreground">
          By using Noorva, you agree to provide accurate order details and use this site lawfully.
        </p>
        <p className="text-muted-foreground">
          Prices, stock, and delivery timelines may change without prior notice.
        </p>
        <p className="text-muted-foreground">
          Refunds and returns follow our shipping and return policy.
        </p>
        <Link href="/" className="underline underline-offset-4">
          Back to home
        </Link>
      </div>
    </main>
  )
}
