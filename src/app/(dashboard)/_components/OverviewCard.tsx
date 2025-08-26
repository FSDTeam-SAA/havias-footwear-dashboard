
interface card {
    title: string
    value: string,
    icon: string
}

export default function OverviewCard({ title, value, icon }: card) {
    return (
        <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-gray-500 text-sm">{title}</div>
            <div className="text-2xl font-bold text-green-600">{value}</div>
            <div className="text-gray-400">{icon}</div>
        </div>
    );
}