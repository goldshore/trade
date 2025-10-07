export default function DashboardPage() {
  return (
    <main className="wrapper">
      <section>
        <h1>Approvals overview</h1>
        <p>
          Monitor planner submissions, route execution requests, and track evaluator
          sign-off from a single unified surface.
        </p>
      </section>
      <section className="grid">
        <article>
          <h2>Pending strategies</h2>
          <p>No submissions yet. Strategies that require approval will surface here.</p>
        </article>
        <article>
          <h2>Execution holds</h2>
          <p>Execution halts, risk overrides, and notifier alerts roll up in this feed.</p>
        </article>
        <article>
          <h2>Audit log</h2>
          <p>Activity from the evaluator and planner services will populate chronologically.</p>
        </article>
      </section>
    </main>
  );
}
