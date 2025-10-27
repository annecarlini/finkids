type ProgressBarProps = {
  value: number; // 0 a 100
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="progress-wrapper" style={{
      marginLeft: "17rem", 
      width: "20rem",
      height: "0.50rem",
      backgroundColor: "#ffffff",
      borderRadius: "0.5rem",
      border: "1px solid #e97e34",
      overflow: "hidden"
    }}>
      <div
        className="progress-fill"
        style={{
          width: `${value}%`,
          height: "100%",
          backgroundColor: "#e97e34",
          transition: "width 0.5s ease"
        }}
      />
    </div>
  );
}
