export function ProgressBar({ progress, label }: { progress: number; label?: string }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label}</span>
          <span>%{Math.round(progress)}</span>
        </div>
      )}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-ios-blue transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
