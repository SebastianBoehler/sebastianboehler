export interface TimeLineCardProps {
    title: string;
    description: string;
    date: string;
    icon?: React.ReactNode;

}
export function TimeLineCard({ title, date, description }: TimeLineCardProps) {
    return (<div className="py-8 flex space-x-4">
        <span className="flex-shrink-0 text-gray-400 text-sm">{date}</span>
        <div className="space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-gray-500">
                {description}
            </p>
        </div>
    </div>)
}
