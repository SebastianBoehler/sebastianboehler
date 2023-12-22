import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { FC } from "react";

interface props {
    title: string,
    description: string,
    link?: string,
    badge?: string
    linkText?: string
}

const ProjectsCard: FC<props> = ({ title, badge, link, description, linkText }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="grid gap-1">
                    <CardTitle>{title}</CardTitle>
                </div>
                {badge && <Badge className="bg-gray-100 text-black">{badge}</Badge>}
            </CardHeader>
            <CardContent className="grid gap-2">
                <CardDescription className="text-sm md:text-base lg:text-lg text-left">
                    {description}
                </CardDescription>
                {link && <Button variant="link">
                    <Link href={link} target="_blank" >{linkText}</Link>
                </Button>}
            </CardContent>
        </Card>
    )
}

export default ProjectsCard;
