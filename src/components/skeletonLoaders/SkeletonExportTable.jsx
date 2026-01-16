const SkeletonExportTable = ({ columns = 8, rows = 10 }) => {
    return (
        <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="flex bg-gray-200 sticky top-0 z-10 text-[10px]">
                {Array.from({ length: columns }).map((_, i) => (
                    <div
                        key={i}
                        className="px-2 py-2 border-r flex-1"
                    >
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                ))}
            </div>

            {/* Row Skeletons */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex border-b text-[10px]">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="px-2 py-2 flex-1 border-r"
                        >
                            <div className="h-3 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default SkeletonExportTable;