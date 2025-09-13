export default function RevenueChart() {
    return (
        <div className="bg-white p-4 rounded-lg shadow mt-4">
            <div className="flex justify-between mb-4">
                <div className="">Revenue Report</div>
                <select className="border rounded">
                    <option>Day</option>
                    <option>Week</option>
                    <option>Month</option>
                    <option>Year</option>
                </select>
            </div>
            <div className="h-40 flex items-center justify-center bg-gray-100">
                <div>Chart Placeholder (e.g., Chart.js)</div>
            </div>
        </div>
    );
}