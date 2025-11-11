export const Loading = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
    <div
      className="spinner"
      style={{
        border: "4px solid #f3f3f3",
        borderTop: "4px solid #0891b2",
        borderRadius: "50%",
        width: 30,
        height: 30,
        animation: "spin 1s ease infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);
