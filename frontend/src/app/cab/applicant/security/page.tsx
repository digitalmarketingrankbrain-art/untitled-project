export default function SecurityPage() {
  return (
    <div className="max-w-md px-6 py-8">
      <h1 className="font-display text-2xl font-semibold text-text">Security</h1>

      <section className="mt-6">
        <h2 className="font-sans text-sm font-semibold text-text">Signing in</h2>
        <p className="mt-1 font-sans text-sm text-text-muted">
          There&apos;s no password to manage — every sign-in sends a one-time code to your email instead.
        </p>
      </section>

      <section className="mt-8 border-t border-border pt-6">
        <h2 className="font-sans text-sm font-semibold text-text">Active sessions</h2>
        <p className="mt-1 font-sans text-sm text-text-muted">
          Viewing and revoking individual sessions isn&apos;t available yet. If you believe your account
          has been accessed without your permission, contact us right away.
        </p>
      </section>
    </div>
  );
}
