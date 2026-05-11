import SkeletonList from "../components/SkeletonList";
import "./SkeletonDemo.css";

export default function SkeletonDemo() {
  return (
    <div className="skeleton-demo-page">
      <header className="page-header">
        <h1 className="page-header-title">
          Skeleton <span className="accent">Loader</span> Demo
        </h1>
        <p className="page-header-subtitle">
          Horizontal list shimmer loading animation
        </p>
      </header>
      <section className="section">
        <div className="skeleton-demo-grid">
          <div className="skeleton-demo-block">
            <h3 className="skeleton-demo-label">3 items</h3>
            <SkeletonList count={3} />
          </div>
          <div className="skeleton-demo-block">
            <h3 className="skeleton-demo-label">5 items</h3>
            <SkeletonList count={5} />
          </div>
        </div>
      </section>
    </div>
  );
}
