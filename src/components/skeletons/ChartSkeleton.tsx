export default function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="h-32 w-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-24 mx-auto"></div>
      </div>
    </div>
  );
}
