import { Link } from "react-router-dom";

export function TodoNotFoundState({ backUrl = "/", message = "Todo not found" }) {
  return (
    <div className="setup-card details-content-card">
      <h2>{message}</h2>
      <div className="accessory-view" style={{ borderBlockStart: "none", marginBlockStart: 0, paddingBlockStart: 0 }}>
        <Link to={backUrl} className="btn btn-secondary">
          Back to Todo List
        </Link>
      </div>
    </div>
  );
}
