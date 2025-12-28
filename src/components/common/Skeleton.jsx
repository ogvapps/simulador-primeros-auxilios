import React from 'react';

const Skeleton = ({ className, height, width, circle }) => {
    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg ${className}`}
            style={{
                height: height,
                width: width,
                borderRadius: circle ? '50%' : undefined
            }}
        />
    );
};

export const DashboardSkeleton = () => {
    return (
        <div className="space-y-8 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-6">
                <div className="space-y-3 w-full max-w-lg">
                    <Skeleton height="2.5rem" width="60%" />
                    <Skeleton height="1rem" width="80%" />
                </div>
                <div className="flex gap-2">
                    <Skeleton width="4rem" height="4rem" className="rounded-2xl" />
                    <Skeleton width="4rem" height="4rem" className="rounded-2xl" />
                </div>
            </div>

            {/* Daily Challenge Skeleton */}
            <Skeleton height="12rem" className="w-full rounded-3xl" />

            {/* Locked Mode Skeleton */}
            <Skeleton height="6rem" className="w-full rounded-2xl" />

            {/* Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm h-48 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                            <Skeleton circle width="3rem" height="3rem" />
                            <Skeleton width="4rem" height="1.5rem" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton height="1.25rem" width="70%" />
                            <Skeleton height="0.75rem" width="90%" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Skeleton;
