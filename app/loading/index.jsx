import "./loading.scss";

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-animation">
        <div className="ring"></div>
        <div className="ring"></div>
        <div className="ring"></div>
        <span className="loading-text">Loading...</span>
      </div>
    </div>
  );
}
