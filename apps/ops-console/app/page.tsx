export default function OpsConsolePage() {
  return (
    <main className="wrapper">
      <header>
        <h1>Operational console</h1>
        <p>
          Track the lifecycle of trading plans as they transition from planning to
          execution, evaluation, and notification.
        </p>
      </header>
      <section className="panels">
        <article>
          <h2>Service health</h2>
          <ul>
            <li>Planner API · nominal</li>
            <li>Executor API · nominal</li>
            <li>Market data API · nominal</li>
          </ul>
        </article>
        <article>
          <h2>Alerts feed</h2>
          <p>Notifier events will appear here once integrations are configured.</p>
        </article>
        <article>
          <h2>Evaluator insights</h2>
          <p>Risk scoring, scenario metrics, and compliance notes surface for review.</p>
        </article>
      </section>
    </main>
  );
}
